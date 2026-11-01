# ARCHITECTURE PROPOSAL
*Master Skills Implementation Directive - Fase 0*

## Arquitectura de Directorios Propuesta para AEM OS

Para mantener compatibilidad nativa con la herramienta de IA subyacente, el ecosistema empresarial se anidará estructuralmente dentro de `.agents/` utilizando el mecanismo estándar de Skills de Antigravity:

```text
.agents/
  ├── kernel/
  │   └── aem-constitution.md
  │   └── aem-autonomous-quality-loop/ (Skill de validación y ciclos FASE 5)
  │
  ├── skills/
  │   ├── 01_business_intelligence/
  │   ├── 02_venture_building/
  │   ├── 03_enterprise_growth/
  │   ├── 04_sales_intelligence/
  │   ├── 05_marketing_intelligence/
  │   ├── 06_branding_creative/
  │   ├── 07_web_experience/
  │   ├── 08_cybersecurity/
  │   └── 09_ai_automation/
  │
  ├── agents/
  │   └── quality_council/ (Revisores multidisciplinarios FASE 6)
  │   └── company_builder_orchestrator/
  │
  └── workflows/
```

## Estándar de la "Skill Factory" (Fase 3)
Cada capacidad dentro de los dominios mencionados operará bajo una arquitectura multi-archivo (donde sea necesario):
- `SKILL.md` (Metadata YAML con Name, Description y el procedimiento paso a paso).
- `references/` (Para alojar resúmenes metodológicos como SPIN Selling o Lean Startup sin saturar el prompt principal).
- `tests/` (Para validación autónoma requerida en FASE 5).
