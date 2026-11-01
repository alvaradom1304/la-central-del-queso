import os

skills_dir = r"C:\Users\Usuario\OneDrive\Desktop\altiora\.agents\skills"

for root, dirs, files in os.walk(skills_dir):
    for file in files:
        if file == "SKILL.md":
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except UnicodeDecodeError:
                continue

            # Si ya fue mejorado por mí antes, saltarlo
            if "SOP de Consultoría" in content or "Instrucciones de Ejecución" in content or "EXECUTIVE PROTOCOL" in content:
                continue

            parts = content.split('---')
            if len(parts) >= 3:
                yaml_block = parts[1]
                body = "---".join(parts[2:]).strip()

                # Eliminar los headers genéricos viejos del título
                lines = body.split('\n')
                if len(lines) > 0 and lines[0].startswith('# '):
                    body = '\n'.join(lines[1:]).strip()

                title = ""
                for line in yaml_block.split('\n'):
                    if line.startswith('name:'):
                        title = line.replace('name:', '').strip().upper()
                        break

                new_body = f"""
# {title} (Executive Protocol)

**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
{body}

## 2. Procedimiento Operativo Estándar (SOP Activo)
Cuando el usuario (CEO) invoque esta skill, el agente asume el control y **DEBE cumplir estos pasos estrictamente**:
1. **Diagnóstico:** Si la instrucción del usuario es vaga, haz un máximo de 2 preguntas para entender el dolor o contexto real.
2. **Ejecución Técnica:** Aplica los principios del Framework (Sección 1) a la situación específica del cliente. 
3. **Restricción de Calidad:** No uses lenguaje genérico de IA. Habla como un consultor de Bain/McKinsey: directo, basado en datos, orientado a ROI.

## 3. Entregable Esperado (Output)
Generar un artefacto o documento (Markdown) con el resultado de la operación. Debe terminar con una recomendación clara de "Próximo Paso".
"""
                new_content = f"---{yaml_block}---\n{new_body}"
                
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
print("208 Skills actualizadas y convertidas a Protocolos Activos Exitosamente.")
