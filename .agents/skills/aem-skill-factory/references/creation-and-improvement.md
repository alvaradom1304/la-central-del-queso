# Creación con valor y mejora continua

## Incorporar faltantes

1. Auditar el repositorio realmente accesible por frontmatter name, alias, responsabilidad, inputs, output y dependencias. Fechar el inventario. Una carpeta opaca no es ausencia. Una definición ya creada con guardado pendiente requiere recuperación, no otra implementación.
2. Clasificar REUSE, IMPROVE, CREATE o DEFER. Reutilizar cuando el contrato ya cubre la necesidad; mejorar cuando falta un paso, un límite o una prueba; crear cuando hay una responsabilidad repetible y un resultado distinto. No convertir contexto de cliente, un entregable puntual o un título genérico en una skill vacía.
3. Si la creación está comprendida en la instrucción vigente, diseñar, inicializar, verificar y guardar la skill sin volver a pedir autorización. Mantener las reglas del entorno. No extender esa autorización a despliegues, contactos, compras ni cambios operativos de clientes.

## Ficha de aporte

Registrar en capability_contract y evaluation, con evidencia vinculada:

- Problema repetible, usuario o decisión atendida y fuente que demuestra la necesidad.
- Responsabilidad que falta y comparación con skills existentes.
- Resultado observable y aporte previsto: ingreso/margen, conversión, ahorro de tiempo, reducción de errores/riesgo o mayor reutilización, según el problema.
- Métrica pertinente, unidad, periodo, método y responsable cuando esté definido. Baseline real con fuente; si no existe, UNKNOWN y plan de medición. Una expectativa es HYPOTHESIS, no resultado observado.
- Criterio de aceptación y casos de fallo/regresión antes de evaluar. Incluir costo/complejidad de mantenimiento y restricciones relevantes.
- Condición de próxima revisión: un proyecto completado, nueva evidencia, fallo repetido o cambio del entorno. Definir la acción siguiente; no activar calendarios ni experimentos operativos por escribir el plan.

La falta de baseline no impide crear una definición experimental cuando el problema y alcance son claros. Impide afirmar mejora medida o promoverla a VALIDATED sin evidencia suficiente. El número de skills no es una métrica de valor.

## Ciclo después de cada uso significativo

Observación trazable → causa/hipótesis → cambio acotado → casos independientes y regresiones → comparación con aceptación → decisión KEEP/REVISE/REVERT → nueva versión y changelog → seguimiento.

Guardar un registro de aprendizaje con task_id/proyecto mínimo, skill/version anterior, problema, evidence_ids, cambio, métrica/baseline, pruebas realmente ejecutadas, limitaciones, decisión, nueva versión y responsable/siguiente revisión. Separar los aprendizajes reutilizables del contexto de un cliente y minimizar datos personales.

Conservar casos que revelaron fallos como regresiones; evaluar un caso independiente para evitar ajustar el método solo al ejemplo conocido. No elevar madurez por escribir casos ni por validar YAML/JSON. Una mejora sintética puede respaldar comportamiento del método, pero no prueba ventas, margen o impacto real en clientes.

Cuando el servicio de guardado falla, mantener fuente y checkpoint, registrar lo confirmado y lo pendiente, y reintentar con límites de recuperación. No declarar una skill disponible ni un aprendizaje aplicado hasta verificar persistencia. Las versiones y resultados anteriores deben poder recuperarse.
