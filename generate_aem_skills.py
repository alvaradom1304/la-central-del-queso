import os

skills = {
    'aem-core-philosophy': {
        'desc': 'Usa este skill para alinear decisiones con la filosofía AEM OS (Strategy before design, Evidence before opinion) y entender la arquitectura central del sistema.',
        'content': '# AEM OS - Core Philosophy & Vision\n\n## 1. Visión Central\nNo competimos por hacer más websites. Competimos por entender mejor los negocios.\nMetodología: Understand -> Research -> Strategize -> Architect -> Build -> Automate -> Measure -> Optimize -> Scale.\n\n## 2. Filosofía Operativa\n1. **Strategy before design**: Nunca diseñar sin entender negocio, cliente, mercado.\n2. **Evidence before opinion**: Justificar toda recomendación con evidencia.\n3. **Systems before isolated deliverables**: Pensar en sistemas completos, no piezas sueltas.\n4. **Business outcomes before aesthetics**: Estética subordinada al resultado empresarial.\n5. **Diagnose before prescribe**: Diagnosticar antes de recomendar.\n6. **Architecture before implementation**: Definir arquitectura y KPIs antes de construir.\n7. **Reusable assets**: Cada proyecto genera frameworks, SOPs, agentes, etc.'
    },
    'aem-stage-01-discovery': {
        'desc': 'Usa este skill para ejecutar la Fase 01 (Discovery) de un cliente o proyecto, diagnosticando el negocio, modelo, procesos y objetivos.',
        'content': '# STAGE 01 - DISCOVERY\n\nComprender el negocio profundamente.\n\n## Analizar:\n- Historia y fundador.\n- Modelo de negocio, productos y servicios.\n- Clientes y canales.\n- Operaciones, procesos y recursos.\n- Problemas, objetivos y restricciones.\n- Fortalezas, debilidades y oportunidades.\n\n## Output Esperado:\nGenerar un **Business Discovery Document** (`01_DISCOVERY.md`).'
    },
    'aem-stage-02-research': {
        'desc': 'Usa este skill para ejecutar la Fase 02 (Research), investigando mercado, competencia, tendencias y comportamiento del consumidor.',
        'content': '# STAGE 02 - RESEARCH\n\nInvestigar el entorno competitivo y de mercado.\n\n## Analizar:\n- Mercado e industria (tamaño, tendencias).\n- Consumidores (comportamiento, psicología).\n- Competencia (directa e indirecta).\n- Posicionamiento y pricing del mercado.\n- Canales, contenido y SEO de competidores.\n\n## Output Esperado:\nGenerar un **Research Intelligence Report** (`02_RESEARCH.md`).'
    },
    'aem-stage-03-strategy': {
        'desc': 'Usa este skill para ejecutar la Fase 03 (Strategy), definiendo posicionamiento, propuesta de valor, ICP y roadmap estratégico.',
        'content': '# STAGE 03 - STRATEGY\n\nConvertir descubrimientos e investigación en dirección estratégica.\n\n## Definir:\n- Objetivos empresariales y KPIs.\n- Posicionamiento y propuesta de valor.\n- ICP (Ideal Customer Profile) y buyer personas.\n- Customer journey.\n- Diferenciación.\n- Estrategia comercial y de marketing.\n- Roadmap y prioridades.\n\n## Output Esperado:\nGenerar un **Strategic Direction Document** (`03_STRATEGY.md`).'
    },
    'aem-stage-04-brand': {
        'desc': 'Usa este skill para ejecutar la Fase 04 (Brand), diseñando el propósito, arquetipo, messaging y arquitectura visual de la marca.',
        'content': '# STAGE 04 - BRAND\n\nConstruir la identidad estratégica de la marca.\n\n## Definir:\n- Propósito, misión, visión y valores.\n- Personalidad y arquetipo de marca.\n- Tono de voz y messaging (pilares de contenido).\n- Identidad visual (tipografía, color, diseño).\n- Arquitectura de marca.\n\n## Output Esperado:\nGenerar un **Brand Architecture + Brand System Document** (`04_BRAND.md`).'
    },
    'aem-stage-05-digital': {
        'desc': 'Usa este skill para ejecutar la Fase 05 (Digital), definiendo UX/UI, ecosistema web, funnels y desarrollo (Next.js/Tailwind).',
        'content': '# STAGE 05 - DIGITAL\n\nConstruir el ecosistema digital interactivo y transaccional.\n\n## Principio:\nEl website no debe ser simplemente una pieza visual. Debe ser una herramienta empresarial.\n\n## Incluye:\n- Arquitectura de información y UX/UI.\n- Website, landing pages, ecommerce.\n- SEO, contenido y redes sociales.\n- Funnels y sistemas de conversión.\n- Tech Stack: React, Next.js, Tailwind CSS, Zustand, GSAP/Framer Motion.\n\n## Output Esperado:\nGenerar el ecosistema digital documentado (`05_DIGITAL.md`) y el código base.'
    },
    'aem-stage-06-automation': {
        'desc': 'Usa este skill para ejecutar la Fase 06 (AI & Automation), diseñando workflows en n8n, agentes y optimización de procesos.',
        'content': '# STAGE 06 - AI & AUTOMATION\n\nIdentificar y automatizar procesos empresariales mediante IA y workflows.\n\n## Metodología:\n**Input -> Process -> Decision -> Output.**\n\n## Determinar:\n- Qué automatizar (n8n).\n- Qué aumentar con IA (Claude, Gemini, ChatGPT).\n- Qué mantener humano.\n- Qué datos necesita y herramientas a utilizar.\n- ROI esperado.\n\n## Output Esperado:\nFlujos de trabajo documentados (`06_AI_AUTOMATION.md`) y exportaciones de n8n.'
    },
    'aem-stage-07-growth': {
        'desc': 'Usa este skill para ejecutar las Fases 07 y 08 (Growth & Optimization), creando loops de adquisición, medición de KPIs y analítica.',
        'content': '# STAGE 07 & 08 - GROWTH & OPTIMIZATION\n\nCrear sistemas de crecimiento medibles y optimizables.\n\n## Analizar y Medir:\n- Adquisición, conversión, retención, recompra, referrals.\n- LTV, CAC, ROAS, conversion rate, profitability.\n- GA4, conversion tracking, dashboards (Power BI).\n\n## Ciclo de Optimización:\n**Measure -> Learn -> Optimize -> Repeat.**\n\n## Output Esperado:\nSistemas de crecimiento y dashboards documentados (`07_GROWTH.md` y `08_ANALYTICS.md`).'
    },
    'aem-learning-os': {
        'desc': 'Usa este skill para procesar nuevos conocimientos o herramientas, extraer frameworks y productizar capacidades (Learning OS & Productization).',
        'content': '# LEARNING OS & PRODUCTIZATION\n\nConvertir aprendizaje en activos reutilizables y productos.\n\n## Modelo de Aprendizaje:\n**Learn -> Apply -> Document -> Systematize -> Productize.**\n\n## Capability System (Para evaluar nuevas herramientas):\n1. ¿Qué problema resuelve?\n2. ¿Cómo funciona y cuándo usarla/no usarla?\n3. ¿Inputs/Outputs?\n4. ¿Cómo se integra al AEM OS?\n5. ¿Puede ser un Skill, Agente, Template o Producto?\n\n## Productización:\nConvertir horas de servicio en: frameworks, audits, templates, SaaS, automatizaciones.'
    }
}

base_dir = r"C:\Users\Usuario\OneDrive\Desktop\Repo\.agents\skills"
os.makedirs(base_dir, exist_ok=True)

for name, data in skills.items():
    skill_dir = os.path.join(base_dir, name)
    os.makedirs(skill_dir, exist_ok=True)
    file_path = os.path.join(skill_dir, "SKILL.md")
    
    yaml_frontmatter = f"---\nname: {name}\ndescription: {data['desc']}\n---\n\n"
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(yaml_frontmatter + data['content'] + "\n")

print("Skills de AEM OS construidos correctamente en el workspace.")
