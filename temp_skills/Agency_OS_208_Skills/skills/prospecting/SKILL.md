---
name: prospecting
description: 'prospecting: Sales Intelligence. Usar para producir prospecting_plan,
  contact_criteria, drafts a partir de ICP, oferta, canales permitidos, datos legítimos;
  no sustituir otras fases ni declarar resultados sin evidencia.'
---

# Prospecting

## Contrato

Versión **0.1.0** · **Atomic** · Sales Intelligence · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Elegir cuentas por encaje y señales públicas legítimas. Usar para mejorar **conversaciones cualificadas por contacto**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **ICP, oferta, canales permitidos, datos legítimos**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: Ninguna skill obligatoria; recibir inputs por contrato. Usar Agency OS si ya está en el proyecto.. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

0. Validar contrato de entrada con [input-schema.json](references/input-schema.json); definir criterio de éxito antes de ejecutar. Si falta dato material, continuar trabajo independiente y devolver estado provisional/bloqueado coherente.
1. Elegir cuentas por encaje y señales públicas legítimas.
2. Diseñar mensaje útil y secuencia por canal.
3. Definir frecuencia, opt-out y seguimiento por etapa.
4. Comprobar resultado específico, registrar evidencia/limitaciones y devolver esquema; no publicar ni activar sistemas por defecto.

## Regla de decisión y validación

**No recolectar datos sensibles ni enviar sin instrucción explícita; verificar reglas locales/plataforma.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **prospecting_plan, contact_criteria, drafts** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

- https://www.huthwaiteinternational.com/spin-methodology — SPIN; fuente original.
- https://gapsellingonlinetraining.com/methodology-training/ — Keenan/Gap Selling; temario oficial.
- https://meddicc.com/meddpicc-sales-methodology-and-process — MEDDICC/MEDDPICC; proveedor metodológico.
- https://challengerinc.com/what-is-challenger-sales-methodology/ — Challenger; referencia del proveedor.
- https://www.blackswanltd.com/newsletter/bridging-the-gap-using-tactical-empathy-to-neutralize-power-in-negotiations — Black Swan; perspectiva de empatía táctica.
- https://jebblount.com/product/fanatical-prospecting/ — Jeb Blount; referencia del autor.
- https://www.influenceatwork.com/7-principles-of-persuasion/ — Cialdini; perspectiva del autor.
- https://robfitz.com/about/ — Fitzpatrick; referencia del autor.

Ejemplo: «Usa $prospecting con ICP, oferta, canales permitidos, datos legítimos para obtener prospecting_plan, contact_criteria, drafts». Ante datos insuficientes, devolver preguntas/plan y límites; no simular resultado de campo.

## Historial

0.1.0 — 2026-10-10: core delegable, contratos y casos iniciales. EXPERIMENTAL hasta revisión de comportamiento documentada.
