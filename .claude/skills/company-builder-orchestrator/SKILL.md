---
name: company-builder-orchestrator
description: "Clasifica un caso empresarial en los escenarios AEM A–H (crear, mejorar, vender más, posicionar, operar, digitalizar, escalar, internacionalizar) y propone las 2–3 skills disponibles para empezar. Usar ante un requerimiento corporativo abstracto o un cliente nuevo sin encargo concreto; si ya es venta o entrega de proyecto, usar los directores de Altiora."
---

# Clasificador AEM de casos empresariales

Regla: evidencia antes que opinión; resultado de negocio antes que ejecución. Esta skill clasifica y enruta; no sustituye a las especialidades ni autoriza contactar, gastar o publicar.

## Cuándo no usarla

- Vender un proyecto de Altiora (prospecto, entrevista, propuesta, cierre): `altiora-commercial-director`.
- Entregar un proyecto contratado: `altiora-project-director`.
- Cambio pequeño y concreto: resolverlo directamente.

## Escenarios A–H y skills disponibles en Claude

Elegir un escenario principal (como mucho uno secundario) y cargar solo 2–3 skills.

| Escenario | Señal | Empezar con |
|---|---|---|
| A. Crear una empresa | idea sin operación | `problem-validation`, `value-proposition-design`, `financial-forecasting` |
| B. Mejorar una existente | problemas difusos | `business-diagnostic`, `altiora-os-strategy` |
| C. Vender más | embudo o cierre débil | `cro`, `offers`, `sales-discovery` (o `spin-selling`) |
| D. Posicionamiento | precio o percepción bajos | `premium-branding`, `value-proposition-design` |
| E. Operaciones | quiebres, merma, margen | `logistics-supply-chain`, `unit-economics` |
| F. Canales digitales | web, pedidos, automatización | `nextjs-architecture`, `n8n-webhook-architect`, `immersive-commerce` |
| G. Escalar | crecimiento con riesgo de caja | `financial-forecasting`, `pricing`, `altiora-os-automation-growth` |
| H. Internacionalizar | nuevo país o idioma | `altiora-os-research`, `altiora-os-strategy` |

La biblioteca AEM completa (p. ej. `aem-venture-architect`, `business-health-assessment`, `international-expansion`) vive en `.agents/skills` y `~/.codex/skills`. En Claude no se descubre: leer su `SKILL.md` por ruta solo si el escenario lo exige.

## Procedimiento

1. Resumir qué busca el cliente, industria, etapa y datos disponibles. Si falta un dato decisivo, hacer como mucho dos preguntas; si no, avanzar con supuestos etiquetados.
2. Compuerta de oportunidad: comprobar que el problema existe con evidencia (cliente, datos o episodio real). Sin evidencia, el primer paso es validar, no construir.
3. Elegir escenario y skills de la tabla. Explicar en una línea por qué.
4. Ejecutar la primera skill y entregar un documento con hechos, hipótesis, recomendación y un próximo paso concreto.

## Límites

No prometer ROI, ventas ni ahorro sin datos medidos. No presentar un rol de IA como profesional habilitado: finanzas, contratos e impuestos requieren revisión humana según jurisdicción.
