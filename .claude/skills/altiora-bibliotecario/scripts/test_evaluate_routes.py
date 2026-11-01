import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import evaluate_routes as evaluator


class RoutingEvaluationTests(unittest.TestCase):
    def suite(self, **changes):
        case = {'id': 'audio', 'query': 'audio-production',
                'expected_any': ['audio-production'], 'forbidden': ['api-security'],
                'constraint': 'Listening requires separate evidence'}
        case.update(changes)
        return {'schema_version': 1, 'top_k': 2, 'cases': [case]}

    def catalog(self):
        return {'entries': [
            {'name': 'api-security', 'description': 'security endpoints', 'path': 'distractor'},
            {'name': 'audio-production', 'description': 'sound voice music', 'path': 'audio'}]}

    def test_relevant_candidate_wins_over_distractor(self):
        report = evaluator.evaluate(self.catalog(), self.suite())
        self.assertEqual(report['status'], 'PASS')
        self.assertEqual(report['results'][0]['first_expected_rank'], 1)
        self.assertEqual(report['token_savings'], 'NOT_MEASURED')

    def test_missing_expected_is_failure_not_empty_success(self):
        report = evaluator.evaluate({'entries': []}, self.suite())
        self.assertEqual(report['status'], 'FAIL')

    def test_forbidden_candidate_fails_even_with_expected_hit(self):
        suite = self.suite(query='audio-production api-security')
        self.assertEqual(evaluator.evaluate(self.catalog(), suite)['status'], 'FAIL')

    def test_negative_requires_actual_abstention(self):
        self.assertEqual(evaluator.evaluate(self.catalog(), self.suite(query='qzxv', expected_any=[]))['status'], 'PASS')
        self.assertEqual(evaluator.evaluate(self.catalog(), self.suite(expected_any=[]))['status'], 'FAIL')

    def test_function_words_abstain_but_relevant_word_survives(self):
        catalog = {'entries': [{'name': 'unrelated', 'description': 'Usar para ayudar con esto', 'path': 'one'},
                               {'name': 'audio-production', 'description': 'Sonido y mezcla', 'path': 'two'}]}
        self.assertEqual(evaluator.library.find(catalog, 'Por favor quiero que me ayudes con esto para mí'), [])
        self.assertEqual(evaluator.library.find(catalog, 'Por favor quiero audio-production')[0]['name'], 'audio-production')

    def test_spanish_writing_intent_matches_english_metadata_over_distractor(self):
        catalog = {'entries': [{'name': 'brand-strategy', 'description': 'tono marca oferta', 'path': 'brand'},
                               {'name': 'copywriting', 'description': 'copy_variants audiencia oferta tono', 'path': 'copy'}]}
        self.assertEqual(evaluator.library.find(catalog, 'Redactar textos para la oferta con tono de marca', 1)[0]['name'], 'copywriting')

    def test_cli_explicit_checkout_root_does_not_use_default_catalog(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / 'skills' / 'test-only-skill').mkdir(parents=True)
            (root / '.claude' / 'agents').mkdir(parents=True)
            (root / 'skills' / 'test-only-skill' / 'SKILL.md').write_text(
                '---\nname: explicit-root-only\ndescription: Singular fixture capability\n---\n', encoding='utf-8')
            suite = self.suite(query='explicit-root-only', expected_any=['explicit-root-only'], forbidden=[])
            suite['cases'][0]['constraint'] = 'Revisión española: evidencia auténtica'
            cases = root / 'cases.json'
            cases.write_text(json.dumps(suite), encoding='utf-8')
            result = subprocess.run([sys.executable, str(Path(evaluator.__file__)),
                                     '--root', str(root), '--cases', str(cases), '--json'],
                                    capture_output=True, encoding='utf-8', timeout=30,
                                    env={**os.environ, 'PYTHONIOENCODING': 'cp1252'})
            self.assertEqual(result.returncode, 0, result.stderr)
            report = json.loads(result.stdout)
            self.assertEqual(report['entries'], 1)
            self.assertEqual(report['results'][0]['constraint_not_executed'], 'Revisión española: evidencia auténtica')
            self.assertEqual(report['results'][0]['candidate_names'], ['explicit-root-only'])

    def test_top_k_cannot_hide_unbounded_context(self):
        suite = self.suite()
        for invalid in (0, 11, True, '5'):
            suite['top_k'] = invalid
            with self.assertRaises(ValueError):
                evaluator.evaluate(self.catalog(), suite)

    def test_duplicate_and_contradictory_cases_rejected(self):
        suite = self.suite()
        suite['cases'] *= 2
        with self.assertRaises(ValueError):
            evaluator.evaluate(self.catalog(), suite)
        with self.assertRaises(ValueError):
            evaluator.evaluate(self.catalog(), self.suite(forbidden=['audio-production']))

    def test_portable_repository_fixtures(self):
        catalog = evaluator.library.build([evaluator.REPO_ROOT / 'skills', evaluator.REPO_ROOT / '.claude' / 'agents'])
        suite = json.loads(evaluator.DEFAULT_CASES.read_text(encoding='utf-8'))
        report = evaluator.evaluate(catalog, suite)
        self.assertEqual(report['status'], 'PASS', json.dumps(report['results'], ensure_ascii=False))


if __name__ == '__main__':
    unittest.main()
