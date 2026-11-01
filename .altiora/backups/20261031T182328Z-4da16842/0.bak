# Evaluación offline del Bibliotecario

Fecha de verificación: 2026-10-31. Fuentes: metadatos de `skills/` y `.claude/agents/` de este checkout. Se excluyen las bibliotecas personales y los adaptadores duplicados.

```sh
python skills/altiora-bibliotecario/scripts/evaluate_routes.py
python skills/altiora-bibliotecario/scripts/evaluate_routes.py --json
python -m unittest discover -s skills/altiora-bibliotecario/scripts -p "test_*.py"
```

Si se utiliza una copia personal del evaluador fuera del checkout, proporcionar `--root <ruta-del-checkout-Altiora>` explícitamente. Las pruebas del repositorio se ejecutan desde el checkout, no desde una copia personal parcial.

La suite contiene 14 encargos redactados: 11 con al menos un candidato aceptable y tres que deben abstenerse (consulta desconocida, skill ausente del checkout y petición sin objetivo). Cubre sonido, costes/contexto, selección de skills, investigación, revisión de evidencia, MCP, API, accesibilidad, copy y marca. Algunas consultas nombran explícitamente la especialidad; no representan por sí solas comprensión de peticiones ambiguas.

En revisión se sustituyeron cuatro consultas que contenían el identificador exacto de la skill por tareas naturales en español sobre seguridad de la API, accesibilidad de la tienda, textos publicitarios y estrategia de marca. Esa revisión obtuvo 13/14: «Redactar textos publicitarios…» no recuperaba `copywriting`, cuyo metadato está en inglés. Se añade únicamente el alias `redactar` → `copywriting`, con prueba contra un distractor de marca. Los casos son conocidos durante el ajuste, por lo que su acierto no estima generalización a solicitudes nuevas. Una prueba adicional verifica que `--root` usa solo el checkout explícito, sin introducir la biblioteca personal.

Primera ejecución: 13/14. La consulta genérica «Por favor quiero que me ayudes con esto para mí» devolvía rutas irrelevantes por palabras vacías como `para` y `que`. Se eliminan esas palabras antes de puntuar. Tras la corrección: 14/14 en top-5. Las pruebas incluyen candidatos distractores, ausencia del candidato esperado, rutas prohibidas, abstención, límites de top-k y validación de casos contradictorios. La comprobación de enlaces simbólicos del test previo puede omitirse cuando Windows no permita crearlos; una omisión no acredita esa comprobación.

El informe imprime nombres/rangos y límites, no rutas absolutas privadas ni cuerpos de skills. Falla si pierde un candidato esperado, devuelve un candidato prohibido o no se abstiene en una consulta negativa. Cada caso conserva una restricción para revisión humana; el buscador **no ejecuta** esa restricción ni valida permisos, herramientas, escucha, derechos o resultados comerciales.

Esto evalúa recuperación de metadatos con fixtures escritos por el implementador. No es un benchmark independiente, prueba de obediencia de Claude/Gemini/Codex/Antigravity ni medición de ahorro de tokens. El estado de consumo es `NOT_MEASURED`. Cambiar el catálogo puede requerir revisar una expectativa; no rebajar el criterio únicamente para recuperar un PASS.
