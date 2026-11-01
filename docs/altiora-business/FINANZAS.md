# Altiora — Finanzas y operación para proyectos de US$10.000

Fecha: 31 de octubre de 2026. Borrador interno revisable. Estado: NEEDS_REVIEW. Skill aplicada: margin-analysis 0.1.0, experimental, con contrato y protocolo leídos. No constituye estados financieros, asesoría fiscal ni acreditación profesional.

## Base y límites

Dato del encargo: meta comercial US$10.000 **por proyecto**, con mantenimiento mensual opcional. Cero clientes de pago confirmados; no hay facturación, costes, caja ni recurrencia reales verificados. El catálogo local es una fotografía de metadata, no prueba disponibilidad operativa, empleados, licencias ni conexiones. No se leyó .env ni historia personal.

La oferta solo resulta viable si alcance, esfuerzo, riesgo y valor para un comprador permiten ese precio. El precio deseado no demuestra disposición a pagar. Todo número siguiente, salvo la meta recibida, es un supuesto de diseño; no es cotización de proveedores, salario de mercado, previsión de venta ni coste real.

## Economía de una unidad: un proyecto

Supuesto de cálculo: P=US$10.000 de ingreso neto comercial por proyecto, antes de determinar impuestos aplicables. No se presume si el precio ofertado al cliente incluirá tributos. Si incluye importes recaudados para terceros, el contador debe separar esos importes y recalcular P. Sin descuentos, devoluciones ni impagos en esta simulación.

Variables: D=costes directos variables pagaderos; H=horas del fundador atribuibles al proyecto; v=valor económico supuesto de una hora del fundador, US$50/h; T=H×v; R=reserva gerencial por contingencia; O=gastos fijos del periodo.

| Concepto por proyecto (USD salvo horas) | Acotado | Referencia | Desborde |
|---|---:|---:|---:|
| P: ingreso neto supuesto | 10.000 | 10.000 | 10.000 |
| D: costes directos externos supuestos | 2.000 | 3.000 | 4.500 |
| H: horas fundador supuestas | 60 | 90 | 130 |
| T: H×US$50/h | 3.000 | 4.500 | 6.500 |
| R: contingencia gerencial supuesta | 500 | 750 | 1.100 |
| C=P−D: contribución antes de tiempo fundador y reserva | 8.000 | 7.000 | 5.500 |
| C/P: margen de contribución sobre ingreso | 80% | 70% | 55% |
| E=P−D−T−R: excedente económico de planificación | 4.500 | 1.750 | −2.100 |
| E/P: margen económico de planificación | 45% | 17,5% | −21% |

D debe incluir colaboradores, licencias/activos exclusivos, consumo incremental de IA, comisiones de cobro/venta y otros desembolsos variables atribuibles, sin duplicarlos. Las herramientas compartidas y asesoría general van a O; una revisión profesional exclusiva de un proyecto puede ir a D. D requiere desglose y cotizaciones antes de comprometer el precio.

La contribución C cubre O y remuneración del fundador; no es beneficio neto. E incorpora el coste de oportunidad del fundador y una reserva de gestión: tampoco es utilidad contable, EBITDA ni caja disponible. R no es gasto realizado ni provisión contable automática. Si el fundador cobra efectivamente por esas horas, registrar la salida y evitar restar el mismo trabajo dos veces en el análisis económico. El margen bruto contable exige definir y validar qué integra coste de ventas; no se afirma aquí.

Puente de referencia: 10.000−3.000=7.000; 7.000−4.500−750=1.750. Reconciliación: 3.000+4.500+750+1.750=10.000. Entre acotado y referencia, E cae US$2.750: D +1.000, T +1.500 y R +250. Entre referencia y desborde cae US$3.850: D +1.500, T +2.000 y R +350. Precio y volumen constantes; sin atribuir causas observadas.

Umbral interno propuesto, pendiente de decisión del fundador: E/P≥25% antes de gastos fijos. En referencia solo se obtiene 17,5%: rediseñar alcance/horas o reprecificar antes de aceptar. Con D=3.000, R=750 y v=50, H máximo compatible con 25% es (10.000−3.000−750−2.500)/50=75 h. La comparación es económica, no una promesa de ejecución en 75 h.

## Cobros y caja

Propuesta negociable: 50% (US$5.000) al contratar/reservar capacidad, 30% (US$3.000) tras aprobación escrita de diseño/arquitectura y 20% (US$2.000) tras aceptación final expresa, posterior a entregar accesos/cuentas, manual y formación acordados. La revisión técnica preliminar no es aceptación final. Los 14 días de corrección de defectos empiezan en esa aceptación final completa. El calendario ilustrativo de caja debe contemplar que el último cobro puede llegar después de haber completado la entrega. Definir entregables, vencimientos, plazo de revisión, revisiones incluidas, dependencias, cancelación y propiedad intelectual con revisión jurídica antes de contratar. No afirmar que un anticipo sea no reembolsable ni aplicar términos sin acuerdo.

| Momento hipotético — referencia | Cobro | Pago directo | Saldo acumulado del proyecto desde cero |
|---|---:|---:|---:|
| Contratación | 5.000 | 1.000 | 4.000 |
| Aprobación intermedia | 3.000 | 1.200 | 5.800 |
| Aceptación final | 2.000 | 800 | 7.000 |

Este calendario supone cobro antes de los pagos mostrados. Los US$7.000 finales aún deben financiar fundador, O y obligaciones aplicables. La reserva de US$750 reduce disponibilidad gerencial, pero no el saldo bancario hasta gastarse. Facturar no demuestra cobrar; recibir anticipo tampoco acredita haber devengado todo el ingreso.

Caja_t=caja_(t−1)+cobros_t−pagos_t. Capital inicial mínimo de un calendario=max(0,−mínimo de flujos acumulados) más colchón acordado. Si el primer cobro se retrasa y se pagan los US$1.000 iniciales, el déficit desde cero es US$1.000; no comenzar con déficit sin cobertura acordada. Preparar proyección semanal de 13 semanas con saldo real, obligaciones y vencimientos, sin confundirla con el margen. No se ha confirmado liquidez disponible.

## Capacidad y punto de equilibrio

Supuesto operativo ilustrativo por bloque de cuatro semanas: 160 h disponibles; 40 h para ventas/administración, 20 h de holgura y 10 h para soporte contratado; quedan 90 h para proyectos. Capacidad en proyectos equivalentes=90/H: 1,50 acotado; 1,00 referencia; 0,69 desborde. No son ventas previstas ni implican que todo proyecto dure cuatro semanas. Dependencias, concurrencia y fechas limitan la promesa al cliente.

Límite inicial propuesto: un proyecto principal activo hasta medir entrega, revisiones y soporte. Asignar horas por fase y registrar desviaciones semanalmente. No vender una segunda entrega simultánea si las horas ya comprometidas superan el presupuesto neto de capacidad. Revisar el límite después de proyectos terminados, no por percepción de que la IA produce más rápido.

Punto de equilibrio simplificado en proyectos por periodo=techo(O/C), solo con C>0, costes comparables y capacidad suficiente. No hay O real para calcularlo. Para rentabilidad económica, incluir coste del trabajo fundador y contingencias sin doble contabilización. Si las unidades necesarias superan capacidad, recortar estructura, mejorar alcance o precio; aumentar ventas por sí solo no resuelve el cuello de botella. Con ingresos cero el margen porcentual es indefinido, no 0%.

## Mantenimiento mensual opcional y separado

El proyecto de US$10.000 no genera automáticamente mantenimiento ni MRR. Ofrecerlo solo cuando exista responsabilidad continua concreta: actualizaciones acordadas, copias/restauración comprobable, seguimiento y pequeñas correcciones. Evoluciones, nueva estrategia, rediseños, integraciones y costes de terceros requieren alcance separado o una bolsa explícita. Distinguir garantía de defectos de soporte adicional para no cobrar dos veces la misma obligación.

Fórmula de cuota neta propuesta: Q=(d+h×v+r+o)/(1−m), con 0≤m<1; d=costes directos mensuales por cuenta; h=horas reservadas y gestión; v=coste/valor horario coherente; r=contingencia de servicio; o=cuota justificada de estructura; m=margen económico objetivo. Si hay comisiones proporcionales f, Q=(d+h×v+r+o)/(1−m−f), con denominador positivo. No hay cuota validada ni costes suficientes para recomendar un importe.

Antes de cotizar: activos cubiertos, horario y canal, tiempos de respuesta frente a resolución, horas incluidas, consumo máximo de terceros, ventanas de cambios, escalado, incidentes, exclusiones, renovación y cancelación. No ofrecer disponibilidad permanente sin capacidad y cobertura reales.

Capacidad de mantenimiento: cuentas máximas=suelo(horas reservadas de soporte/h por cuenta), ajustada por picos e incidentes concurrentes. Con las cuatro horas propuestas en OFERTA y 10 h totales ilustrativas, el techo aritmético sería dos cuentas, antes de ajustar por picos; no autoriza venderlas ni prueba que cuatro horas sean suficientes. Un servicio distinto de dos horas por cuenta daría cinco como techo aritmético, pero no es el mantenimiento ofrecido aquí. Ingresos recurrentes se reportan únicamente por contratos activos, separados de cobros, proyectos puntuales e impagos.

## Roles: capacidades localizadas y personas pendientes

Fuente E1: C:/Users/Usuario/OneDrive/Desktop/altiora/.altiora/catalog.local.json, leído como metadata el 31-10-2026; scope declarado local_metadata_snapshot_not_runtime_capabilities. No se cargaron cuerpos de toda la biblioteca.

| Función necesaria | Capacidades existentes según metadata | Responsabilidad humana y límite |
|---|---|---|
| Control financiero | financial-diagnostic, cost-analysis, margin-analysis, cash-flow-analysis, break-even-analysis, capital-requirements, financial-forecasting | Analista prepara escenarios y compara real/presupuesto; fundador aprueba compromisos. Contador humano habilitado en jurisdicción aplicable verifica registros y obligaciones. No se acredita contador contratado. |
| Operación y capacidad | capacity-planning, cost-to-serve; definición altiora-os-coordinate | Fundador/gestor acuerda alcance, calendario, carga, proveedores y aceptación. Una definición de agente no acredita ejecución disponible. |
| Venta consultiva | lead-qualification, gap-selling, spin-selling, challenger-selling, fanatical-prospecting | Responsable comercial valida necesidad, autoridad, presupuesto y decisión del comprador; no inventa ROI ni casos de éxito. |
| Estrategia y análisis | definiciones altiora-os-strategy, altiora-os-research, altiora-research | Investigación trazable y caso de negocio con datos permitidos; profesional sectorial cuando el riesgo lo exija. |
| Entrega y revisión | definiciones altiora-engineering, altiora-experience, altiora-os-web-3d, altiora-os-creative, altiora-os-media, altiora-os-qa, altiora-review | Responsable técnico valida lo vendido y reviewer contrasta aceptación. El catálogo no prueba contratos laborales, horas disponibles ni calidad demostrada. |
| Riesgo jurídico/fiscal | No se acredita en esta revisión profesión regulada ni habilitación | Abogado local para contratos, responsabilidad, datos, propiedad intelectual y colaboración laboral cuando proceda. Contador para facturación, impuestos, retribución y conciliación. Determinar país, entidad y mercados antes de prescribir reglas. |

Secuencia propuesta de apoyo: preparación financiera y operativa interna; revisión puntual de contador y abogado según jurisdicción/alcance; especialistas de entrega según proyecto y presupuesto aprobado. No crear una estructura fija grande para aparentar élite antes de validar ventas y capacidad. No se contrató, contactó, gastó ni concedió permiso alguno.

## Decisiones go/no-go propuestas

1. Go comercial solo si comprador y problema están identificados, alcance medible, valor sustentable y presupuesto/autoridad confirmados. No-go para promesas de ventas o resultados garantizados.
2. Go económico si costes cotizados, horas y contingencia dejan el margen mínimo decidido. El escenario referencia incumple el 25% ilustrativo: revisar antes de venderlo tal cual.
3. Go de inicio si contrato, primer cobro efectivo y cobertura de obligaciones están acordados; no financiar déficit desconocido con trabajo futuro supuesto.
4. Go de entrega si criterios de aceptación y capacidad están verificados. Cambio material de alcance implica presupuesto/plazo nuevo por escrito.
5. Go de recurrencia si existe servicio continuo definido, horas reservadas y cuota calculada. No incorporar mantenimiento ficticio para justificar rentabilidad del proyecto.

Go expresa una evaluación, no permiso para contratar, transferir dinero, publicar o contactar terceros.

## Evidencia y comprobaciones

E2: La [calculadora oficial SBA de punto de equilibrio](https://www.sba.gov/counseling/plan-your-business/break-even-point-calculator/) confirma la fórmula costes fijos/(precio−coste variable) y la distinción de costes por volumen. Consultada 31-10-2026; metodología general en contexto estadounidense, no normativa aplicable a Altiora.

E3: La [guía oficial SBA para gestionar finanzas](https://www.sba.gov/counseling/manage-your-business/) explica registros de ingresos/gastos, la diferencia temporal entre caja y devengo y el apoyo contable para cobros, pagos, caja y conciliación. Consultada 31-10-2026. Se utiliza el método financiero general, sin trasladar reglas fiscales estadounidenses.

E4: Cálculos recomputados mediante JavaScript: escenarios, reconciliaciones, porcentajes, techo de horas, hitos 50/30/20 y capacidad. PASS: unidades y periodos declarados, denominadores positivos en escenarios, margen económico negativo visible. Caso de ingreso cero: porcentaje indefinido, tratado explícitamente. Datos insuficientes: NEEDS_REVIEW; importes reales, costes fijos, capacidad, país/entidad, términos y cuotas pendientes. Validación de estados financieros y revisión profesional: NOT_RUN. Este documento no acredita resultado comercial.

### Paquete de retorno de la skill

task_id: altiora-finance-operations-20261031; skill: margin-analysis; version: 0.1.0; status: NEEDS_REVIEW.

result.margin_bridge: summary=puente económico ilustrativo; data=tabla y puente de escenarios anteriores; evidence_ids=E4; limitations=sin costes reales ni política contable.

result.contribution: summary=contribución por proyecto; data=C de US$8.000/7.000/5.500 y porcentajes 80/70/55%; evidence_ids=E2,E4; limitations=excluye estructura, tiempo fundador y tributos no determinados.

result.reconciliation: summary=precio reconciliado por escenario; data=P=D+T+R+E; evidence_ids=E4; limitations=reconciliación de supuestos, no auditoría.

assumptions: todos los parámetros numéricos ilustrativos anteriores. missing_inputs: costes reales/desglose, O, caja y calendario reales, jurisdicción/entidad, capacidad medida, cuota y alcance de soporte. validation: PASS aritmética y límites; NOT_RUN contabilidad real y revisión profesional. next_actions: sustituir supuestos por cotizaciones/horas y revisar con responsables humanos antes de comprometer una oferta.

**Próximo Paso:** el fundador selecciona un alcance vendible de US$10.000 y completa D, H, obligaciones y calendario; analista recalcula; contador y abogado revisan lo que corresponda a la jurisdicción confirmada. No es necesario esperar a esas revisiones para seguir preparando una propuesta interna.
