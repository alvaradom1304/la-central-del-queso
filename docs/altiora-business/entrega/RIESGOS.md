# Riesgos abiertos del sistema de entrega · 31/10/2026

Son riesgos del sistema, no de un cliente concreto. Los riesgos de cada proyecto van en la plantilla 03. La probabilidad y el impacto son juicios (S), no mediciones.

| ID | Riesgo | Afecta a | Prob. | Impacto | Respuesta disponible | Responsable | Estado |
|---|---|---|---|---|---|---|---|
| R-01 | No hay comprador validado ni nadie ha pagado US$10.000 | todo | A | A | Entrevistas de `OFERTA.md`; compuerta G1 | Fundador | Abierto: ninguna entrevista hecha |
| R-02 | El esfuerzo real supera el presupuesto de horas; 90 h ya incumplen el umbral | margen | A | A | Presupuesto de 75 h, registro semanal y regla del 15 % | Fundador | Mitigado: 75 h aprobadas el 31/10/2026; falta medir el esfuerzo real en el primer proyecto |
| R-03 | El cliente no acepta ni rechaza y bloquea el 20 % y el cierre | caja, margen | M | M | Procedimiento de la propuesta, §6 | Fundador + abogado | Abierto: falta revisión jurídica |
| R-04 | Materiales o aprobaciones tardías consumen capacidad reservada | margen | A | M | Plazos y regla de pausa en la propuesta, §5 | Director | Mitigado en plantilla; sin probar |
| R-05 | Propiedad intelectual, licencias y privacidad sin definir para la jurisdicción | confianza, legal | M | A | Marcadores [REVISIÓN PROFESIONAL]; registro de activos | Fundador + abogado | Abierto: no hay entidad, país ni asesor definidos |
| R-06 | Una sola persona hace todo (dirección, técnica, venta): si no está disponible, se para la entrega | calidad, confianza | M | A | Un proyecto activo a la vez; documentación y manifiesto para que otra persona continúe | Fundador | Abierto: sin suplente |
| R-07 | Revisor independiente no disponible: el fundador revisa su propio trabajo | calidad | A | M | Agente `altiora-os-qa` como segundo revisor, con su límite declarado | Director | Parcial: los agentes no se han verificado en una sesión nueva |
| R-08 | Una API o cuenta de un tercero (WhatsApp, CRM, hosting) cambia o no está disponible | calidad | M | M | Procedimiento manual de recuperación y la dependencia identificada antes de firmar | Responsable técnico | Mitigado en plantilla |
| R-09 | Se confunde garantía con mantenimiento y se trabaja sin cobrar | margen | M | B | Definición de defecto en la propuesta §6 y la plantilla 10 | Director | Mitigado en plantilla |
| R-10 | Se afirma más de lo verificado (piloto, IA, resultados) | confianza | M | A | `PRUEBA-PILOTO.md`; reglas del paquete; `altiora-case-study` con permiso | Todos | Controlado; se revisa en cada entrega |
| R-11 | Sin costes D, gastos fijos O ni caja reales: el margen es teórico | margen | A | A | Plantillas 03 y 09 con cotizaciones | Fundador + contador | Abierto |
| R-12 | El laboratorio cita `templates/review-gate.md`, que no existe | calidad | B | B | Las compuertas de este paquete | Codex (laboratorio) | Abierto: corregir en el laboratorio |
| R-13 | El piloto mezcla dos recorridos: WhatsApp en la interfaz, API y Sheets en el SOP | calidad | A | M | Pedido durable por API (decidido el 31/10/2026); especificación en `EJEMPLO-PILOTO.md` | Fundador / responsable técnico | Implementado con almacén local sin commit (12/12 pruebas y build PASS); falta la prueba en navegador y el destino durable de producción |
