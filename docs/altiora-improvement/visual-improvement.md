# Mejora continua de animación y realismo 3D

## Cuándo se activa
Cuando el usuario diga que falta animación, movimiento, profundidad, inmersión o realismo 3D, que el resultado es básico/repetitivo, o solicite elevar su calidad. No limitarse a repetir el mismo efecto con colores diferentes.

## Recorrido obligatorio
1. Abrir la implementación y la vista actual, si las herramientas lo permiten. Registrar una captura inicial y la sección/dispositivo afectados. Si no se puede ver la página, decirlo y no inventar una inspección visual.
2. Formular un diagnóstico concreto: ritmo y continuidad del movimiento; cámara/parallax y composición; escala, geometría, materiales PBR y texturas; iluminación ambiental/HDRI, sombras de contacto y reflejos; coherencia fotográfica; carga y rendimiento. Revisar solo las dimensiones pertinentes.
3. Leer las skills necesarias: frontend-design para dirección visual; motion-design/gsap-animation para movimiento; threejs-experience/react-three-fiber para escenas; accessibility/web-performance para sus límites. No cargar todas por defecto.
4. Consultar las herramientas ya instaladas y comparar dos técnicas viables. Buscar repositorios/documentación oficial actuales si falta una solución o la anterior no satisface el encargo. Registrar URL, versión/revisión, licencia del código y de los assets, compatibilidad con React/Next/Three y coste total. Buscar un candidato nuevo no obliga a instalarlo.
5. Elegir una mejora perceptible y hacer una prueba pequeña en la sección afectada. Explicar cómo responde al diagnóstico. Integrar el resultado dentro del trabajo autorizado; no quedarse en una lista de librerías o en un cubo de demostración como entrega final.
6. Comparar antes/después en la misma vista y recorrido. Verificar móvil, interacción comercial, movimiento reducido y alternativa ligera si WebGL falla. Medir carga/fluidez cuando sea posible; no inventar FPS, puntuaciones o conversiones. Cargar las escenas pesadas bajo demanda.
7. Si la mejora no resuelve el defecto identificado, corregir o probar la alternativa. Evitar iteraciones ilimitadas: tras dos pruebas sin resultado, explicar el bloqueo y la siguiente opción viable. No repetir una solución rechazada sin explicar qué cambió.
8. Conservar lo que mejore la experiencia sin romper criterios críticos. Registrar en el proyecto: problema, técnica, decisión, evidencia, costes/dependencias y aprendizaje reutilizable. Cerrar al cumplir el encargo; reabrir solo ante un defecto o información material nuevos.

## Fuentes de partida, bajo demanda
- https://github.com/mrdoob/three.js — renderizado, materiales e iluminación.
- https://github.com/pmndrs/react-three-fiber — integración de escenas con React; comprobar compatibilidad de versiones.
- https://github.com/pmndrs/drei — utilidades de escenas; revisar dependencias y licencias de assets externos.
- https://github.com/greensock/GSAP — coreografía de movimiento/scroll; revisar licencia vigente y accesibilidad.

Estas URLs son referencias; este cambio no instala esos paquetes ni mejora por sí solo una escena. Realismo requiere assets y dirección visual apropiados, además de código.
