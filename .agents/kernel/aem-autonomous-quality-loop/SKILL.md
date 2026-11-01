---
name: aem-autonomous-quality-loop
description: Ciclo de control de calidad autónomo para Altiora. Evalúa, diagnostica y corrige errores con un límite estricto de 3 iteraciones.
---

# Autonomous Quality Loop

## Propósito
Implementar ciclos autónomos y controlados de ejecución y pruebas.

## Workflow
PLAN -> EXECUTE -> TEST -> EVALUATE -> DIAGNOSE -> CORRECT -> RETEST -> VALIDATE -> REPORT

## Restricciones
- Máximo de 3 intentos de corrección para prevenir bucles infinitos.
- Detener el ciclo si no hay progreso verificable (Estado: BLOCKED).
