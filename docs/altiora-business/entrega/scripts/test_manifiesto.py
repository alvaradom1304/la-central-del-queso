import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('manifiesto.py')


def run(*args):
    return subprocess.run([sys.executable, str(SCRIPT), *args], capture_output=True, text=True, encoding='utf-8')


class ManifiestoTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        base = Path(self.tmp.name)
        self.root = base / 'proyecto'
        (self.root / 'app').mkdir(parents=True)
        (self.root / 'node_modules' / 'x').mkdir(parents=True)
        (self.root / 'app' / 'page.tsx').write_text('export default 1\n', encoding='utf-8')
        (self.root / 'README.md').write_text('hola\n', encoding='utf-8')
        (self.root / 'node_modules' / 'x' / 'i.js').write_text('ignorar\n', encoding='utf-8')
        self.man = base / 'manifiesto.json'

    def tearDown(self):
        self.tmp.cleanup()

    def crear(self):
        r = run('crear', '--root', str(self.root), '--salida', str(self.man), 'app', 'README.md')
        self.assertEqual(r.returncode, 0, r.stderr)

    def test_pass_cuando_no_cambia(self):
        self.crear()
        files = json.loads(self.man.read_text(encoding='utf-8'))['files']
        self.assertEqual(sorted(files), ['README.md', 'app/page.tsx'])
        r = run('verificar', '--manifiesto', str(self.man))
        self.assertEqual(r.returncode, 0)
        self.assertEqual(json.loads(r.stdout)['status'], 'PASS')

    def test_fail_si_cambia_o_falta(self):
        self.crear()
        (self.root / 'app' / 'page.tsx').write_text('export default 2\n', encoding='utf-8')
        (self.root / 'README.md').unlink()
        r = run('verificar', '--manifiesto', str(self.man))
        self.assertEqual(r.returncode, 1)
        issues = {d['file']: d['issue'] for d in json.loads(r.stdout)['differences']}
        self.assertEqual(issues, {'app/page.tsx': 'CHANGED', 'README.md': 'MISSING'})

    def test_salida_dentro_del_proyecto_rechazada(self):
        r = run('crear', '--root', str(self.root), '--salida', str(self.root / 'm.json'), 'app')
        self.assertNotEqual(r.returncode, 0)
        self.assertFalse((self.root / 'm.json').exists())

    def test_ruta_fuera_de_root_rechazada(self):
        r = run('crear', '--root', str(self.root / 'app'), '--salida', str(self.man), '../README.md')
        self.assertNotEqual(r.returncode, 0)


if __name__ == '__main__':
    unittest.main()
