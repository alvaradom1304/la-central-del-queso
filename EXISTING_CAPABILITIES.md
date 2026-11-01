# EXISTING CAPABILITIES INVENTORY
*Master Skills Implementation Directive - Fase 0*

## 1. Skills Existentes (Directorio `.agents/skills/`)
1. `aem-core-philosophy`: Constitución y visión del sistema.
2. `aem-stage-01-discovery`: Capacidad base de diagnóstico.
3. `aem-stage-02-research`: Capacidad base de investigación de mercado.
4. `aem-stage-03-strategy`: Dirección estratégica base.
5. `aem-stage-04-brand`: Identidad y branding.
6. `aem-stage-05-digital`: Diseño UX/UI e integración Web.
7. `aem-stage-06-automation`: Automatizaciones base.
8. `aem-stage-07-growth`: Crecimiento y analítica.
9. `aem-learning-os`: Extracción y asimilación de conocimiento.

## 2. Agentes Existentes (Hardcoded en Python)
- `brand_analyzer.py`, `digital_analyzer.py`, `research_analyzer.py`, etc.
- **Limitación actual:** Son ejecutores lineales (scripts de Python), no agentes autónomos orquestados con el formato `Antigravity`.

## 3. Workflows Activos
- **WhatsApp Order Intake:** Conexión asíncrona Next.js -> n8n -> Google Sheets (`src/automation/workflows/01_order_intake_google_sheets.json`).
