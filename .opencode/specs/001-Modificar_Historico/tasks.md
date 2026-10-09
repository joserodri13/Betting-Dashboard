# Tasks 001-Modificar_Historico

- [x] **T1** Lógica de ubicación: `fechaLocal`, `esDelDia`, `ubicar` (RF-9).
Hecho cuando: finalizada→histórico, fecha de hoy no-finalizada→día, pendiente de ayer→oculta.
- [x] **T2** `validarApuesta` V1–V6 (RF-5).
Hecho cuando: cada V rechaza su ejemplo inválido y acepta el válido.
- [x] **T3** `aplicarEdicion` y `eliminarApuesta` puras, sin mutar (RF-1, RF-3, RF-6, E1/E2).
Hecho cuando: edición válida sustituye, inválida devuelve E1, id inexistente E2, borrado devuelve balance nuevo antes de borrar.
- [x] **T4** `recalcular` con sugerido = banca×f×0.5 (RF-7). `stats()` delega con la misma matemática.
Hecho cuando: ejemplo con banca 500 y apuesta conocida da el balance exacto esperado.
- [x] **T5** Botones Editar/Eliminar solo en tarjetas del histórico (RF-1).
Hecho cuando: finalizadas los muestran, pendientes/en juego no.
- [x] **T6** Modal de edición con los mismos campos del registro + E1 inline en español (RF-1, RF-5, RF-6).
Hecho cuando: guardar inválido bloquea con mensaje, válido actualiza la tarjeta.
- [x] **T7** Modal Sí/No de borrado (RF-2, RF-3, RF-4).
Hecho cuando: sin Sí nada se borra, con No todo intacto, con Sí recalcula y borra.
- [x] **T8** Stake ½ Kelly + Kelly completo como referencia en tarjetas y previsión (RF-7). Glosario actualizado.
Hecho cuando: los números coinciden con T4 para la misma apuesta.
- [x] **T9** Re-render tras operaciones + movimientos por estado + persistencia (RF-7, RF-8, RF-9).
Hecho cuando: editar, recargar, el cambio persiste; finalizada→pendiente sale del histórico.
- [x] **T10** Verificación final RF por RF de la spec + `node --check` + divs + página 200.
Hecho cuando: checklist de la spec completo sin fallos.

## Cobertura RF
- RF-1: T3, T5, T6. RF-2: T7. RF-3: T3, T7. RF-4: T7.
- RF-5: T2, T6. RF-6: T3, T6. RF-7: T4, T8, T9. RF-8: T9. RF-9: T1, T9.
- Verificación T10: 44 assertions OK (`tests/001-historico.js`), `node --check` OK, divs 59/59, página 200.
