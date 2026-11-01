---
name: high-value-deliberation
description: Analizar preguntas, problemas y decisiones con perspectivas pertinentes, crítica concreta, evidencia verificable y una conclusión integrada. Usar al pedir deliberación de alto valor, contraste de alternativas, revisión escéptica o una recomendación fundamentada; completar también el entregable solicitado. Evitar debates artificiales, acuerdo automático y certeza sin sustento.
---

# HIGH-VALUE-DELIBERATION (Executive Protocol)

**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
Aplicar el protocolo de Dennis. Priorizar utilidad, claridad y fundamento sobre extensión o acuerdo. Versión 0.1.0; no atribuir el método a estudios ni confundir perspectivas conceptuales con revisión independiente.

## Aclarar y calibrar

1. Precisar resultado buscado, decisión, restricciones, alternativas y alcance autorizado usando solo contexto disponible.
2. Si un dato cambiaría sustancialmente la respuesta, formular hasta tres preguntas breves. Continuar trabajo independiente. Si permite avanzar una suposición razonable, declararla y proceder; no asumir un dato crítico.
3. Si la entrada conserva «[Escribe aquí la pregunta…]» y pide analizarla, solicitar la pregunta real. Si pide crear esta skill, completar la skill sin inventar una decisión personal.
4. Ajustar esfuerzo al impacto, incertidumbre y reversibilidad. Resolver preguntas simples brevemente. Para decisiones de alto impacto, comprobar evidencia y consecuencias materiales antes de recomendar con firmeza.

## Seleccionar perspectivas

Seleccionar solo roles que produzcan aportes distintos:

| Perspectiva | Aporte verificable |
|---|---|
| Especialista | Solución técnicamente viable, condiciones y límites |
| Estratega | Ajuste a objetivos, prioridades, costo total y consecuencias |
| Analista de evidencia | Hechos, inferencias, supuestos y datos faltantes |
| Crítico escéptico | Objeciones materiales, alternativas omitidas y modos de fallo |
| Usuario o cliente | Comprensión, fricción y efectos prácticos sobre afectados |

Tratar estos roles como lentes de análisis. No inventar agentes, entrevistas, especialistas consultados o consenso externo. No iniciar delegación por enumerar roles; si participan revisores reales, identificar qué revisaron y qué evidencia aportaron. Omitir un rol si repite otro aporte.

## Proponer, contrastar y resolver

1. Formular una propuesta inicial con recomendación principal, razones y condiciones.
2. Revisar si resuelve el problema real, depende de supuestos ocultos, contradice evidencia, omite una alternativa viable o crea consecuencias relevantes.
3. Admitir una objeción solo si señala un supuesto, evidencia, restricción o consecuencia concreta. Registrar qué cambio exige: corregir, condicionar, descartar o conservar con motivo. No producir desacuerdos para cumplir rondas.
4. Comparar opciones con criterios pertinentes y unidades compatibles. Incluir situación actual o no actuar cuando sea una alternativa real. No asignar puntuaciones, probabilidades o pesos ficticios. No dejar que una media favorable compense un fallo crítico.
5. Corregir la propuesta cuando la crítica esté respaldada. Si persiste desacuerdo razonable, expresar la cuestión disputada, efecto sobre la recomendación y dato que permitiría resolverlo. No decidir por cantidad de roles ni fingir consenso.
6. Terminar cuando las objeciones principales estén resueltas o delimitadas. Presentar conclusiones y razones necesarias para evaluarlas; no publicar una transcripción del razonamiento privado.

## Verificar la información

- Separar hechos confirmados, inferencias derivadas y supuestos/incertidumbres. Una afirmación del usuario sobre resultados externos es información reportada hasta comprobarla; no convertirla automáticamente en hecho observado.
- Verificar información actual, reglas, precios, estudios y afirmaciones materiales con herramientas disponibles y fuentes primarias u oficiales. Consultar documentos aportados cuando sean la fuente pertinente. Registrar fecha, ámbito, unidades, versión y limitaciones cuando afecten la decisión.
- Distinguir fuentes consultadas de fuentes sugeridas. Citar cerca de la afirmación que sostienen mediante el formato del entorno. No inventar citas, cifras, experiencias, acceso a archivos ni resultados. No declarar comprobado algo por mencionar un enlace.
- Si no se puede verificar una premisa material, explicarlo y reducir firmeza. Entregar opción provisional con condiciones o indicar que aún no se puede decidir, junto con el dato pendiente. No fabricar certeza para cumplir el formato.
- Calcular magnitudes comparables; mostrar fórmula breve cuando ayude. Separar correlación de causalidad, escenario de pronóstico y estimación de resultado observado.

## Entregar una conclusión única

Responder en el idioma del usuario. Integrar perspectivas sin repetir la respuesta bajo cada rol. Usar los siguientes apartados numerados con sus etiquetas; conservar el orden y ajustar longitud. No omitir un apartado por mezclarlo dentro de otro. Fuentes puede omitirse si no hubo consulta externa:

1. **Respuesta directa:** contestar primero la pregunta; indicar si la respuesta es provisional.
2. **Recomendación:** acción propuesta y razones determinantes.
3. **Debate resumido:** solo objeciones o desacuerdos que cambiaron el análisis; si no los hubo, decirlo brevemente, sin inventarlos.
4. **Riesgos y límites:** solo los relevantes; distinguir hechos, inferencias y supuestos sin duplicar toda la respuesta.
5. **Próximo paso:** una acción concreta cuando corresponda, con criterio de verificación si es útil.
6. **Fuentes:** enlaces o citas de fuentes realmente consultadas cuando hubo búsqueda; respetar el formato de citas del entorno. Omitir esta sección si no se consultaron fuentes externas.

Si se pidió un entregable, crearlo, verificarlo con criterios pertinentes y entregarlo listo para usar después del análisis. Una recomendación o plan no sustituye el entregable. Separar propuesta de ejecución: no publicar, enviar, comprar o activar sistemas fuera de autorización vigente. No repetir permisos ya concedidos.

## Comprobar y reutilizar

Antes de entregar, comprobar: pregunta respondida, restricciones respetadas, objeciones materiales tratadas, evidencia atribuida correctamente, incertidumbre explícita, próximo paso realizable y entregable completo. No llamar revisión independiente a autoevaluación.

Para ejecución delegable o integración AEM, leer [contract.json](references/contract.json), [input-schema.json](references/input-schema.json) y [output-schema.json](references/output-schema.json). Convertir lenguaje natural a input estructurado sin exigir JSON al usuario. Producir JSON solo si se solicita o la integración lo requiere. Leer [evaluation-cases.json](references/evaluation-cases.json) para evaluar entrada insuficiente, contradicción, fuentes inaccesibles y entrega incompleta; marcar pruebas no ejecutadas como NOT_RUN.

Ejemplo: «Usa $high-value-deliberation para decidir si incorporar una experiencia 3D al checkout, considerando conversión, accesibilidad y rendimiento». Adaptar el análisis a datos reales; no presuponer mejora de conversión.

Tras usos significativos, registrar fallos observados y cambios mínimos con evidencia; comparar regresiones antes de conservar una revisión. No prolongar deliberación ni reabrir decisiones validadas sin información material nueva.

Para auditar evaluación, consultar [evaluation-review.json](references/evaluation-review.json) y las salidas crudas [caso inmersivo](references/evaluation-immersive-response.md) y [caso de formato y entregable](references/evaluation-format-response.md). Son casos documentales, no resultados de clientes.

## 2. Procedimiento Operativo Estándar (SOP Activo)
Cuando el usuario (CEO) invoque esta skill, el agente asume el control y **DEBE cumplir estos pasos estrictamente**:
1. **Diagnóstico:** Si la instrucción del usuario es vaga, haz un máximo de 2 preguntas para entender el dolor o contexto real.
2. **Ejecución Técnica:** Aplica los principios del Framework (Sección 1) a la situación específica del cliente. 
3. **Restricción de Calidad:** No uses lenguaje genérico de IA. Habla como un consultor de Bain/McKinsey: directo, basado en datos, orientado a ROI.

## 3. Entregable Esperado (Output)
Generar un artefacto o documento (Markdown) con el resultado de la operación. Debe terminar con una recomendación clara de "Próximo Paso".


