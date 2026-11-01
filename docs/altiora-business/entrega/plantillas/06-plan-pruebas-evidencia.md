# 06 · Plan de pruebas y registro de evidencia: [cliente] · [fecha]

Lo ejecuta un revisor distinto de quien construyó (`altiora-os-qa`). Los criterios detallados están en la Definition of Done y en los presupuestos de rendimiento del laboratorio (`Altiora-Immersive-Web-Lab/quality/`). Aquí se registra qué se probó, sobre qué versión y con qué resultado.

## Versión candidata
- Repositorio y commit (o URL de vista previa):
- Manifiesto creado: `python docs/altiora-business/entrega/scripts/manifiesto.py crear --root <proyecto> --salida <manifiesto.json> <rutas>` → archivo:
- Entorno (local, vista previa o producción) · fecha · revisor:

## Matriz mínima
| Área | Qué comprobar | Cómo | Resultado (PASS / FAIL / NO VERIFICADO) | Evidencia |
|---|---|---|---|---|
| Funcional | Recorrido completo con 3 consultas de prueba: campos, asignación, aviso | Manual + registro en el destino | | |
| Fallo | Destino caído → error visible + procedimiento manual | Simular con datos de prueba | | |
| Móvil | 360 y 390 px: navegación, formulario, foco | Navegador real o emulado (indicar cuál) | | |
| Escritorio | 1440 px + 768 px | | | |
| Teclado y accesibilidad | Tab, foco visible, etiquetas, contraste, movimiento reducido | Manual + herramienta (indicar cuál) | | |
| Rendimiento | LCP, CLS, INP en las condiciones registradas | Herramienta + red/dispositivo declarados | | |
| Seguridad | Sin secretos en el cliente, validación en servidor, antispam, permisos mínimos | Revisión de código + prueba | | |
| Compatibilidad | Navegadores acordados | | | |
| Visual y perceptual | Coincide con el diseño aprobado; audio y vídeo escuchados o vistos si los hay | Capturas reales | | |
| Medición | Eventos acordados visibles en modo de prueba | Vista de depuración | | |
| Datos | Sin datos personales innecesarios en eventos ni registros | Revisión | | |
| Derechos | Todos los activos en la plantilla 07 con licencia | Revisión | | |

## Defectos
| ID | Severidad (bloqueante / mayor / menor) | Reproducción | Responsable | Estado | Verificado por / fecha |
|---|---|---|---|---|---|

## Veredicto G6
- Bloqueantes abiertos: [n]. Si hay alguno, G6 = NO-GO.
- Lo NO VERIFICADO y qué falta para comprobarlo:
- Veredicto: GO / HOLD / NO-GO · revisor · fecha · versión.

## Correspondencia con la entrega (antes de G7)
`python docs/altiora-business/entrega/scripts/manifiesto.py verificar --manifiesto <manifiesto.json>` sobre lo que se va a entregar. El resultado debe ser **PASS**. Si algún archivo cambió después de las pruebas, se vuelven a probar las áreas afectadas y se crea un manifiesto nuevo.
