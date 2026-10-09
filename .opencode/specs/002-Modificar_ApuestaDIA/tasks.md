# Tasks 002-Modificar_ApuestaDIA

- [ ] **T1** V7 en `validarApuesta(datos, banca)` + mensaje en español (RF-5).
Hecho cuando: stake mayor que la banca devuelve V7; stake igual la acepta.
- [ ] **T2** `ubicar` con no-cerradas antiguas al histórico + render con la clasificación (RF-9).
Hecho cuando: pendiente de ayer aparece en el histórico, pendiente de hoy en el día.
- [ ] **T3** Botones Editar/Eliminar en el día (no finalizadas); histórico igual que 001; antiguas solo Comprobar (RF-1, RF-9).
Hecho cuando: cada lista muestra exactamente sus botones y ningún otro.
- [ ] **T4** Modal compartido con estado/fecha deshabilitados desde el día; el guardado los preserva (RF-1, RF-6).
Hecho cuando: campos visibles no editables y guardar no los altera.
- [ ] **T5** Borrado del día con el Sí/No existente + balance intacto (RF-2, RF-3, RF-4).
Hecho cuando: sin Sí nada se borra; con Sí desaparece y el balance no cambia.
- [ ] **T6** Registro también rechaza stake > banca (RF-5, V7).
Hecho cuando: registrar con stake excesivo bloquea con mensaje en español.
- [ ] **T7** Aviso fijo en Información + repintado total tras operar (RF-7, RF-9).
Hecho cuando: texto presente y todos los valores afectados actualizados.
- [ ] **T8** Verificación final RF por RF + suite `tests/002-apuestadia.js` + `node --check` + divs + página 200.
Hecho cuando: checklist de la spec completo sin fallos.
