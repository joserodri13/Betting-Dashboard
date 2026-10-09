# Spec: 002-Modificar_ApuestaDIA (editar y eliminar apuestas del día)

## Contexto y objetivo
La 001 cubrió el histórico; las apuestas pendientes y en juego del día también pueden registrarse con errores (cuota, stake...) y hoy no se pueden corregir ni borrar. Objetivo: editar y eliminar apuestas del día (pendientes y en juego) sin tocar su estado ni su fecha.

## Usuarios
- Usuario único: el apostante que registra y analiza sus propias apuestas.

## Historias de usuario
- HU-1: Como apostante que se equivocó en la cuota de una pendiente, quiero editarla para que el stake sugerido y el value queden correctos.
- HU-2: Como apostante que duplicó una apuesta del día, quiero eliminarla (con confirmación) para que no estorbe.

## Requisitos funcionales
- RF-1: Cuando el usuario edite una apuesta pendiente o en juego del día, el sistema debe permitir modificar partido, mercado, probabilidad, cuota, cierre y stake, con el mismo modal de la spec 001. Fecha y estado se muestran visibles pero deshabilitados.
- RF-2: Cuando el usuario solicite eliminar una apuesta del día, el sistema debe pedir confirmación con botones Sí y No.
- RF-3: Si confirma con Sí, el sistema debe borrarla de forma permanente y sin rastro; el balance no cambia al no ser finalizada.
- RF-4: Si cancela con No, la apuesta queda intacta.
- RF-5: El sistema debe aplicar V1–V4, V6 y V7 de AGENTS §8 (V5 no aplica: el estado no se toca y no hay resultado).
- RF-6: Si incumplen una validación, rechazar el guardado e indicar el error en español.
- RF-7: Al guardar o borrar, recalcular todos los valores afectados por el cambio y repintarlos automáticamente.
- RF-8: Conservar los cambios tras recargar.
- RF-9: Las finalizadas de hoy visibles en el día no muestran Editar/Eliminar; un texto fijo en el apartado de información avisa de que se editan en el histórico. La apuesta no cerrada que deja de ser del día pasa al histórico a la espera de que el usuario la cierre.

## Requisitos no funcionales
- RNF-1: Toda la operativa debe mantenerse en español y con hora local.
- RNF-2: Ningún cambio debe alterar las fórmulas de Kelly, CLV y EV ni el umbral value > 1.05; el stake operativo sigue la política vigente (½ Kelly sugerido, Kelly completo como referencia).
- RNF-3: La banca, único dato privado, no debe salir del dispositivo.

## Errores (catálogo)
- E1 validación (V1–V4, V6 y V7): mensaje en español indicando el campo, sin guardar ni romper el resto.
- E2 apuesta inexistente o datos corruptos: operación rechazada, resto intacto, aviso en español.
- E3 fallo de guardado: aviso en español y apuesta sin modificar.

## Casos límite
- Editar con la cuota de cierre vacía: el CLV queda sin calcular, como hoy.
- Stake cero o negativo al editar: se rechaza como al registrar.
- Stake mayor que la banca actual: se rechaza (V7).
- Borrar la única apuesta del día: la lista queda vacía sin errores.
- Cancelar el borrado: la apuesta queda intacta.
- Finalizada de hoy en el día: sin botones de editar/eliminar.
- Pendiente o en juego de otro día: aparece en el histórico a la espera de cierre, con sus botones Comprobar.

## Fuera de alcance
- Registro de cambios o auditoría. Deshacer tras borrar. Edición masiva. Búsqueda o filtros. Editar estado o fecha. Tocar el histórico (spec 001).

## Verificación por requisito
- RF-1: editar cada campo permitido y comprobar; fecha y estado visibles deshabilitados. RF-2/RF-4: sin pulsar Sí no se borra nada; con No todo intacto. RF-3: borrada desaparece del día, balance igual. RF-5/RF-6: cada validación V1–V4, V6 y V7 rechazada con mensaje en español. RF-7: todos los valores afectados actualizados. RF-8: editar, recargar, el cambio persiste. RF-9: finalizada de hoy en el día sin botones + aviso fijo en información; no cerrada de otro día en el histórico. Todo sin instalar dependencias.

## Criterios de finalización
- RF-1–RF-9 verificados según lo anterior. Sin funcionalidades añadidas. Documentación afectada actualizada.

## Dudas abiertas
- Ninguna.
