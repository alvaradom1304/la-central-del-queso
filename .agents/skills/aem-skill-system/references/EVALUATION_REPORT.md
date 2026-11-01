# Evaluation Report v0.1.0

Biblioteca: 207 entradas; 205 nuevas con contrato completo y 2 existentes preservadas. Validación estructural: frontmatter, contratos, schemas, referencias, dependencias y grafo sin ciclos. Cada nueva skill tiene seis tipos de casos diseñados (1230 casos); no todos ejecutados.

## Muestra de comportamiento

14 outputs en 8 skills, ejecutados localmente con contexto independiente y revisados por agente principal.

| Área | Comprobación ejecutada | Resultado | Límite |
|---|---|---|---|
| Finanzas | Contribución 30 CRC; equilibrio 10 unidades/1000 CRC; costo=precio no da equilibrio finito; caja 50+100−120=30 | PASS | Datos sintéticos, no viabilidad real |
| Datos insuficientes | No declarar viable sin costos/ventas | PASS | Campo pendiente |
| Seguridad | IDs/botón oculto son señales, no vulnerabilidad confirmada; no escaneo de competidor sin scope | PASS | Sin pruebas activas de API |
| Orquestación | EXISTING BUSINESS→TRANSFORMATION; expansión HOLD; 3D REVISE; fechas 1980/1994 pendientes | PASS | Diagnóstico documental |
| Quality stop | Credencial/scope faltantes y no progreso: BLOCKED, sin reintentos ni éxito inventado | PASS | Sin workflow conectado |
| Quality success | Cotización Decimal gramos/kg, múltiples ítems, errores; 7 unittest y 2 cálculos independientes | PASS | Fixture local sin impuestos/envío/redondeo comercial |
| Schemas/trazas | 14 outputs conformes, evidence IDs resueltos, performed/outcome coherentes | PASS | Schema no demuestra verdad |

La revisión independiente se registra después de las respuestas brutas: algunas conservan revisión del padre NOT_RUN al emitirlas. No se alteraron para simular validación previa. Ver references/evaluation-summary.json y evaluation_*.json de $aem-library-validation para artifacts y hashes.

Todas las nuevas skills permanecen EXPERIMENTAL. No se ejecutaron todas las pruebas conductuales ni pruebas completas de campo de la quesera. No se instalaron/testearon adapters en Claude, Gemini o Antigravity. No hay agentes/workflows permanentes conectados ni sitios desplegados. Repositorios externos no auditados.

Incidencias: faltaba jsonschema; se instaló y declaró en scripts/requirements.txt de $aem-library-validation. Primera pasada detectó catálogo ausente: se completó. Revisión corrigió security-testing para permitir terceros solo con autorización verificada. Schema de gates reforzado con enums de overall y primary.

## Reproducción

Instalar dependencias declaradas en entorno aislado si faltan. Ejecutar scripts/validate_library.py de $aem-library-validation --root apuntando a Skills; scripts/validate_result.py de $aem-library-validation --root ... --file ... para outputs. Fixture: python -m unittest -v test_quote.py desde assets/evaluation_fixture/ de $aem-library-validation. Paths de scratch en respuestas brutas son procedencia histórica: usar los archivos archivados.

Promover madurez solo tras escenarios representativos/negativos y datos vigentes, con logs de fallo/corrección/retest. Volumen de archivos no acredita producción.

## Revisión técnica adicional — 2026-10-10

Se reforzaron 24 paquetes según TECHNICAL_QUALITY_REVIEW.md. Dos nuevas ejecuciones independientes produjeron soluciones documentales para quesería y lifecycle/integraciones/rendimiento; outputs crudos conservados en quality-evidence. Revisión de esas salidas: PASS para diagnóstico, trazabilidad, aritmética 500 g→6000 CRC, separación de click/venta, concurrencia, ownership, timeout ambiguo y límites de evidencia. No son pruebas ejecutadas del producto ni certificación de las veinte capacidades reforzadas por separado.

Cuatro contratos de salida tipados superan 16 comprobaciones sintéticas: aceptan dato desconocido explícito en BLOCKED y rechazan SUCCESS con resultado null, prosa en campos estructurados y versión anterior. Artefacto output-contract-checks-oct10.json. Esto verifica contratos, no rendimiento, APIs ni efectos de GSAP/Three.js reales. Validación estructural completa después de cambios: 207 skills, 205 contratos, cero errores. No se equipara esta validación con revisión profunda de las capacidades no incluidas en esta sesión.

## Incorporación posterior: high-value-deliberation

El catálogo pasa a 208 definiciones, con 206 contratos. El paquete nuevo incluye seis casos diseñados y dos respuestas documentales independientes: la primera aportó contenido correcto y motivó un ajuste explícito de formato; la segunda cumplió formato y entregable. No hubo navegación ni pruebas de conversión o producción. Cuatro comprobaciones sintéticas del contrato de salida detectan SUCCESS sin datos y entregable incompleto. Las evaluaciones anteriores conservan su alcance y fecha.
