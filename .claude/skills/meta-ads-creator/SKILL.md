---
name: meta-ads-creator
description: Convierte un brief aprobado en variantes de anuncios para Meta con hook, body, CTA, concepto visual y plan de prueba, señalando claims y políticas por verificar. Produce borradores, nunca publica ni cambia presupuestos.
---

# Creatividad para Meta Ads

## Contrato

- **Versión:** 1.0.0 | **Dominio:** marketing de respuesta directa | **Tipo:** SOP compuesto | **Estado:** experimental
- **Resultado:** paquete de creatividades listo para revisión: ángulos, guiones, CTA, dirección visual, adaptaciones y matriz de prueba.
- **Activar cuando:** se solicita crear conceptos o guiones de anuncios para Facebook/Instagram (Meta).
- **No activar cuando:** se solicita fabricar testimonios, garantías, resultados, before/after engañosos o segmentación discriminatoria.
- **Dependencias:** `advertising-concept`, `social-creative`, `campaign-concept`, `scriptwriting`, `brand-voice`, `brand-guidelines`, `ai-image-direction`.
- **Aprobación:** contenido, visual, destino, audiencia, presupuesto y publicación requieren aprobación humana separada. No publicar ni editar la cuenta publicitaria.

## SOP ejecutable

### 1. Recibe el brief

Usa `references/input-schema.json` y `references/protocol.md`. Confirma objetivo de negocio y evento de conversión, producto/oferta, audiencia prevista, mercado, etapa del funnel, landing page, precio, pruebas y restricciones de marca. Si faltan oferta, audiencia o destino, pregunta antes de generar. Registra qué afirmaciones están probadas y cuáles no.

### 2. Construye la estrategia creativa

Resume en una línea: quién, problema observable, resultado que el producto puede ofrecer y motivo para actuar. Elige 3 ángulos claramente distintos, por ejemplo: costo/tiempo del problema, proceso o mecanismo, demostración/caso autorizado. No atribuyas al lector características personales (“¿Tienes X enfermedad/deuda?”). Habla de la situación o el producto sin afirmar conocimiento íntimo del usuario. No uses atributos protegidos para excluir ni orientar anuncios.

### 3. Genera conceptos de anuncio

Por cada ángulo, escribe 2 variantes. Cada variante incluye:

1. **Hook:** primera frase/escena que capta atención sin clickbait ni promesa no sustentada.
2. **Body:** problema/contexto, mecanismo del producto y beneficio defendible; identifica cualquier claim que necesite prueba.
3. **CTA:** una acción coherente con el funnel y la landing (p. ej. ver demo, solicitar evaluación, comprar).
4. **Texto principal y titular:** versiones adecuadas a las ubicaciones solicitadas; si no se conocen límites vigentes, marca “verificar recuentos/especificaciones actuales”.
5. **Dirección visual:** formato, encuadre, sujeto/objeto, acción, escenario, color, iluminación, texto en pantalla y cierre de marca.
6. **Guion por escena:** duración objetivo, visual, voz/diálogo, texto superpuesto y sonido. Ofrece 15–30 s para video corto salvo que el brief requiera otro formato.
7. **Prompt visual opcional:** descriptivo y original; evita logos no autorizados, marcas de terceros, personas reales o imitaciones de creadores sin permiso.

### 4. Asegura substanciación y políticas

Etiqueta cada afirmación como `verificada`, `requiere evidencia` o `eliminar`. Pide respaldo para resultados cuantificados, comparaciones, precio/ahorro, desempeño, testimonios, credenciales y disponibilidad. No inventes cifras, reseñas ni escasez. Evita contenido engañoso, promesas absolutas y lenguaje que atribuya al usuario un atributo personal sensible. Si el sector puede estar regulado o la política puede haber cambiado, enlaza la política oficial de Meta vigente y devuelve `NEEDS_REVIEW` para revisión de cumplimiento antes de publicar.

### 5. Diseña prueba y medición

Propón una matriz que cambie una variable principal por comparación: ángulo, hook, demostración visual o CTA. Especifica hipótesis, evento, ventana de observación definida por el equipo, indicador primario y guardrails (p. ej. tasa de conversión, CPA, frecuencia, calidad de lead). No predigas resultados como hechos ni fijes presupuesto. Si hay datos de campañas previas, separa dato observado de hipótesis.

### 6. QA y entrega

Verifica consistencia entre anuncio, oferta y landing; ortografía; subtítulos/legibilidad; accesibilidad básica; claims y permisos de imagen/música; formatos y especificaciones actuales de placement; y que cada variante tenga CTA. Entrega el paquete mediante `references/output-schema.json`. Marca todo como borrador; no cambies campañas, públicos, presupuesto ni publiques.

## Criterios de calidad

- Cada variante presenta una idea central y no mezcla varias hipótesis.
- El hook es específico, verdadero y entendible sin sonido cuando se requiere video.
- La dirección visual se puede producir (plano, acción, texto, duración y cierre).
- Claims sin respaldo quedan bloqueados, no suavizados de forma engañosa.
- La matriz indica qué se prueba y qué se medirá; no promete rendimiento.

Lee [contrato](references/contract.json), [protocolo](references/protocol.md), [entrada](references/input-schema.json), [salida](references/output-schema.json) y [casos](references/evaluation-cases.json).

## Fuentes para verificar antes de ejecutar

- [Meta Advertising Standards](https://transparency.meta.com/policies/ad-standards/)
- [Meta Business Help Center: ad policies](https://www.facebook.com/business/help/488043719226449)

Confirma siempre que las reglas y especificaciones sigan vigentes en la fecha de la campaña o despliegue.
