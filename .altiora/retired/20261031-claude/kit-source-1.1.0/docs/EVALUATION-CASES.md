# Casos y criterio de evaluación de las skills

Versiones de ambas skills: 1.0.0. Propietario: Altiora. Estado: EXPERIMENTAL.
Baseline de desempeño de modelos y resultados comerciales: UNKNOWN. No hay comparativa antes/después entre modelos. Las pruebas automatizadas de los scripts son evidencia separada.

## altiora-runtime-bridge
Contrato: raíz de proyecto y runtime destino → inventario con ruta, estado por capa, evidencia y límites. Dependencias: Python 3.11 para diagnóstico; acceso local al proyecto. Si no hay shell, inspección manual con menor evidencia. El diagnóstico no requiere API ni modelo concreto.

Caso normal: un proyecto recién instalado debe pasar doctor; el agente aún debe indicar que descubrimiento/confianza necesitan verificación en cliente.
Caso adverso: cambiar un archivo gestionado o quitar un hook debe producir diagnóstico FAILED, conservar el proyecto y proponer revisar el delta. No reinstalar forzadamente.
Caso independiente: una skill homónima local debe conservarse y aparecer como variante reutilizada, sin afirmar que se instaló el contenido de este paquete en esa ruta.

Scripts de estos escenarios ejecutados: ver VALIDATION.md. Evaluación del comportamiento del agente en clientes destino: PENDIENTE. Criterio de promoción: los tres casos ejecutados con salidas crudas fechadas en el cliente y ningún estado LIVE_TESTED inventado.

## altiora-session-handoff
Contrato: objetivo vigente, autorización y evidencia → handoff.schema.json. Dependencias: acceso al estado real del proyecto; Git opcional, con null explícito cuando falta. No requiere transcript ni tokens de servicios.

Caso normal: tarea incompleta con una próxima acción produce handoff válido y conserva pendientes.
Caso adverso: passed sin evidencia/fecha, estado complete con pendientes o ruta fuera del proyecto debe ser rechazado por handoff-check.
Caso independiente: un handoff con Git antiguo al retomar requiere inspeccionar el delta, sin volver a ejecutar órdenes registradas automáticamente y sin asumir nueva autorización.

El validador ejecuta los casos de formato y consistencia. Retomar con divergencia Git mediante un modelo en cada cliente: PENDIENTE. Criterio de promoción: el agente identifica el delta y continúa el objetivo vigente sin eliminar cambios ajenos.

## Revisión sustantiva
Los dos procedimientos cubren integración y continuidad entre runtimes; no sustituyen skills de estrategia, negocio, creatividad o ingeniería. Mantienen autorización, referencias bajo demanda y verificación separada de instalación. Los roles conservan responsabilidades ya existentes. Un fallo crítico de preservación, evidencia inventada o extensión de permisos exige REVISE o REVERT, sin compensarlo con un promedio de otros casos.
