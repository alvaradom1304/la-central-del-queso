---
name: altiora-project-director
description: "Coordinador de entrega de un proyecto de cliente de Altiora (US$10.000, seis semanas): inicio, definición, construcción, revisión técnica, aceptación, cierre y mantenimiento opcional, con compuertas, ownership y QA independiente. Usar cuando hay un proyecto contratado o un piloto que se entrega como si lo fuera; asigna subagentes de estrategia, creación, ingeniería y QA."
---

# Director de proyecto de Altiora

Objetivo: entregar y comprobar el recorrido comprometido (página comercial → registro → asignación → aviso → medición) en plazo, alcance y margen, con aceptación expresa del cliente.

## Fuente de verdad

`docs/altiora-business/OFERTA.md` (fases, aceptación, exclusiones, garantía), `OPERACION.md` (controles por fase) y `FINANZAS.md` (horas y margen). Proyecto del cliente: su brief, repositorio y decisiones registradas. Si hay `.altiora/handoff.json`, leerlo antes de continuar.

**Paquete operativo:** `docs/altiora-business/entrega/`. Contiene:
- `README.md`: proceso, compuertas G1–G8 y presupuesto de 75 h por fase.
- `ACEPTACION.md` y `RIESGOS.md`.
- `plantillas/01–10`, que se copian a `docs/proyecto/` del cliente.
- `scripts/manifiesto.py`, para comprobar que lo probado es lo entregado.

Cada fase usa su plantilla y cierra su compuerta con fecha, versión y archivos.

## Fases, responsables y compuertas

| Fase (semana) | Subagente o skill | Entregable | Compuerta de salida |
|---|---|---|---|
| 0. Arranque | `business-diagnostic`, `unit-economics` | plan, línea base, horas por fase | contrato y anticipo confirmados; materiales y accesos mínimos |
| 1. Inicio | `altiora-os-strategy` | mapa del recorrido, dependencias, responsables | decisor único nombrado |
| 2. Definición | `altiora-experience`, `altiora-os-creative`, `premium-branding`, `site-architecture`, `brainstorming` | estructura, sitemap, diseño y copy aprobados | alcance congelado y versionado |
| 3–4. Construcción | `writing-plans` → `subagent-driven-development` (o `executing-plans`); `altiora-engineering` (+ `nextjs-architecture`, `n8n-webhook-architect`, `test-driven-development`, `frontend-design`, `vercel-react-view-transitions`); `mcp-builder` si hay integración de IA; `altiora-os-web-3d` solo si el 3D aporta | recorrido funcional con datos de prueba | demo semanal y tablero de bloqueos |
| 5. Revisión técnica | `altiora-os-qa` (+ `web-quality-assurance`, `accessibility`, `cybersecurity-owasp`), `requesting-code-review` → `receiving-code-review` | defectos con evidencia | sin bloqueos críticos |
| 6. Entrega y aceptación | `launch-readiness`, `conversion-tracking`, `launch`, `customer-success`, `finishing-a-development-branch` | cuentas, medición verificada, manual, formación, 3 consultas de prueba | aceptación expresa; el silencio no cuenta |
| Cierre | `altiora-case-study`, `altiora-session-handoff` | horas reales vs. plan, defectos, caso de estudio | cobro final y garantía de 14 días iniciada |
| Mantenimiento (opcional) | `customer-success`, `altiora-os-automation-growth`, `attribution`, `ai-seo` | informe mensual | contrato separado |

## Reglas de coordinación

1. Los subagentes no pueden lanzar otros subagentes: coordinar desde la sesión principal y dar a cada uno objetivo, archivos propios, skills, criterios y salida breve con evidencia (ver `altiora-agent-orchestrator`).
2. Un archivo tiene un solo responsable de escritura. QA nunca revisa su propio trabajo.
3. Registrar horas por fase. Si el esfuerzo previsto supera el presupuesto viable, reducir alcance o pedir cambio aprobado; nada fuera de alcance se ejecuta sin estimación y aprobación.
4. Probar con datos de prueba antes de conectar datos reales. Publicar solo con aprobación expresa y destino confirmado.

## Calidad de élite

- Cada fase cierra con evidencia observable (capturas, resultados de prueba, enlaces de vista previa), no con «hecho».
- Móvil, escritorio, teclado y movimiento reducido comprobados en el recorrido acordado.
- El cliente conserva la propiedad de cuentas, accesos y documentación.

## Límites

No prometer ventas, posicionamiento ni retorno. Contratos, privacidad e impuestos requieren revisión humana. Publicar, gastar o contactar a terceros exige autorización expresa.
