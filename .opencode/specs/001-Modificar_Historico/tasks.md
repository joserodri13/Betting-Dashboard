# Tasks 001-Modificar_Historico

- [ ] **T1** Lógica de ubicación: `fechaLocal`, `esDelDia`, `ubicar` (RF-9).
Hecho cuando: finalizada→histórico, fecha de hoy no-finalizada→día, pendiente de ayer→oculta.
- [ ] **T2** `validarApuesta` V1–V6 (RF-5).
Hecho cuando: cada V rechaza su ejemplo inválido y acepta el válido.
- [ ] **T3** `aplicarEdicion` y `eliminarApuesta` puras, sin mutar (RF-1, RF-3, RF-6, E1/E2).
Hecho cuando: edición válida sustituye, inválida devuelve E1, id inexistente E2, borrado devuelve balance nuevo antes de borrar.
- [ ] **T4** `recalcular` con sugerido = banca×f×0.5 (RF-7).
Hecho cuando: ejemplo con banca 500 y apuesta conocida da el balance exacto esperado.
- [ ] **T5** Botones Editar/Eliminar solo en tarjetas del histórico (RF-1).
Hecho cuando: finalizadas los muestran, pendientes/en juego no.
- [ ] **T6** Modal de edición con los mismos campos del registro + E1 inline en español (RF-1, RF-5, RF-6).
Hecho cuando: guardar inválido bloquea con mensaje, válido actualiza la tarjeta.
- [ ] **T7** Modal Sí/No de borrado (RF-2, RF-3, RF-4).
Hecho cuando: sin Sí nada se borra, con No todo intacto, con Sí recalcula y borra.
- [ ] **T8** Stake ½ Kelly + Kelly completo como referencia en tarjetas y previsión (RF-7).
Hecho cuando: los números coinciden con T4 para la misma apuesta.
- [ ] **T9** Re-render tras operaciones + movimientos por estado + persistencia (RF-7, RF-8, RF-9).
Hecho cuando: editar, recargar, el cambio persiste; finalizada→pendiente sale del histórico.
- [ ] **T10** Verificación final RF por RF de la spec + `node --check` + divs + página 200.
Hecho cuando: checklist de la spec completo sin fallos.
