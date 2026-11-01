# Loop de calidad acotado

Definir criterios, test plan, autorizaciones, tiempo/costo y máximo correctivo antes de ejecutar. Máximo inicial: 3 correcciones; reducirlo para alto riesgo. Cualquier ampliación debe ser explícita en la configuración autorizada y justificada, nunca ocurrir por repetición automática. No confundir intento/test con corrección real.

Registrar cycle_id, estado anterior, prueba, evidencia del fallo, causa/hypothesis, corrección, alcance, retest y cambio frente a criterios. Preservar evidencia; no introducir cambios que empeoren controles. Medir progreso por criterios cumplidos, fallos reducidos o evidencia nueva; si se repite el mismo fallo sin cambio, parar. Si falta recurso/autoridad, BLOCKED; si se agotó presupuesto sin cumplir, FAILED; si falta decisión crítica, NEEDS_REVIEW. SUCCESS solo para alcance cumplido con evidencia.

Para propuestas/diagnósticos, declarar éxito del entregable de análisis únicamente, sin afirmar sistema corregido. Para implementación, comprobar comportamiento completo y registrar regresiones pertinentes. No operar producción ni revelar credenciales como efecto lateral del loop. VALIDATE revisa criterios y límites; REPORT incluye estado, ciclos, errores, evidencia, resultado y siguiente acción.
