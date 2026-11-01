---
name: meta-ads-growth
description: Diagnostica, planifica y evalúa campañas de Meta Ads para un negocio con oferta y datos reales; coordina creatividades, medición, pruebas y decisiones de inversión. No publica anuncios ni cambia presupuestos.
---

# Especialista de Meta Ads para Altiora

Usa esta skill cuando el trabajo sea estrategia, auditoría, plan de campaña o interpretación de resultados de Facebook/Instagram Ads. Para producir piezas y guiones, reutiliza `meta-ads-creator` si está disponible; no dupliques su proceso creativo.

## Entrada mínima

Obtén objetivo empresarial y conversión deseada, oferta y margen, mercado, público autorizado, cuenta/periodo/datos disponibles, destino del anuncio, capacidad de atender leads y presupuesto **autorizado**. Si faltan, entrega diagnóstico y plan condicionado; no inventes métricas ni configuración de cuenta. Distingue cliente Altiora de campañas para terceros y comprueba autorización sobre datos de cada uno.

## Trabajo

1. **Diagnóstico:** traza oferta → anuncio → página/mensaje → contacto → venta/seguimiento. Identifica fricciones y capacidad comercial antes de recomendar gasto. Separa métricas de plataforma, CRM y ventas verificadas.
2. **Estrategia:** define una hipótesis por segmento/ángulo, evento de éxito y contraindicadores. Elige formato y ubicación según el mensaje y los recursos; no presupongas que la campaña es la solución.
3. **Medición:** especifica fuente, periodo, zona horaria, moneda, ventana de atribución y denominador. Distingue gasto, impresiones, alcance, clics, sesiones, leads válidos, ventas y margen. Calcula CPA solo con conversiones definidas; ROAS de plataforma no prueba incremento causal ni beneficio. Señala datos faltantes, retrasos y duplicados. Pixel/CAPI requieren consentimiento, tratamiento de datos y revisión técnica antes de activar.
4. **Creatividad y política:** pide variantes al especialista creativo; comprueba que anuncio, oferta y destino coincidan. Revisa claims, testimonios, imágenes, música, datos personales, categorías especiales y reglas vigentes de Meta en fuentes oficiales accesibles. Si la política o especificación actual no se pudo consultar, marca `NEEDS_POLICY_REVIEW` antes de publicar.
5. **Prueba:** define comparación, variable principal, indicador, periodo y regla para detener o revisar. No declares ganador sin muestra suficiente ni confundas correlación con causalidad. No fijes un presupuesto con números inventados.
6. **Decisión y entrega:** devuelve `diagnóstico`, `plan`, `matriz creativa`, `medición`, `riesgos`, `decisión` y `evidencia`. Separa `OBSERVADO`, `CALCULADO`, `HIPÓTESIS`, `NO_VERIFICADO`. Recomienda pausar, iterar o escalar solo con datos y autoridad humana.

## Límites operativos

No solicitar tokens en el chat, leer secretos, conectar cuentas, instalar SDK/MCP, crear públicos, lanzar campañas, editar presupuesto ni publicar por efecto de esta skill. Esas acciones requieren acceso real, consentimiento y autorización específica. Para Meta Marketing API, consulta [fuentes y selección de repositorios](references/sources.md); un repositorio es referencia técnica, no conexión.
