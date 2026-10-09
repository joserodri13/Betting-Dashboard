# Tasks 002-Modificar_ApuestaDIA

- [x] **T1** V7 en `validarApuesta(datos, banca)` + mensaje en español (RF-5).
Hecho cuando: stake mayor que la banca devuelve V7; stake igual la acepta.
- [x] **T2** `ubicar` con no-cerradas antiguas al histórico + render con la clasificación (RF-9).
Hecho cuando: pendiente de ayer aparece en el histórico, pendiente de hoy en el día.
- [x] **T3** Botones Editar/Eliminar en el día (no finalizadas); histórico igual que 001; antiguas solo Comprobar (RF-1, RF-9).
Hecho cuando: cada lista muestra exactamente sus botones y ningún otro.
- [x] **T4** Modal compartido con estado/fecha deshabilitados desde el día; el guardado los preserva (RF-1, RF-6).
Hecho cuando: campos visibles no editables y guardar no los altera.
- [x] **T5** Borrado del día con el Sí/No existente + balance intacto (RF-2, RF-3, RF-4).
Hecho cuando: sin Sí nada se borra; con Sí desaparece y el balance no cambia.
- [x] **T6** Registro también rechaza stake > banca (RF-5, V7).
Hecho cuando: registrar con stake excesivo bloquea con mensaje en español.
- [x] **T7** Aviso fijo en Información + repintado total tras operar (RF-7, RF-9).
Hecho cuando: texto presente y todos los valores afectados actualizados.
- [x] **T8** Verificación final RF por RF + suite `tests/002-apuestadia.js` + `node --check` + divs + página 200.
Hecho cuando: checklist de la spec completo sin fallos.

## Cobertura RF
- RF-1: T3, T4. RF-2: T5. RF-3: T5. RF-4: T5.
- RF-5: T1, T6. RF-6: T4. RF-7: T7. RF-8: suite (roundtrip). RF-9: T2, T3, T7.
- Verificación T8: 002 con 21 assertions OK, 001 con 45 assertions OK, `node --check` OK, divs 60/60, página 200.
