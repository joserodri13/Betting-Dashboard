# Spec: Modificar el histórico (editar y eliminar apuestas)

## Contexto y objetivo
Proyecto Betting-Dashboard: el usuario registra apuestas manualmente y puede equivocarse (cuota, stake, resultado...). Hoy un error en una apuesta finalizada solo se compensa con registros nuevos, lo que corrompe el histórico, el balance y el CLV. Objetivo: corregir o eliminar apuestas del histórico para que refleje la realidad. De momento solo el histórico es editable; pendientes y en juego no se editan ni se borran.

## Usuarios
- Usuario único: el apostante que registra y analiza sus propias apuestas.

## Historias de usuario
- HU-1: Como apostante que se equivocó en la cuota de una apuesta finalizada, quiero editarla para que el balance y el CLV queden correctos.
- HU-2: Como apostante que registró una apuesta duplicada en el histórico, quiero eliminarla (con confirmación) para que no distorsione el análisis.

## Requisitos funcionales
- RF-1: Cuando el usuario edite una apuesta finalizada del histórico, el sistema debe permitir modificar todos sus datos, incluida la fecha.
- RF-2: Cuando el usuario solicite eliminar una apuesta del histórico, el sistema debe pedir confirmación con botones Sí y No.
- RF-3: Si el usuario confirma con Sí, el sistema debe calcular primero el nuevo balance y después borrar la apuesta de forma permanente y sin rastro.
- RF-4: Si el usuario cancela con No, la apuesta debe quedar intacta.
- RF-5: El sistema debe aplicar al editar las validaciones V1–V6 de AGENTS §8 (partido obligatorio, cuota > 1, probabilidad 1–99, stake ≥ 1, resultado obligatorio si finalizada, cierre opcional).
- RF-6: Si los datos editados incumplen una validación, el sistema debe rechazar el guardado e indicar el error en español.
- RF-7: Cuando se guarde una edición o se complete un borrado, el sistema debe recalcular automáticamente balance, CLV, Kelly completo (referencia), stake sugerido (½ Kelly) y drawdown, en todas las vistas donde aparezca el stake.
- RF-8: El sistema debe conservar los cambios tras recargar la aplicación.
- RF-9: Cuando una apuesta editada cambie de estado y deje de ser finalizada, el sistema debe sacarla del histórico; apuesta del día significa fecha de hoy y el histórico ordena por la fecha marcada por el usuario.

## Requisitos no funcionales
- RNF-1: Toda la operativa debe mantenerse en español y con hora local.
- RNF-2: Ningún cambio debe alterar las fórmulas de Kelly, CLV y EV ni el umbral value > 1.05; el stake operativo sigue la política vigente (½ Kelly sugerido, Kelly completo como referencia).
- RNF-3: La banca, único dato privado, no debe salir del dispositivo.

## Errores (catálogo)
- E1 validación (V1–V5): mensaje en español indicando el campo, sin guardar ni romper el resto.
- E2 apuesta inexistente o datos corruptos: operación rechazada, resto intacto, aviso en español.
- E3 fallo de guardado: aviso en español y apuesta sin modificar.

## Casos límite
- Editar con la cuota de cierre vacía: el CLV queda sin calcular, como hoy.
- Eliminar la única apuesta finalizada: balance a cero, banca igual a la inicial.
- Cambiar una finalizada a pendiente: sale del histórico y del balance hasta resolverse.
- Stake cero o negativo al editar: se rechaza como al registrar.
- Desde la spec 002: la pendiente o en juego de otro día aparece en el histórico a la espera de cierre.
- Desde el refinamiento de listas: cada apuesta vive en una sola lista (día solo no-finalizadas de hoy).

## Fuera de alcance
- Registro de cambios o auditoría. Deshacer tras borrar. Edición masiva. Búsqueda o filtros. Editar o borrar pendientes y en juego.

## Verificación por requisito
- RF-1: editar cada campo de una finalizada y comprobar el cambio. RF-2/RF-4: sin pulsar Sí no se borra nada; con No todo intacto. RF-3: tras borrar, la apuesta no existe y el balance es el recalculado. RF-5/RF-6: cada validación V1–V5 rechazada con mensaje en español. RF-7: ejemplo con balance esperado exacto. RF-8: editar, recargar, el cambio persiste. Todo sin instalar dependencias.

## Criterios de finalización
- RF-1–RF-9 verificados según lo anterior. Sin funcionalidades añadidas. Documentación afectada actualizada.

## Dudas abiertas
- Ninguna.
