# Spec: Modificar el histórico (editar y eliminar apuestas)

## Contexto y objetivo
Proyecto Betting-Dashboard: el usuario registra apuestas manualmente y puede equivocarse (cuota, stake, resultado...). Hoy un error solo se compensa con registros nuevos, lo que corrompe el histórico, el balance y el CLV. Objetivo: corregir o eliminar cualquier apuesta para que el histórico refleje la realidad.

## Usuarios
- Usuario único: el apostante que registra y analiza sus propias apuestas.

## Historias de usuario
- HU-1: Como apostante que se equivocó en una cuota, quiero editarla para que el balance y el CLV queden correctos.
- HU-2: Como apostante que registró una apuesta duplicada, quiero eliminarla (con confirmación) para que no distorsione el histórico.

## Requisitos funcionales
- RF-1: Cuando el usuario edite cualquier apuesta (pendiente, en juego o finalizada), el sistema debe permitir modificar todos sus datos.
- RF-2: Cuando el usuario solicite eliminar una apuesta, el sistema debe pedir confirmación explícita antes de borrarla.
- RF-3: Si el usuario elimina una apuesta confirmada, el sistema debe borrarla de forma permanente y sin rastro.
- RF-4: El sistema debe aplicar al editar las mismas validaciones que al registrar (cuota > 1, probabilidad 1–99, resultado obligatorio si finalizada).
- RF-5: Si los datos editados incumplen una validación, el sistema debe rechazar el guardado e indicar el error en español.
- RF-6: Cuando se guarde una edición o se complete un borrado, el sistema debe recalcular automáticamente balance, CLV, Kelly completo (referencia), stake sugerido (½ Kelly) y drawdown.
- RF-7: El sistema debe conservar los cambios tras recargar la aplicación.
- RF-8: Cuando una apuesta cambie de estado (p. ej. finalizada → pendiente), el sistema debe moverla a la lista que corresponda (día / histórico).

## Requisitos no funcionales
- RNF-1: Toda la operativa debe mantenerse en español y con hora local.
- RNF-2: Ningún cambio debe alterar el umbral value > 1.05 ni las fórmulas de Kelly, CLV y EV.
- RNF-3: La banca, único dato privado, no debe salir del dispositivo.

## Casos límite
- Editar una apuesta con la cuota de cierre vacía: el CLV queda sin calcular, como hoy.
- Eliminar la única apuesta finalizada: balance a cero, banca igual a la inicial.
- Cambiar una finalizada a pendiente: sale del histórico y del balance hasta resolverse.
- Datos corruptos o apuesta inexistente: la operación se rechaza sin romper el resto.
- La UI actual muestra Kelly completo como sugerido, lo que contradice AGENTS/MEMORY; alinearlo será tarea aparte, fuera de esta spec.

## Fuera de alcance
- Registro de cambios o auditoría. Deshacer tras borrar. Edición masiva. Búsqueda o filtros del histórico.

## Criterios de finalización
- RF-1–RF-8 verificados con pruebas sin instalar dependencias. Sin funcionalidades añadidas. Documentación afectada actualizada.

## Dudas abiertas
- Ninguna. Resueltas: el nombre es Betting-Dashboard; el stake sugerido usa ½ Kelly con Kelly completo como referencia, según AGENTS §6 y MEMORY §5.
