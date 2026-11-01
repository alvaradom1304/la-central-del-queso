# Evaluación del sistema de entrega · 31/10/2026

Autor: Claude Code (operaciones y calidad), en coordinación con Codex (coordinador según `docs/altiora-toolkit/ORQUESTADOR.md`). Rama de la empresa: `feature/aem-os-integration` (commit base `7df4fdb`, trabajo sin commit). Altiora no tiene clientes de pago: todo lo que sigue evalúa un proceso **hipotético** y no resultados comerciales.

Leyenda:
- **H**: hecho comprobado en un archivo o con una prueba.
- **S**: supuesto.
- **R**: recomendación o cambio.

## Prioridad de los problemas

Orden de prioridad: primero lo que afecta a la confianza del cliente, después a la calidad de la entrega y por último al margen.

| # | Problema | Afecta a | Evidencia (H) | Cambio aplicado (R) |
|---|---|---|---|---|
| 1 | La oferta planifica hasta 90 h, pero con 90 h el margen baja al 17,5 %, por debajo del umbral propuesto del 25 % (que da un máximo de 75 h). Nada impide vender con 90 h. | margen | `OFERTA.md:13,15`; `FINANZAS.md:35` | El plan trae por defecto 75 h repartidas por fase. Si la estimación pasa de 75 h, la compuerta exige recortar alcance o cambiar el precio antes de firmar. **Resuelto el 31/10/2026:** el fundador aprobó 75 h, y `OFERTA.md` e `INICIO.md` ya lo recogen. |
| 2 | La regla de que el silencio no cuenta como aceptación no tiene un procedimiento detrás. Sin él, el último cobro (US$2.000) y el cierre pueden quedar bloqueados indefinidamente. | margen, confianza | `OFERTA.md:26`; `FINANZAS.md:39` | El acta y la propuesta incluyen un procedimiento: el cliente reporta incumplimientos concretos contra los criterios, con recordatorio y reunión. Los pendientes no bloqueantes no impiden aceptar. Marcado [REVISIÓN PROFESIONAL]. |
| 3 | No está definida la propiedad de los materiales ni las licencias de terceros. Solo consta que las cuentas quedan bajo control del cliente. | confianza | `OFERTA.md:26,37` | Hay una cláusula base en la propuesta y un registro de activos y derechos, ambos con [REVISIÓN PROFESIONAL]. |
| 4 | No se dice quién produce el contenido ni en qué plazo entrega el cliente los materiales. El retraso «se registra», pero sigue ocupando la capacidad reservada. | margen, calidad | `OFERTA.md:11,22,28` | Las responsabilidades del cliente tienen plazos, y hay una regla de pausa y reprogramación en la propuesta y en el plan. |
| 5 | Ningún documento comprueba que lo probado sea exactamente lo entregado. El manifiesto del piloto se hizo una sola vez, a mano. | calidad | `PILOT-SOURCE-MANIFEST.json` | Nuevo `scripts/manifiesto.py` (crear y verificar) con el formato de ese manifiesto, y un paso obligatorio en la aceptación. |
| 6 | No hay plan de pruebas ni registro de evidencia por proyecto. La «Definition of Done» del laboratorio existe, pero no está conectada a la entrega. | calidad | `…/Altiora-Immersive-Web-Lab/quality/definition-of-done.md` | La plantilla 06 la aplica con matriz de dispositivos, registro fechado y veredicto. |
| 7 | La ficha de una oportunidad no justifica el precio con el valor que obtiene el comprador. | confianza, margen | `OFERTA.md:21,47`; `interview-template.json` | La plantilla 01 exige que el comprador cuantifique el coste del problema con sus propios datos. Sin eso, la compuerta queda en HOLD. |
| 8 | No hay cierre que compare lo real con lo planificado ni que registre el aprendizaje. | margen | `FINANZAS.md:55`; `OPERACION.md:36-38` | La plantilla 08 recalcula E = P − D − T − R con datos reales. |
| 9 | `production.md` del laboratorio cita `templates/review-gate.md`, que no existe. | calidad | `…/workflow/production.md` | No se toca, porque es territorio de Codex; queda como riesgo abierto R-12. Las compuertas de este paquete sustituyen esa referencia. |

## Etapa por etapa

### 1. Diagnóstico y venta
- **Existe (H):**
  - en `OFERTA.md`: comprador hipotético, resultado comprometido, alcance, exclusiones, criterios de aceptación, guion de 25 minutos y reglas Go;
  - además: `VALIDACION-COMERCIAL.md`, `interview-template.json`, `pipeline.json` (vacío) y la skill `altiora-commercial-director`.
- **Falta:** un documento por oportunidad que una problema, valor, alcance, criterios y evidencia del precio.
- **Falla:** el precio se defiende con el alcance, no con el valor que el comprador declara.
- **Cambio:** `plantillas/01-ficha-encaje.md`.

### 2. Propuesta y contrato
- **Existe (H):**
  - cobro 50/30/20, dos rondas de revisión consolidadas, 5 días hábiles para aceptar, 14 días de corrección y mantenimiento aparte (`OFERTA.md:17,26,41`);
  - la lista de temas legales (`FINANZAS.md:39`).
- **Falta:**
  - plantilla de propuesta y alcance;
  - definir qué es una «ronda» de revisión;
  - propiedad intelectual;
  - responsabilidades del cliente con plazos;
  - pausa y cancelación;
  - cambios de alcance.
- **Falla:** los problemas 2, 3 y 4 de la tabla.
- **Cambio:** `plantillas/02-propuesta-alcance.md` y `plantillas/04-control-cambios.md`.
- **Requiere revisión profesional:** contrato, propiedad intelectual, privacidad de los datos de formularios, impuestos y entidad o jurisdicción. No están determinadas (`FINANZAS.md:80`).

### 3. Planificación
- **Existe (H):** escenarios económicos, umbral de 75 h, un proyecto activo a la vez y un calendario ilustrativo de caja (`FINANZAS.md`).
- **Falta:**
  - horas por fase;
  - registro semanal de horas;
  - desglose de D;
  - calendario con las decisiones del cliente;
  - riesgos por proyecto.
- **Falla:** el problema 1.
- **Cambio:** `plantillas/03-plan-presupuesto.md`.

### 4. Estrategia y experiencia
- **Existe (H):** las skills y agentes de estrategia, experiencia, creatividad y `site-architecture`, y el hito M0 del laboratorio.
- **Falta:** un brief de una página que fije el objetivo medible del recorrido, el mensaje, el contenido y su responsable, la accesibilidad, el recorrido y la línea base.
- **Falla:** el problema 4 (contenido).
- **Cambio:** `plantillas/05-brief-experiencia.md`.
- **Límite:** se miden objetivos del recorrido (consultas registradas, tiempo de respuesta), no ventas (`OFERTA.md:9`).

### 5. Producción
- **Existe (H):** hitos M0–M6 y presupuestos de rendimiento del laboratorio, y los agentes de ingeniería, 3D, medios y audio.
- **Falta:**
  - registro de activos con licencia, fuente, alcance y quién paga;
  - una regla explícita de que 3D, vídeo y audio no entran en el alcance base de US$10.000.
- **Falla:** el problema 9.
- **Cambio:**
  - `plantillas/07-registro-activos.md`;
  - el proceso trata todo medio adicional como cambio de alcance (plantilla 04).

### 6. Calidad
- **Existe (H):**
  - aceptación verificable (`OFERTA.md:32-35`) y la Definition of Done del laboratorio;
  - el agente `altiora-os-qa` y el manifiesto del piloto.
- **Falta:**
  - plan de pruebas;
  - matriz de móvil y escritorio;
  - comprobación de rendimiento, seguridad y accesibilidad;
  - revisión visual y perceptual;
  - correspondencia entre lo probado y lo entregado.
- **Falla:**
  - problemas 5 y 6;
  - en el piloto, `TESTING_SOP.md` espera un pedido a Sheets, mientras que el carrito abre WhatsApp (`PRUEBA-PILOTO.md:11-13`).
- **Cambio:** `plantillas/06-plan-pruebas-evidencia.md`, `scripts/manifiesto.py` y `ACEPTACION.md`.

### 7. Lanzamiento y traspaso
- **Existe (H):** cuentas del cliente, manual, formación, aceptación expresa y atención en horario (`OFERTA.md:26,28`), y respaldo y rollback en la Definition of Done.
- **Falta:** el acta de aceptación y la lista de traspaso.
- **Cambio:** `plantillas/08-acta-aceptacion-traspaso.md`.

### 8. Rentabilidad y aprendizaje
- **Existe (H):** las fórmulas de `FINANZAS.md`, los indicadores de `OPERACION.md` y la skill `altiora-case-study`.
- **Falta:**
  - comparar lo real con lo planificado;
  - el coste de servir;
  - el margen real;
  - la satisfacción del cliente;
  - un lugar donde guardar las mejoras.
- **Cambio:** `plantillas/09-cierre-rentabilidad.md` y `plantillas/10-informe-mantenimiento.md`.

## Qué no se cambió y por qué
- `FINANZAS.md` y `OPERACION.md` siguen igual. En `OFERTA.md` (líneas 13 y 15) e `INICIO.md` solo se registró la decisión de 75 h que tomó el fundador el 31/10/2026, y en `INICIO.md` se añadió además el enlace a este paquete. Los escenarios de 60, 90 y 130 h de `FINANZAS.md` se conservan como ilustración.
- No se tocó el repositorio del piloto: solo se leyó y se hizo un chequeo de tipos que no escribe archivos.
- No se añadieron herramientas externas, servicios ni automatizaciones.
