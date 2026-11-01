#!/usr/bin/env python3
"""Validación estructural, sin confundirla con ejecución real de skills."""
import argparse,json,re
from pathlib import Path
import yaml,jsonschema
FIELDS='name version domain type purpose business_outcome when_to_use when_not_to_use triggers required_inputs optional_inputs dependencies tools knowledge_sources procedure decision_rules outputs output_schema quality_criteria validation failure_conditions escalation_conditions security_considerations human_approval_requirements kpis examples related_skills version_history status owner'.split()
def inspect(root):
 errors=[]; names={}; contracts={}
 for p in root.glob('*/SKILL.md'):
  try:
   txt=p.read_text();meta=yaml.safe_load(txt.split('---',2)[1]);name=meta['name']
   if name in names:errors.append('duplicate name: '+name)
   names[name]=p.parent
   if not re.fullmatch(r'[a-z0-9-]{1,64}',name):errors.append('name invalid: '+name)
   if not meta.get('description'):errors.append('description missing: '+name)
   ref=p.parent/'references';cp=ref/'contract.json'
   if cp.exists():
    c=json.loads(cp.read_text());contracts[name]=c
    if set(FIELDS)-set(c):errors.append(name+': missing contract fields '+str(set(FIELDS)-set(c)))
    if c.get('name')!=name:errors.append(name+': contract mismatch')
    for f in ['input-schema.json','output-schema.json']:
     schema=json.loads((ref/f).read_text());jsonschema.Draft202012Validator.check_schema(schema)
    cases=json.loads((ref/'evaluation-cases.json').read_text())['cases']
    if len({v['kind'] for v in cases})!=6:errors.append(name+': case kinds')
    if len(c['procedure'])<3:errors.append(name+': procedure too short')
   for link in re.findall(r'\]\(([^)]+)\)',txt):
    if '://' not in link and not link.startswith('#') and not (p.parent/link).exists():errors.append(name+': broken link '+link)
  except Exception as e:errors.append(str(p)+': '+repr(e))
 deps={}
 for name,c in contracts.items():
  deps[name]=c['dependencies']
  for d in c['dependencies']:
   if d not in names:errors.append(name+': unresolved dependency '+d)
 visiting=set();done=set()
 def walk(n):
  if n in visiting:errors.append('dependency cycle at '+n);return
  if n in done:return
  visiting.add(n)
  for x in deps.get(n,[]):walk(x)
  visiting.remove(n);done.add(n)
 for n in deps:walk(n)
 return {'kind':'STRUCTURAL_ONLY','skills':len(names),'full_contracts':len(contracts),'errors':errors,'names':sorted(names)}
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('--root',type=Path,required=True);a.add_argument('--report',type=Path);args=a.parse_args();r=inspect(args.root)
 if args.report:args.report.write_text(json.dumps(r,ensure_ascii=False,indent=2))
 print(json.dumps({k:v for k,v in r.items() if k!='names'},ensure_ascii=False));raise SystemExit(bool(r['errors']))
