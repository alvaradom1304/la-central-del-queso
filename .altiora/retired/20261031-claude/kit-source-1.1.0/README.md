# Altiora Agent System · 1.1.0

Sistema de cinco capas para continuar proyectos entre Antigravity, Codex y Claude Code. Incluye núcleo común, dos skills de integración/traspaso, hooks específicos, cuatro roles, contratos JSON e instalador reversible. Python 3.11 o superior, sin dependencias externas.

En este equipo ya se instaló en el proyecto principal de Altiora. Ver [estado y activación en los clientes](INSTALLATION.md).

## Usar en un proyecto
Desde esta carpeta, indicar una carpeta de proyecto existente. Primero puede verse el plan; `--apply` instala:

```powershell
python scripts/manage.py install --target "C:/ruta/mi-proyecto"
python scripts/manage.py install --target "C:/ruta/mi-proyecto" --apply
python scripts/manage.py doctor --target "C:/ruta/mi-proyecto"
```

El instalador conserva instrucciones y añade un bloque propio en AGENTS.md, CLAUDE.md y GEMINI.md. Copia skills en .agents/skills y .claude/skills; genera roles de Codex y Claude; combina hooks con los existentes. No modifica configuración global, modelos o permisos. Registra la transacción y respalda los archivos existentes bajo `.altiora/backups/`.

Reabrir el proyecto en cada herramienta. En Codex, revisar y confiar los hooks desde `/hooks` cuando se solicite. Ver [compatibilidad y prueba en cliente](docs/COMPATIBILITY.md). La selección de skills es bajo demanda; el usuario no necesita recordar sus nombres.

## Las cinco capas
| Capa | Implementación |
|---|---|
| Memoria / instrucciones | .altiora/system/core/constitution.md, adaptadores raíz y .altiora/project.json |
| Conocimiento | altiora-runtime-bridge y altiora-session-handoff; conserva biblioteca existente |
| Controles | SessionStart, PreToolUse, política de archivos sensibles y validador de handoff |
| Delegación | Investigación, experiencia, ingeniería y revisión; contratos de tarea/resultado |
| Distribución | Paquete versionado, hashes, instalador, diagnóstico y rollback |

## Continuar en otra herramienta
Pedir: «Guarda el estado para continuar este proyecto en Claude Code» (o Codex/Antigravity). El agente aplica la skill de traspaso y escribe `.altiora/handoff.json` con objetivo, autorización, decisiones, archivos, pruebas y siguiente acción. En la herramienta destino: «Retoma el handoff de este proyecto y contrástalo con el estado actual».

```powershell
python .altiora/system/scripts/manage.py handoff-check --target .
```

El formato está definido en `contracts/handoff.schema.json`. El archivo no se crea con contenido inventado al instalar; se guarda al existir una tarea que traspasar. Los comandos de pruebas registrados no se ejecutan automáticamente.

## Incorporar una skill existente
Importar solo las capacidades necesarias, con sus recursos. Revisar primero dependencias, licencia y rutas absolutas; copiar no las hace compatibles automáticamente.

```powershell
python scripts/manage.py install --target "C:/ruta/mi-proyecto" --library "C:/Users/Usuario/.codex/skills" --skill frontend-design --apply
```

Si una skill homónima local difiere, se conserva completa y se informa en `preserved_existing`. Los cambios a archivos gestionados que no coinciden con la instalación previa detienen la actualización. No hay `--force` destructivo. Para modificar el método, editar la fuente del kit, revisarla y reinstalar; el diagnóstico detecta deriva del payload. Proyecto y política son editables localmente.

## Revertir una instalación
El resultado de instalar incluye `transaction`. Usar ese identificador:

```powershell
python scripts/manage.py rollback --target "C:/ruta/mi-proyecto" --transaction IDENTIFICADOR
python scripts/manage.py rollback --target "C:/ruta/mi-proyecto" --transaction IDENTIFICADOR --apply
```

Para aceptar una edición local ya revisada de un archivo gestionado (registra su hash en el recibo, con transacción y rollback):

```sh
python scripts/manage.py adopt --target "C:/ruta/mi-proyecto" --path .claude/agents/altiora-review.md
python scripts/manage.py adopt --target "C:/ruta/mi-proyecto" --path .claude/agents/altiora-review.md --apply
```

La reversión comprueba todos los hashes antes de actuar. Si hubo cambios posteriores, se detiene para conservarlos; los respaldos permiten recuperación manual. Restaura bytes originales y elimina únicamente los archivos nuevos de esa transacción; puede dejar directorios vacíos y los respaldos. No elimina recursivamente carpetas.

## Qué está probado
Ejecutar `python -m unittest discover -s tests -v`. Ver `VALIDATION.md` para resultados y límites. `doctor` solo acredita estructura e integridad; falta verificar descubrimiento, confianza y comportamiento dentro de sesiones reales de cada cliente. El estado de madurez inicial de las dos skills es EXPERIMENTAL hasta contar con esa evidencia.

Los hooks protegen escrituras directas a archivos sensibles conocidos; no analizan shell ni sustituyen permisos del host. No hay detección fiable de «suena a IA», publicación automática, ManyChat, API conectada ni memoria universal. Estas integraciones requieren trabajo y autorización específicos.

Próximo paso: abrir el proyecto instalado en cada herramienta y completar la prueba de descubrimiento de `docs/COMPATIBILITY.md`.
