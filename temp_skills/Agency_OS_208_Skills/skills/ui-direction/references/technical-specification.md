# ui-direction — criterios de ingeniería

Diferenciar token primitivo de semántico y componente; no distribuir colores ad hoc por pantalla. Un estado disabled necesita explicación cuando el usuario puede resolver la causa. No confiar en color como única señal de error/stock. Estados loading deben preservar selección y prevenir duplicado sin bloquear recuperación. El CTA requiere jerarquía comercial y acceso sin recorrido forzado. Personalizar a partir de concepto, evidencia propia y patrones reconocibles; no copiar una referencia y cambiar logotipo. Registrar decisiones para handoff y cómo se comporta contenido largo o desconocido.

## Caso adverso determinante

El diseño solo incluye estados ideales; agotados, dirección inválida y red lenta muestran la misma pantalla y el CTA permite doble pedido.

## Evidencia de aceptación

- Resolver el fallo específico con evidencia y límites
- No cerrar con contradicción material o resultado inventado
- Entregar criterios verificables y responsables operativos según alcance

Registrar entorno, build/versión, entrada, resultado esperado/observado y artefacto. Marcar NOT_RUN cuando no se ejecute; no sustituir una comprobación por una promesa de optimización futura.
