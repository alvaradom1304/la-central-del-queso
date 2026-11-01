#!/usr/bin/env python3
"""Validar envelope y trazabilidad; no sustituye revisión del contenido."""
import argparse,json
from pathlib import Path
import jsonschema,yaml

def resolve(root,name):
 for p in root.glob('*/SKILL.md'):
  if yaml.safe_load(p.read_text().split('---',2)[1])['name']==name:return p.parent
 raise ValueError('Unknown skill: '+name)

def outputs(value):
 if isinstance(value,dict):
  if all(k in value for k in ['task_id','skill','version','status','result','evidence','validation']):yield value
  for v in value.values():yield from outputs(v)
 elif isinstance(value,list):
  for v in value:yield from outputs(v)

def validate(root,value):
 errors=[];count=0
 for o in outputs(value):
  count+=1;name=o['skill']
  try:jsonschema.Draft202012Validator(json.loads((resolve(root,name)/'references/output-schema.json').read_text())).validate(o)
  except Exception as e:errors.append(name+': schema '+str(e));continue
  ids=[e['id'] for e in o['evidence']]
  if len(ids)!=len(set(ids)):errors.append(name+': duplicate evidence IDs')
  referenced=[ref for b in o['result'].values() for ref in b['evidence_ids']]+[ref for c in o['validation'] for ref in c['evidence_ids']]
  if set(referenced)-set(ids):errors.append(name+': unresolved evidence '+str(set(referenced)-set(ids)))
  for v in o['validation']:
   if not v['performed'] and v['outcome'] in ['PASS','FAIL']:errors.append(name+': NOT_RUN claimed as performed result')
   if v['performed'] and v['outcome']=='NOT_RUN':errors.append(name+': performed/NOT_RUN mismatch')
  if o['status']=='SUCCESS' and not any(v['performed'] and v['outcome']=='PASS' for v in o['validation']):errors.append(name+': SUCCESS without verification')
 return {'outputs':count,'errors':errors,'kind':'SCHEMA_AND_TRACE_ONLY'}
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('--root',type=Path,required=True);a.add_argument('--file',type=Path,required=True);args=a.parse_args();r=validate(args.root,json.loads(args.file.read_text()));print(json.dumps(r,ensure_ascii=False));raise SystemExit(bool(r['errors']))
