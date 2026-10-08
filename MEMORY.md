# MEMORY.md

## 1. Visión del proyecto

Aplicación web de registro, seguimiento y análisis de apuestas deportivas, comenzando por el mercado de fútbol.

El objetivo es registrar las apuestas realizadas, analizar el rendimiento económico, medir el Closing Line Value (CLV) e identificar posibles apuestas de valor mediante probabilidades propias.

El proyecto debe comenzar de forma sencilla y evolucionar progresivamente.

---

## 2. Alcance inicial confirmado

La primera versión debe incluir:

* Registro de apuestas del día.
* Estados de apuestas: pendientes, en juego y finalizadas.
* Diferenciación visual mediante iconos y colores.
* Consulta actualizada del estado de las apuestas.
* Histórico de apuestas.
* Balance de pérdidas y ganancias.
* Solicitud del bankroll inicial en el primer uso.
* Kelly Criterion.
* Stake sugerido.
* Drawdown.
* Closing Line Value.
* Value Bet Detector.
* Apartado informativo sobre conceptos técnicos.

La interfaz será:

* Limpia.
* Moderna.
* Adaptada a web.
* Completamente en español.

La aplicación utilizará siempre la hora local del usuario.

---

## 3. Modelo de probabilidades

### Modelo elegido

El modelo inicial será un **modelo de Poisson independiente**.

Para cada equipo se utilizará:

`P(X=k) = (e^-λ × λ^k) / k!`

donde `λ` representa los goles esperados.

Las distribuciones de goles del equipo local y visitante permitirán obtener:

* Probabilidad de victoria local.
* Probabilidad de empate.
* Probabilidad de victoria visitante.

### Variables

El modelo utilizará inicialmente:

* xG.
* Forma como local/visitante.
* Bajas.

La forma y las bajas se incorporarán mediante ajustes sobre los goles esperados.

La metodología concreta de esos ajustes deberá ser reproducible y estar documentada.

### Principio fundamental

El LLM no debe decidir directamente las probabilidades.

El cálculo debe seguir:

`Datos → Ajuste de xG → Poisson → Probabilidades → EV → Kelly`

Los agentes pueden investigar y coordinar, pero el cálculo final debe realizarse mediante código determinista.

---

## 4. Value Bet Detector

La condición establecida es:

`probabilidad_propia × cuota > 1.05`

Esta condición se aplicará a todos los mercados incluidos en el detector.

También se calculará:

`EV = probabilidad_propia × cuota - 1`

Una Value Bet representa una posible ventaja matemática según el modelo y no garantiza beneficios.

El umbral `1.05` no debe modificarse sin autorización.

---

## 5. Kelly Criterion

Se utilizará Kelly como referencia matemática.

Para apuestas binarias:

`f* = (p × cuota - 1) / (cuota - 1)`

donde:

* `p` = probabilidad estimada.
* `cuota` = cuota decimal.
* `f*` = fracción óptima del bankroll.

Kelly completo:

`Stake Kelly = Bankroll × f*`

Stake operativo inicial:

`Stake sugerido = Bankroll × f* × 0.5`

Por tanto, la aplicación utilizará inicialmente **½ Kelly como stake sugerido**, mientras muestra Kelly completo como referencia.

Si `f* <= 0`, no se recomendará stake positivo mediante Kelly.

Para mercados con múltiples resultados, como 1X2, se utilizará la formulación apropiada de Kelly para resultados mutuamente excluyentes y no la fórmula binaria.

---

## 6. Closing Line Value

La fórmula adoptada inicialmente es:

`CLV (%) = (Cuota tomada / Cuota de cierre - 1) × 100`

Interpretación:

* Positivo → se consiguió una cuota mejor que la de cierre.
* Negativo → se consiguió una cuota peor que la de cierre.
* Cero → cuota tomada y cuota de cierre iguales.

La aplicación deberá almacenar:

* Cuota tomada.
* Cuota de cierre.
* CLV calculado.

Ambas cuotas deben corresponder al mismo evento, mercado y selección.

La fuente de la cuota de cierre se decidirá posteriormente.

---

## 7. Bankroll

El usuario debe introducir su bankroll inicial al iniciar la aplicación por primera vez.

El bankroll será la base para:

* Calcular stake mediante Kelly.
* Calcular evolución económica.
* Calcular drawdown.
* Mostrar pérdidas y ganancias.

La gestión matemática del bankroll deberá ser determinista.

---

## 8. Drawdown

El drawdown representará la caída del bankroll desde un máximo histórico hasta un valor posterior.

La aplicación deberá mantener una definición consistente del drawdown.

La fórmula concreta y las métricas que se mostrarán podrán detallarse durante la implementación financiera, manteniendo esta definición conceptual.

---

## 9. Estados de las apuestas

Estados iniciales:

1. Pendiente.
2. En juego.
3. Finalizada.

Cada estado tendrá una representación visual diferenciada.

Las apuestas finalizadas deberán conservar su resultado para formar parte del histórico y del balance.

---

## 10. Escalabilidad

El producto comienza exclusivamente con fútbol.

La arquitectura debe permitir posteriormente:

* Otros deportes.
* Nuevos mercados.
* Nuevos detectores de Value Bets.

Estas ampliaciones son objetivos futuros y no forman parte de la primera versión.

No implementar funcionalidades futuras hasta que sean solicitadas.

---

## 11. Decisiones aún pendientes

Las siguientes cuestiones todavía no están definidas:

* Stack tecnológico.
* Base de datos.
* Fuentes concretas de cuotas.
* Fuente de resultados en tiempo real.
* Fuente de xG.
* Fuente de información sobre bajas.
* Método concreto para ajustar xG utilizando forma.
* Método concreto para ajustar xG utilizando bajas.
* Mercados incluidos exactamente en la primera versión del Value Bet Detector.
* Fuente definitiva para la cuota de cierre.
* Tratamiento del margen de las casas de apuestas.
* Arquitectura definitiva de agentes.
* Skills necesarias.
* MCP necesarios.

Estas decisiones deberán tomarse durante el desarrollo y registrarse cuando se conviertan en decisiones definitivas.

---

## 12. Principios de desarrollo

El proyecto debe:

* Mantener pocos archivos inicialmente.
* Evitar complejidad prematura.
* No añadir funcionalidades no solicitadas.
* Priorizar cálculos reproducibles.
* Separar los cálculos estadísticos de la lógica del LLM.
* Documentar las decisiones importantes.
* Permitir revisar y modificar las decisiones antes de convertirlas en arquitectura permanente.

---

## 13. Prioridad actual

El proyecto se encuentra en fase inicial.

La prioridad es:

1. Definir la arquitectura técnica.
2. Seleccionar las fuentes de datos necesarias.
3. Construir una primera versión funcional sencilla.
4. Validar el modelo de probabilidades.
5. Validar los cálculos de Value Bet, EV, Kelly y CLV.
6. Incorporar progresivamente agentes, skills, MCP y SDD cuando aporten valor.

No es necesario configurar todo el sistema multiagente antes de comenzar a desarrollar la aplicación.

---

## 14. Diario

Cabecera: `Betting App` a 2rem centrada, sin subtítulo; `<title>` de pestaña eliminado.
Interfaz solo web: `responsive` sustituido por `adaptada a web` en README y MEMORY.
Regla: las entradas visuales del diario tienen un máximo de 5 líneas.

Web fluida 2 columnas con pestañas (día/registrar/histórico/info) y balance fijo; apilado bajo 900px solo de emergencia.
