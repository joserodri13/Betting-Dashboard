# AGENTS.md

## 1. Objetivo del proyecto

Desarrollar una aplicación web con dashboards para el registro, seguimiento y análisis de apuestas deportivas, comenzando por el fútbol.

La aplicación debe permitir registrar apuestas, consultar sus resultados, analizar el rendimiento económico, medir el Closing Line Value (CLV) e identificar posibles apuestas de valor mediante probabilidades propias estimadas a partir de datos futbolísticos.

El proyecto debe ser escalable, mantener una arquitectura sencilla y evolucionar progresivamente según las necesidades del usuario.

---

## 2. Reglas fundamentales

* No implementar funcionalidades que el usuario no haya solicitado expresamente.
* No tomar decisiones funcionales importantes sin justificarlas.
* Priorizar la simplicidad, la mantenibilidad y la escalabilidad.
* Mantener un diseño limpio, moderno y adaptado a web.
* Todos los textos visibles de la interfaz deben estar en español.
* Utilizar siempre la hora local correspondiente a cada usuario.
* Mantener el número de archivos y la complejidad del proyecto al mínimo razonable.
* No introducir dependencias, servicios externos ni tecnologías innecesarias.
* No asumir que una funcionalidad está implementada correctamente sin verificarla.
* No inventar datos, probabilidades, resultados ni información procedente de fuentes externas.
* Los cálculos financieros y estadísticos deben ser reproducibles y deterministas.
* Elaborar pruebas de test para cada nueva implementación.
* Siempre al empezar, observa el contenido de los ficheros MEMORY.md y README.md.
* No llevar a cabo decisiones sin aprobación.
* Lee `docs/constitution.md` y la spec activa (`specs/NNN-*/`) antes de tocar código. 

## 3. Funcionalidades del producto

La aplicación debe contemplar:

1. Registro y visualización de las apuestas del día, diferenciando las pendientes, las que están en juego y las finalizadas mediante iconos y colores.
2. Apartado informativo con explicaciones breves de términos técnicos, incluidos Kelly Criterion, Closing Line Value, stake sugerido y drawdown.
3. Acción para comprobar el estado y resultado de una apuesta mediante información actualizada en tiempo real.
4. Histórico de apuestas realizadas.
5. Visualización destacada del balance de pérdidas y ganancias.
6. Solicitud del bankroll inicial durante el primer uso.
7. Registro y seguimiento del Closing Line Value (CLV).
8. Value Bet Detector basado en probabilidades propias estimadas mediante un modelo estadístico.
9. Cálculo y presentación del Kelly Criterion, stake sugerido y drawdown.

---

## 4. Modelo estadístico

### 4.1. Modelo de probabilidades

La primera versión utilizará un modelo de **Poisson independiente** para estimar las probabilidades de los resultados futbolísticos.

La distribución de Poisson será:

`P(X=k) = (e^-λ × λ^k) / k!`

donde:

* `λ` representa los goles esperados del equipo.
* `k` representa el número de goles.

A partir de las distribuciones de goles esperados del equipo local y visitante se calcularán las probabilidades de:

* Victoria local.
* Empate.
* Victoria visitante.

El modelo podrá extenderse posteriormente a otros mercados.

### 4.2. Variables utilizadas

La estimación inicial deberá considerar:

* Expected Goals (xG).
* Forma como local y visitante.
* Bajas de los equipos.

La forma y las bajas deberán utilizarse para ajustar los goles esperados (`λ`) de forma explícita y reproducible.

No se deben introducir ponderaciones arbitrarias sin una justificación documentada.

### 4.3. Papel del LLM

El LLM no debe determinar directamente las probabilidades finales.

El flujo correcto será:

`Datos → ajustes de xG → modelo estadístico → probabilidades → EV → Kelly`

Los agentes pueden investigar, interpretar información, recopilar datos y coordinar el proceso, pero los cálculos finales deben ejecutarse mediante código determinista.

La aplicación debe poder explicar y reproducir cómo se obtuvo una probabilidad determinada.

---

## 5. Value Bet Detector

El detector compara la probabilidad propia estimada con la cuota decimal disponible.

La condición para considerar una apuesta como Value Bet será:

`probabilidad_propia × cuota > 1.05`

Este umbral se aplica a todos los mercados contemplados por el detector.

Además, se calculará el valor esperado:

`EV = probabilidad_propia × cuota - 1`

Una alerta de Value Bet no constituye una garantía de beneficio. Representa únicamente una ventaja matemática según la estimación utilizada por el modelo.

No cambiar el umbral de `1.05` sin autorización del usuario.

---

## 6. Kelly Criterion

Se utilizará Kelly como referencia para determinar el porcentaje óptimo del bankroll.

Para apuestas binarias:

`f* = (p × cuota - 1) / (cuota - 1)`

donde:

* `f*` = fracción óptima del bankroll.
* `p` = probabilidad estimada.
* `cuota` = cuota decimal.

El stake correspondiente a Kelly completo será:

`Stake Kelly = Bankroll × f*`

El **stake sugerido utilizará inicialmente ½ Kelly**:

`Stake sugerido = Bankroll × f* × 0.5`

Kelly completo se mostrará como referencia matemática y ½ Kelly como recomendación operativa.

Si Kelly produce una fracción igual o inferior a cero, no se recomendará un stake positivo mediante este criterio.

Para mercados con más de dos resultados mutuamente excluyentes, como 1X2, no utilizar incorrectamente la fórmula binaria. Se deberá implementar la formulación apropiada para múltiples resultados.

---

## 7. Closing Line Value

El CLV se calculará comparando la cuota obtenida al realizar la apuesta con la cuota disponible al cierre.

La fórmula inicial será:

`CLV (%) = (Cuota tomada / Cuota de cierre - 1) × 100`

Interpretación:

* CLV positivo: la cuota tomada fue superior a la cuota de cierre.
* CLV negativo: la cuota tomada fue inferior a la cuota de cierre.
* CLV igual a cero: ambas cuotas fueron iguales.

Para calcularlo correctamente, la cuota tomada y la cuota de cierre deben corresponder exactamente al mismo evento, mercado y selección.

La aplicación deberá almacenar ambas cuotas.

La fuente de la cuota de cierre y el tratamiento del margen de la casa de apuestas se definirán cuando se seleccione el proveedor de datos.

---

## 8. Gestión de apuestas

Cada apuesta deberá mantener como mínimo la información necesaria para:

* Identificar el evento.
* Identificar el mercado y selección.
* Registrar la cuota tomada.
* Registrar el stake.
* Registrar el estado.
* Registrar el resultado.
* Registrar la cuota de cierre cuando esté disponible.
* Calcular el CLV.
* Calcular el resultado económico.
* Relacionar la apuesta con el bankroll correspondiente.

Los estados iniciales serán:

* Pendiente.
* En juego.
* Finalizada.

Los estados deberán diferenciarse visualmente mediante iconos y colores.

### Validaciones de registro y edición (fuente única)

Al registrar o editar una apuesta se aplican las mismas validaciones:

* V1: partido/evento obligatorio (no vacío).
* V2: cuota tomada > 1.
* V3: probabilidad propia entre 1 y 99 (%).
* V4: stake ≥ 1.
* V5: si el estado es finalizada, el resultado (ganada/perdida) es obligatorio.
* V6: la cuota de cierre es opcional; si está vacía, el CLV queda sin calcular.

Si alguna validación falla, se rechaza el guardado y se informa del error en español.

---

## 9. Bankroll, balance y drawdown

La aplicación solicitará el bankroll inicial durante el primer uso.

El balance de pérdidas y ganancias deberá calcularse de forma determinista a partir de las apuestas registradas.

El drawdown deberá representar la caída del bankroll desde un máximo histórico alcanzado hasta un valor posterior.

La definición matemática exacta utilizada para el drawdown debe mantenerse consistente durante toda la aplicación.

No modificar retrospectivamente los resultados históricos sin una acción explícita y controlada.

---

## 10. Hora y fechas

La aplicación deberá utilizar siempre la hora local correspondiente al usuario.

Los datos almacenados deben mantener una representación inequívoca del instante temporal y la interfaz debe mostrar las fechas y horas en la zona horaria local del usuario.

No asumir que todos los usuarios utilizan la misma zona horaria.

---

## 11. Escalabilidad

La primera versión estará centrada exclusivamente en fútbol.

La arquitectura debe permitir posteriormente:

* Incorporar otros deportes.
* Incorporar nuevos mercados de apuestas.
* Ampliar el Value Bet Detector.

Estas posibilidades futuras no deben implementarse hasta que sean solicitadas.

No realizar abstracciones prematuras únicamente por anticipar futuras funcionalidades.

---

## 12. Responsabilidades de los agentes

### Coordinator

* Coordinar el trabajo.
* Delegar tareas en los subagentes adecuados.
* Mantener la coherencia global del proyecto.
* Evitar duplicidades y cambios contradictorios.
* Presentar al usuario las decisiones importantes.
* Verificar que las tareas respetan los requisitos establecidos.

### Planner

* Analizar requisitos.
* Preparar especificaciones, planes y tareas.
* Identificar dependencias, riesgos y ambigüedades.
* No introducir requisitos nuevos.

### Researcher

* Investigar documentación y alternativas técnicas.
* Priorizar fuentes oficiales y verificables.
* Investigar fuentes de datos deportivos cuando sea necesario.
* Diferenciar hechos, estimaciones y recomendaciones.
* Comunicar fuentes y limitaciones.

### Frontend-attendance

* Implementar la interfaz.
* Mantener todos los textos visibles en español.
* Priorizar claridad visual y diseño web.
* Respetar los requisitos de diseño y funcionalidad.

### Backend-attendance

* Implementar lógica de negocio.
* Implementar cálculos estadísticos y financieros.
* Gestionar datos y persistencia.
* Mantener la consistencia de fechas, horas y resultados.
* Garantizar que los cálculos sean reproducibles.

### Reviewer

* Comprobar el cumplimiento de requisitos.
* Revisar cálculos.
* Revisar calidad y arquitectura.
* Detectar errores y regresiones.
* Verificar pruebas.
* Comprobar que no se hayan añadido funcionalidades no solicitadas.

---

## 13. Metodología de desarrollo

Cuando se utilice Spec-Driven Development (SDD):

1. Analizar la petición.
2. Identificar requisitos y restricciones.
3. Elaborar o actualizar la especificación.
4. Definir el plan de implementación.
5. Descomponer el trabajo en tareas.
6. Implementar únicamente lo acordado.
7. Ejecutar pruebas y comprobaciones.
8. Revisar el resultado.
9. Actualizar documentación.

Para cambios importantes se debe priorizar:

`Especificar → Planificar → Implementar → Verificar`

---

## 14. Gestión de memoria

`MEMORY.md` contiene el contexto estable del producto y las decisiones relevantes.
Consultar este archivo cada vez que se vaya a realizar una nueva tarea.

Debe utilizarse para recordar:

* Objetivos del producto.
* Requisitos confirmados.
* Decisiones metodológicas.
* Restricciones.
* Decisiones arquitectónicas importantes.

No utilizar `MEMORY.md` como registro de conversaciones ni como lista de tareas.

Las decisiones pendientes no deben tratarse como requisitos confirmados.

Cada entrada en este diario debe tener un máximo de 15 líneas.
Excepción: las entradas de cambios puramente visuales tendrán un máximo de 5 líneas.

---

## 15. Criterios de finalización

Una tarea se considera terminada cuando:

* Cumple los requisitos acordados.
* Los cálculos relevantes han sido verificados.
* Las pruebas pertinentes han sido ejecutadas.
* Los cambios no introducen funcionalidades no solicitadas.
* La documentación afectada está actualizada.
* Las limitaciones conocidas están documentadas.

Al finalizar una tarea importante, proporcionar:

* Resumen de cambios (8 líneas max).
* Pruebas realizadas.
* Resultado de las pruebas.
* Decisiones tomadas.
* Aspectos pendientes de revisión.
* Actualizar el README.md si se han añadido/eliminado funcionalidades nuevas.
