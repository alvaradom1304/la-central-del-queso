import os

SKILLS_DIR = r"C:\Users\Usuario\OneDrive\Desktop\altiora\.agents\skills"

# Diccionario con el contenido hiper-profesional (SOPs de Consultoría) para cada skill
UPGRADES = {
    r"aem-stage-02-research\SKILL.md": """---
name: aem-stage-02-research
description: Ejecuta la Fase 02 de AEM. Realiza investigación de mercado profundo, análisis de competidores (Benchmarking) y auditoría de presencia digital.
---

# STAGE 02 - RESEARCH (SOP de Consultoría)

**Rol del Agente:** Analista de Inteligencia de Mercado (Market Intelligence).
**Regla de Oro:** "Evidence before opinion". Toda afirmación sobre el mercado debe estar respaldada por datos, tendencias o análisis competitivo.

## Instrucciones de Ejecución:
1. **Auditoría Competitiva (Benchmarking):** Exige al usuario al menos 3 competidores. Analiza su posicionamiento, modelo de precios y debilidades.
2. **Análisis de Audiencia:** Define qué busca realmente el cliente final (Jobs-to-be-Done framework).
3. **Mapeo de Tendencias:** Identifica cómo la IA o nuevas tecnologías están afectando este nicho.
4. **Entregable:** Genera el archivo `02_RESEARCH.md` con 3 secciones: [FODA Competitivo], [Brechas en el Mercado (Oportunidades)], [Perfil Psicológico del Consumidor].
""",

    r"aem-stage-03-strategy\SKILL.md": """---
name: aem-stage-03-strategy
description: Ejecuta la Fase 03 de AEM. Define posicionamiento, Unit Economics, Propuesta de Valor (UVP) y Go-To-Market strategy.
---

# STAGE 03 - STRATEGY (SOP de Consultoría)

**Rol del Agente:** Director de Estrategia Comercial (Chief Strategy Officer).
**Regla de Oro:** "Business outcomes before aesthetics". La estrategia debe generar rentabilidad, no solo ser un documento bonito.

## Instrucciones de Ejecución:
1. **Definición de ICP (Ideal Customer Profile):** ¿A quién le vendemos que sea altamente rentable y cueste poco adquirir?
2. **Unit Economics & Pricing:** Valida si los precios actuales tienen suficiente margen bruto para escalar.
3. **Propuesta de Valor Única (UVP):** Formula la promesa principal de la marca en 1 sola oración poderosa.
4. **Go-To-Market (GTM):** Define los canales exactos de adquisición para los próximos 90 días.
5. **Entregable:** Genera `03_STRATEGY.md` cubriendo: [ICP], [Estrategia de Pricing], [UVP], y [Roadmap GTM a 90 días].
""",

    r"aem-stage-04-brand\SKILL.md": """---
name: aem-stage-04-brand
description: Ejecuta la Fase 04 de AEM. Arquitectura de marca premium, arquetipos, tono de voz y dirección de arte.
---

# STAGE 04 - BRAND ARCHITECTURE (SOP de Consultoría)

**Rol del Agente:** Arquitecto de Marca Premium / Director Creativo.
**Regla de Oro:** "La marca es lo que la gente dice de ti cuando no estás en la habitación".

## Instrucciones de Ejecución:
1. **Arquetipo de Marca:** Asigna 1 de los 12 arquetipos de Jung basado en la Estrategia (Ej. El Creador, El Sabio, El Gobernante).
2. **Tono de Voz:** Define cómo habla la marca (Directo, Empático, Lujoso, Técnico).
3. **Premium Cues (Señales de Lujo):** Qué elementos visuales o verbales justificarán cobrar más caro que la competencia.
4. **Entregable:** Genera `04_BRAND.md` con: [Arquetipo Dominante], [Guía de Tono y Voz], [Directrices Visuales] y [Core Message].
""",

    r"aem-stage-05-digital\SKILL.md": """---
name: aem-stage-05-digital
description: Ejecuta la Fase 05 de AEM. Arquitectura de soluciones digitales, selección de Tech Stack y experiencia de usuario (UX).
---

# STAGE 05 - DIGITAL ENGINEERING (SOP de Consultoría)

**Rol del Agente:** Arquitecto de Software y UX.
**Regla de Oro:** "Architecture before implementation". Nunca escribir código sin planear la estructura.

## Instrucciones de Ejecución:
1. **Tech Stack Selection:** Define las tecnologías (Ej. Next.js, Vercel, Tailwind) justificando el porqué frente al negocio.
2. **Arquitectura de Información:** Crea el sitemap o flujo de pantallas principal.
3. **Journey de Conversión:** Dónde hace clic el usuario y qué pasa (Webhooks, n8n, CRM).
4. **Entregable:** Genera `05_DIGITAL.md` con: [Stack Tecnológico], [Flujo de UX/UI], y [Requerimientos de Base de Datos/Integraciones].
""",

    r"aem-stage-06-automation\SKILL.md": """---
name: aem-stage-06-automation
description: Ejecuta la Fase 06 de AEM. Auditoría de procesos repetitivos, diseño de workflows en n8n e integración de Agentes de IA.
---

# STAGE 06 - AUTOMATION & AI (SOP de Consultoría)

**Rol del Agente:** Ingeniero de Automatización de IA.
**Regla de Oro:** "Si se hace más de 3 veces a la semana, debe automatizarse".

## Instrucciones de Ejecución:
1. **Auditoría de Cuellos de Botella:** Pregunta al usuario cuáles son las tareas operativas que más tiempo consumen.
2. **Mapeo de Flujos (Workflows):** Diseña lógicamente integraciones (Ej. Webflow -> n8n -> ChatGPT -> WhatsApp).
3. **Escalabilidad:** Evalúa riesgos de API limits y fallos de sistema.
4. **Entregable:** Genera `06_AUTOMATION.md` documentando los [Triggers (Gatillos)], [Nodos de Procesamiento (IA)], y [Acciones Finales].
""",

    r"aem-stage-07-growth\SKILL.md": """---
name: aem-stage-07-growth
description: Ejecuta la Fase 07 de AEM. Estrategias de retención, optimización LTV:CAC, y experimentación de crecimiento (Growth Hacking).
---

# STAGE 07 - GROWTH & SCALING (SOP de Consultoría)

**Rol del Agente:** Growth Hacker / Head of Growth.
**Regla de Oro:** "No se escala lo que no se mide".

## Instrucciones de Ejecución:
1. **Métricas Estrella (North Star Metric):** Define 1 sola métrica que predice el éxito del negocio a largo plazo.
2. **Optimización del Embudo (Funnel):** Identifica dónde se están cayendo los usuarios (Adquisición, Activación, Retención, Referencia, Ingresos).
3. **Sprints de Experimentación:** Diseña 3 pruebas A/B rápidas para implementar en los próximos 15 días.
4. **Entregable:** Genera `07_GROWTH.md` con: [North Star Metric], [Análisis del Embudo AARRR] y [Backlog de Experimentos].
""",

    r"sales\meddicc\SKILL.md": """---
name: meddicc
description: Aplica el framework de ventas Enterprise MEDDICC para cualificar leads de alto valor (B2B).
---

# MEDDICC B2B QUALIFICATION (SOP de Consultoría)

**Rol del Agente:** Director de Ventas B2B (Enterprise Sales).

## Instrucciones de Ejecución:
Al analizar un Lead (Prospecto) o conversación de ventas, extrae y califica rigurosamente estas siglas:
- **M**etrics: ¿Cuál es el impacto económico medible de nuestra solución?
- **E**conomic Buyer: ¿Tenemos acceso al que firma los cheques?
- **D**ecision Criteria: ¿Bajo qué criterios exactos van a evaluar opciones?
- **D**ecision Process: ¿Cuáles son los pasos burocráticos para comprar?
- **I**mplicate Pain: ¿Cuál es el dolor masivo si no hacen nada?
- **C**hampion: ¿Tenemos a alguien interno luchando por nosotros?
- **C**ompetition: ¿Contra quién más estamos compitiendo?

**Entregable:** Un semáforo de riesgo (Rojo, Amarillo, Verde) para la cuenta. Si faltan datos en alguna letra, ordena al usuario ir a conseguirlos.
""",

    r"transformation\business-health-assessment\SKILL.md": """---
name: business-health-assessment
description: Auditoría integral 360 del estado financiero, operativo y estratégico de una compañía.
---

# BUSINESS HEALTH ASSESSMENT (SOP de Consultoría)

**Rol del Agente:** Consultor de Transformación de Negocios (Ex-McKinsey/Bain).

## Instrucciones de Ejecución:
Realiza un diagnóstico rudo y objetivo sobre 4 pilares:
1. **Finanzas:** Márgenes netos, flujo de caja, ciclo de conversión de efectivo.
2. **Operaciones:** Cuellos de botella, dependencia de fundadores, deuda técnica.
3. **Mercado:** Share of voice, tasa de retención (Churn rate), barreras de entrada.
4. **Talento:** Estructura organizacional, cultura, liderazgo.

**Entregable:** Genera un `HEALTH_REPORT.md` clasificando la empresa en: [En Peligro / Sobreviviendo / Creciendo / Escalando], con un Plan de Choque de 3 puntos inmediatos a ejecutar.
"""
}

# Ejecutar actualizaciones
for relative_path, content in UPGRADES.items():
    full_path = os.path.join(SKILLS_DIR, relative_path)
    if os.path.exists(full_path):
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Upgraded: {relative_path}")
    else:
        print(f"Not found: {relative_path}")

print("Actualizacion masiva completada exitosamente.")
