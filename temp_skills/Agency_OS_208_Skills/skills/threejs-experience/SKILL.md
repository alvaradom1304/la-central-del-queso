---
name: threejs-experience
description: 'threejs-experience: Premium Web Experience. Usar para producir scene_code,
  loading_plan, fallback a partir de escena, assets, dispositivo objetivo, presupuesto;
  no sustituir otras fases ni declarar resultados sin evidencia.'
---

# Threejs Experience

## Contrato

Versión **0.2.0** · **Atomic** · Premium Web Experience · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Verificar versión y preparar escena mínima. Usar para mejorar **costo GPU/carga y fluidez**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **escena, assets, dispositivo objetivo, presupuesto**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: Ninguna skill obligatoria; recibir inputs por contrato. Usar Agency OS si ya está en el proyecto.. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

1. Definir función narrativa del 3D y comparación con alternativa 2D completa; fijar presupuesto por dispositivo.
2. Auditar modelos/texturas/derechos; registrar descarga comprimida y memoria estimada descomprimida, geometría, materiales y luces.
3. Cargar diferido fuera del camino crítico comercial; mantener poster/HTML y estados loading/error.
4. Limitar resolución/DPR, reutilizar recursos e instancias cuando aporte; reducir passes/shadows según profiling real.
5. Pausar trabajo fuera de pantalla y en pestaña oculta; implementar recuperación de context loss y timeout de activos.
6. Liberar recursos por ownership al desmontar; probar repetición, dispositivo representativo y fallback comercial.

## Regla de decisión y validación

**WebGL puede fallar; render no debe ser único acceso a contenido.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **scene_code, loading_plan, fallback** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

- https://threejs.org/manual/pages/how-to-dispose-of-objects.html — Three.js; consultado 2026-10-10, liberación y límites de estadísticas

Ejemplo: «Usa $threejs-experience con el contexto, alcance y datos disponibles; entrega scene_code, loading_plan, fallback con evidencia y límites».

## Historial

0.1.0 — contrato inicial.
0.2.0 — 2026-10-10: procedimiento técnico, escenario adverso propio y aceptación específica. Mantener EXPERIMENTAL hasta evaluación documentada de los usos pertinentes; validar formato no certifica ejecución.

## Especificación técnica

Leer [technical-specification.md](references/technical-specification.md) antes de implementar o emitir un veredicto. Los casos diseñados no son pruebas ejecutadas.
