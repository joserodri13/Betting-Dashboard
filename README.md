# Football Betting Analytics

Aplicación web para registrar, seguir y analizar apuestas deportivas, comenzando por el fútbol.

El proyecto busca combinar gestión de apuestas, análisis estadístico y métricas de rendimiento para evaluar la calidad de las decisiones tomadas, especialmente mediante **Closing Line Value (CLV)** y detección de posibles **Value Bets**.

> El proyecto es una herramienta de análisis y gestión de apuestas. Las métricas y probabilidades dependen de la calidad de los datos y del modelo utilizado y no garantizan beneficios económicos.

---

## Funcionalidades

### Registro de apuestas

La aplicación permitirá:

* Registrar apuestas.
* Visualizar las apuestas del día.
* Diferenciar apuestas pendientes, en juego y finalizadas.
* Consultar el estado actualizado de una apuesta.
* Consultar el histórico de apuestas.
* Editar apuestas finalizadas del histórico.
* Eliminar apuestas finalizadas del histórico con confirmación.

### Dashboard financiero

Se mostrará:

* Bankroll.
* Balance de pérdidas y ganancias.
* Stake sugerido.
* Kelly Criterion.
* Drawdown.
* Closing Line Value.

El usuario introducirá su bankroll inicial durante el primer uso.

### Value Bet Detector

El detector calculará una probabilidad propia para una selección y la comparará con la cuota disponible.

La alerta se producirá cuando:

`Probabilidad propia × Cuota > 1.05`

También se calculará el valor esperado:

`EV = Probabilidad propia × Cuota - 1`

Una Value Bet representa una posible ventaja matemática según el modelo y no garantiza que la apuesta sea ganadora.

---

## Modelo estadístico

La primera versión utilizará un **modelo de Poisson independiente**.

La distribución utilizada será:

`P(X=k) = (e^-λ × λ^k) / k!`

Los goles esperados (`λ`) se estimarán a partir de:

* xG.
* Forma como local/visitante.
* Bajas.

El modelo producirá las probabilidades de los posibles resultados del partido.

El proceso será:

```text
Datos futbolísticos
        ↓
Ajuste de xG
        ↓
Modelo de Poisson
        ↓
Probabilidades propias
        ↓
EV / Value Bet
        ↓
Kelly
        ↓
Stake sugerido
```

Los cálculos serán realizados mediante código determinista.

El LLM no decidirá directamente las probabilidades.

---

## Kelly Criterion

Para apuestas binarias:

`f* = (p × cuota - 1) / (cuota - 1)`

donde:

* `p` = probabilidad estimada.
* `cuota` = cuota decimal.
* `f*` = fracción óptima del bankroll.

Kelly completo:

`Stake Kelly = Bankroll × f*`

El stake sugerido utilizará inicialmente **½ Kelly**:

`Stake sugerido = Bankroll × f* × 0.5`

Kelly completo se conservará como referencia matemática.

Para mercados con múltiples resultados, como 1X2, se utilizará la formulación apropiada para resultados mutuamente excluyentes.

---

## Closing Line Value

El CLV inicial se calculará mediante:

`CLV (%) = (Cuota tomada / Cuota de cierre - 1) × 100`

Interpretación:

* CLV positivo → cuota tomada superior a la cuota de cierre.
* CLV negativo → cuota tomada inferior a la cuota de cierre.
* CLV cero → ambas cuotas iguales.

La aplicación almacenará la cuota tomada y la cuota de cierre para poder reproducir el cálculo.

---

## Diseño

La aplicación deberá tener:

* Diseño limpio.
* Diseño moderno.
* Adaptación a diseño web.
* Interfaz completamente en español.
* Uso de la hora local de cada usuario.

El proyecto comenzará con una estructura pequeña y se ampliará únicamente cuando sea necesario.

---

## Escalabilidad

La primera versión estará centrada en fútbol.

La arquitectura deberá permitir posteriormente:

* Añadir otros deportes.
* Añadir nuevos mercados.
* Ampliar el Value Bet Detector.
* Añadir nuevas funcionalidades.
* Añadir diseño adaptado a móviles.

Estas ampliaciones no forman parte de la primera versión.

---

## Estado del proyecto

El proyecto parte desde cero.

Las decisiones ya establecidas son:

| Elemento        | Decisión                                                                       |
| --------------- | ------------------------------------------------------------------------------ |
| Deporte inicial | Fútbol                                                                         |
| Modelo          | Poisson independiente                                                          |
| Variables       | xG + forma + bajas                                                             |
| Value Bet       | `P × cuota > 1.05`                                                             |
| EV              | `P × cuota - 1`                                                                |
| Kelly           | Kelly completo como referencia                                                 |
| Stake sugerido  | ½ Kelly                                                                        |
| CLV             | Cuota tomada vs. cuota de cierre                                               |
| Cálculos        | Deterministas                                                                  |
| Papel del LLM   | Coordinación, investigación y asistencia; no cálculo directo de probabilidades |
| Interfaz        | Español, limpia, moderna y adaptada a web                                    |

---

## Pendiente de definir

Todavía no se han seleccionado:

* Stack tecnológico.
* Base de datos.
* Fuentes de cuotas.
* Fuente de resultados.
* Fuente de xG.
* Fuente de bajas.
* Método exacto para ajustar xG por forma.
* Método exacto para ajustar xG por bajas.
* Mercados concretos de la primera versión.
* Fuente de cuota de cierre.
* Tratamiento del margen de las casas de apuestas.
* Arquitectura definitiva de agentes.
* Skills.
* MCP.

Estas decisiones se tomarán progresivamente durante el desarrollo.

---

## Documentación

### `AGENTS.md`

Contiene las instrucciones que deben seguir los agentes durante el desarrollo.

### `MEMORY.md`

Contiene el contexto persistente del producto y las decisiones importantes tomadas durante el proyecto.

### Futuro

A medida que el proyecto crezca podrán incorporarse:

* Especificaciones SDD.
* Decisiones arquitectónicas.
* Skills.
* MCP.
* Agentes especializados.
* Documentación adicional.
