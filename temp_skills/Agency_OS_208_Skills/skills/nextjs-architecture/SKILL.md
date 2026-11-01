---
name: nextjs-architecture
description: 'nextjs-architecture: Premium Web Experience. Usar para producir architecture,
  boundaries, implementation_plan a partir de repo/versiones, rutas, datos, auth,
  hosting; no sustituir otras fases ni declarar resultados sin evidencia.'
---

# Nextjs Architecture

## Contrato

Versión **0.1.0** · **Atomic** · Premium Web Experience · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Inspeccionar stack actual y docs oficiales. Usar para mejorar **integridad de build y tareas**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **repo/versiones, rutas, datos, auth, hosting**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: Ninguna skill obligatoria; recibir inputs por contrato. Usar Agency OS si ya está en el proyecto.. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

0. Validar contrato de entrada con [input-schema.json](references/input-schema.json); definir criterio de éxito antes de ejecutar. Si falta dato material, continuar trabajo independiente y devolver estado provisional/bloqueado coherente.
1. Inspeccionar stack actual y docs oficiales.
2. Definir server/client, datos, errores y caché por necesidad.
3. Verificar build y flujo completo sin exponer secretos.
4. Comprobar resultado específico, registrar evidencia/limitaciones y devolver esquema; no publicar ni activar sistemas por defecto.

## Regla de decisión y validación

**No asumir versión o API; no meter claves servidor en cliente.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **architecture, boundaries, implementation_plan** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

- https://www.w3.org/TR/WCAG22/ — W3C; norma accesibilidad.
- https://gsap.com/docs/v3/ — GSAP; documentación.
- https://nextjs.org/docs — Next.js; documentación.
- https://web.dev/articles/vitals — Web Vitals; distinguir campo/laboratorio.
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide — Search Central.
- https://threejs.org/docs/ — Three.js; docs consultadas.
- https://r3f.docs.pmnd.rs/getting-started/introduction — R3F; docs consultadas.

Ejemplo: «Usa $nextjs-architecture con repo/versiones, rutas, datos, auth, hosting para obtener architecture, boundaries, implementation_plan». Ante datos insuficientes, devolver preguntas/plan y límites; no simular resultado de campo.

## Historial

0.1.0 — 2026-10-10: core delegable, contratos y casos iniciales. EXPERIMENTAL hasta revisión de comportamiento documentada.
