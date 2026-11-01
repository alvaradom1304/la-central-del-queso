# Herramientas de Altiora: selección y estado

Encargo activo: mejorar herramientas, skills, agentes y MCP para apoyar el negocio. Cargar este documento solo al enrutar, diagnosticar o retomar ese trabajo. El contexto de negocio confirmado está en `.altiora/project.json`; no trasladarlo al repositorio de clientes ni a una publicación pública.

## Selección

Usar el inventario nativo primero. Para selección ambigua, consultar `.agents/skills/altiora-bibliotecario/SKILL.md` (Claude: `.claude/skills/altiora-bibliotecario/SKILL.md`). Están instalados los recursos del Bibliotecario, coordinador, revisor y diagnóstico empresarial; las variantes anteriores se conservaron. Solo delegar trabajo acotado que lo justifique y con capacidad real; un archivo de rol no crea una sesión. No cargar la biblioteca completa ni las referencias de una modalidad ajena.

El catálogo local en `.altiora/catalog.local.json` contiene solo metadatos. Se refresca después de cambiar capacidades; no por mensaje. El buscador devuelve candidatos, no una decisión ni acceso. No instalar todos los repositorios o MCP de un catálogo. Las instrucciones comunes AGENTS/CLAUDE/GEMINI del proyecto ya remiten a este contexto.

## Uso desde la raíz de la empresa

```sh
python .agents/skills/altiora-bibliotecario/scripts/library.py check --catalog .altiora/catalog.local.json
python .agents/skills/altiora-bibliotecario/scripts/library.py find --catalog .altiora/catalog.local.json "bibliotecario" --limit 3
python .altiora/system/scripts/manage.py doctor --target .
python .altiora/system/scripts/manage.py handoff-check --target .
```

Codex y Antigravity usan las rutas del proyecto `.agents/skills`; Claude dispone de `.claude/skills`; Gemini puede seguir GEMINI.md y leer la misma fuente portable. Verificar descubrimiento y confianza en cada sesión antes de afirmar que una skill o agente se cargó. El doctor comprueba archivos y hooks estructurales; no prueba sesiones ni servicios activos.

## MCP y herramientas comprobadas

El MCP `altiora_shared` respondió a lectura y escritura en su carpeta autorizada de coordinación durante esta sesión. Su índice enlaza `context/altiora-toolkit-2026-10-31.json`. Este acceso no cubre automáticamente código de la empresa, Adobe o todo el disco. GitHub se utilizó en el laboratorio; las sesiones de Claude/Gemini/Antigravity siguen sin certificarse. No cambiar servidores, permisos o autenticaciones para hacer coincidir un estado.

Blender produjo una imagen conceptual local y una fuente editable que volvió a abrirse. Eso prueba ese pipeline local, no una conexión MCP. After Effects no se detectó con las consultas disponibles; no afirmar ausencia en todo el disco. La autenticación de conectores y la conexión del teléfono siguen pendientes de sus pasos respectivos.

## Identidad antes de publicar

Se detectó que origin en este directorio apunta a un repositorio de cliente y git status no completó su comprobación. La causa no se demostró; no llamarlo bare ni reparar configuración por suposición. El repositorio empresarial esperado sigue sin confirmar. Mantener los cambios de esta tarea locales y no hacer push desde esta carpeta.

El laboratorio incluye `scripts/project-identity.mjs`: requiere destino explícito `--expected owner/repository` y puede consultar una carpeta con `--project <ruta-absoluta>`. Usar un destino confirmado por el encargo, nunca inferido de origin. No concede autorización de publicación ni escanea secretos.

## Calidad y continuidad

Se retiraron únicamente bloques SOP/Entregable exactamente repetidos de copias propias; los originales están respaldados. Los scripts de terceros y el plugin Superpowers se conservaron. Menos texto no demuestra menor facturación ni mejores decisiones; el ahorro de tokens permanece NOT_MEASURED.

Completar la tarea autorizada por bloques sin pedir «sigue» entre pasos desbloqueados. No prometer ejecución con el chat cerrado. No crear horarios, servicios o tareas periódicas como efecto lateral; respetar preguntas y autenticaciones pendientes.

## Prueba funcional del handler

La [PR38 del laboratorio](https://github.com/alvaradom1304/Altiora-Immersive-Web-Lab/pull/38) añade `runtime:smoke`. Ejecutarlo desde el laboratorio con `--project` apuntando a este kit propio revisado y `--scratch-root` a una carpeta temporal absoluta existente. No ejecuta comandos de configuración ni modifica cuentas, confianza o políticas reales. El handler instalado pasó18/18 casos con su recibo comprobado. Su PASS no equivale a hook cargado por el host: descubrimiento, confianza y sesión nativa permanecen NOT_VERIFIED. No ejecutarlo contra un kit desconocido solo porque tenga un recibo/hash.

## Coincidencias del Bibliotecario

La [PR39](https://github.com/alvaradom1304/Altiora-Immersive-Web-Lab/pull/39) corrige coincidencias internas: SEO en «deseo», CRO en «microempresa» y API en «capital». Las cinco copias instaladas pasaron el mismo corpus de17 casos;19 pruebas unitarias y CI Windows/Linux aprobaron. Es recuperación léxica: no demuestra comprensión semántica, selección en sesiones nativas ni ahorro medido de tokens.

## Control completo compartido

Desde la raíz del checkout del laboratorio Altiora-Immersive-Web-Lab, ejecutar `npm run check` (Node.js 20+ y Python 3.11+). Incluye las suites de herramientas, puentes, handler, Bibliotecario y audio; es el mismo comando de CI Windows/Linux. `npm run check:base` es parcial. No ejecutar el comando desde este directorio empresarial por suposición. [PR40](https://github.com/alvaradom1304/Altiora-Immersive-Web-Lab/pull/40) fusionada con CI aprobado. Son pruebas con fixtures, no conexiones nativas ni escucha de material comercial.

## Vigencia del índice local

La [PR41](https://github.com/alvaradom1304/Altiora-Immersive-Web-Lab/pull/41) comprueba altas, bajas y cambios de metadatos. Solo METADATA_CURRENT termina con salida0; STALE exige reconstrucción revisada y LEGACY_REBUILD_REQUIRED identifica índices antiguos sin raíces. Una fuente inaccesible o enlazada queda UNVERIFIED. No aceptar índices ajenos sin revisar sus raíces ni comprobar por mensaje. El índice local se reconstruyó con cuatro raíces explícitas (.agents/skills, .claude/skills, .codex/agents y .claude/agents):194 entradas; conserva las179 anteriores e incorpora15 definiciones ya existentes en otra carpeta de agentes. No crea sesiones o herramientas.

## Coordinación y referencia Orca

[Codex como coordinador](ORQUESTADOR.md) conserva el objetivo y revisa entregas. [Orca](ORCA-ALTIORA.md) queda fijado a v1.4.245/1c6ac8c3c4d2c3dec2cb5966d225ca2a0e0471d3 como referencia documental; no se ha probado como runtime en este PC. No duplicar las capacidades existentes ni instalarlo por efecto lateral.

## Mapa canónico para Claude (31/10/2026)

El routing de Claude, con un coordinador por tipo de encargo, el ciclo de la oferta de US$10.000, los criterios de desempate y los elementos retirados, está en [MAPA-CAPACIDADES.md](MAPA-CAPACIDADES.md). La auditoría y su evidencia están en [AUDITORIA-HERRAMIENTAS-2026-10-31.md](AUDITORIA-HERRAMIENTAS-2026-10-31.md). Las copias retiradas se conservan en `.altiora/retired/20261031-claude/`.
