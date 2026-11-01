# Bibliotecario: coincidencias por términos completos

Fecha: 2026-10-31. Se reprodujeron falsos candidatos en el buscador local, no en un cliente nativo:

| Consulta | Antes | Corrección verificada |
|---|---|---|
| Deseo conseguir mi primer cliente | SEO primero con 20 puntos, solo por estar dentro de «deseo» | SEO ya no recibe esa coincidencia |
| Organizar una microempresa | CRO con 20 puntos, solo por estar dentro de «microempresa» | No aparece CRO por esa subcadena |
| API | Incluía capital-requirements y working-capital | No aparecen por contener «api» dentro de «capital» |
| SEO / $api-security | Recuperación explícita válida | Se conserva |

El buscador compara términos completos de nombre/descripción; incluye componentes de identificadores con guiones o guiones bajos. La bonificación de nombre explícito exige un identificador completo en la consulta. Mayúsculas, acentos y normalización Unicode se conservan como búsquedas equivalentes. Las consultas con un identificador compuesto no encontrado no se expanden arbitrariamente a sus componentes para inventar una skill ausente.

No cambia el esquema del catálogo, su procedencia ni las rutas. El índice no necesita reconstruirse por este cambio del algoritmo: sigue conteniendo los mismos metadatos. Se actualiza el helper y los casos donde está instalado, con respaldo y comparación de la versión anterior; no se reemplazan variantes modificadas por otro dueño. Las copias gestionadas del proyecto actualizan únicamente los hashes correspondientes de su recibo.

## Verificación

- Las nuevas regresiones fallaron antes de cambiar la implementación: nombres cortos dentro de palabras ajenas y API dentro de capital.
- Pasaron las 19 pruebas del Bibliotecario en Windows con permisos adecuados, incluidos enlaces/junctions. La revisión independiente pasó 17 aserciones propias de límites, identificadores, acentos compuestos/descompuestos, vacío y palabras vacías; no pudo crear enlaces en su entorno restringido y no los dio por comprobados allí.
- La suite anterior conservó 14/14 resultados. Se añadieron tres casos específicos; ahora hay 17 casos redactados, sin presentarlos como muestra independiente de usuarios.

Esto corrige una coincidencia léxica falsa. No acredita comprensión semántica, búsqueda por sinónimos/plurales, interpretación de negación, ahorro de tokens ni mejora de la selección nativa de otras IAs. Un resultado vacío puede significar falta de palabras coincidentes: el coordinador debe interpretar la solicitud con las capacidades reales disponibles. `retrieval_score` es una pista local de ranking, no confianza o calidad comercial.
