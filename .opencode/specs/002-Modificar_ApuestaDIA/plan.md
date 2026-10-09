# Plan 002-Modificar_ApuestaDIA

## 1. Archivos y responsabilidad (RF que cubre cada uno)
- `index.html` (modifica): V7 en validación y registro, `ubicar` con no-cerradas al histórico, modal compartido con bloqueo, botones en el día, aviso en información. Cubre RF-1–RF-9.
- `plan.md` (este archivo): plan aprobado. `tasks.md` en fase siguiente, no aquí.
- `docs/registro/002-*.md` (al cerrar): registro post-implementación.
- AGENTS/MEMORY: sin cambios (V7 ya registrada en §8).

## 2. Funciones puras (`hoy` como parámetro, sin fecha ni DOM dentro)
- `validarApuesta(datos, banca)`: añade V7 (stake ≤ banca actual). Llamada desde registro y edición. (RF-5)
- `ubicar(b, hoy)`: finalizada→histórico; fecha de hoy→día; no cerrada antigua→histórico. (RF-9)
- `aplicarEdicion` / `eliminarApuesta` / `recalcular`: se reutilizan sin cambios; el llamante restringe los campos del día (sin estado ni fecha). (RF-1, RF-3, RF-7)
- Regla de botones: día (pendiente/en juego) → Editar+Eliminar (más Comprobar existentes); histórico finalizadas → Editar+Eliminar (001); antiguas no cerradas en histórico → solo Comprobar. (RF-1, RF-9)

## 3. Algoritmo del mapa (pseudocódigo)
```
ubicar(b, hoy):
  si estado == 'finalizada': 'historico'
  si fecha_local(fecha) == hoy: 'dia'
  'historico'   # no cerrada antigua: espera cierre del usuario
render:
  dia = no-finalizadas de hoy; historico = resto ordenado por fecha marcada desc
```

## 4. Interfaz
- Tarjetas del día no finalizadas: Editar y Eliminar (más Comprobar actuales); finalizadas de hoy en el día: sin botones. (RF-1, RF-9)
- Mismo modal de la 001: al abrir desde el día, estado y fecha visibles pero deshabilitados. (RF-1)
- Registro también rechaza stake > banca con mensaje en español. (V7, RF-5)
- Texto fijo en el apartado de información: las finalizadas se editan en el histórico. (RF-9)

## 5. Decisiones (y descartada)
- D1 Reutilizar modal y funciones de la 001 (validación idéntica). Descartado: duplicar.
- D2 No-cerradas antiguas al histórico (vs lista nueva: UI extra no pedida).
- D3 V7 dentro de `validarApuesta` con banca como parámetro (fuente única).
- D4 V7 también al registrar (validaciones "las mismas"; si no, inconsistencia).
- D5 Antiguas no cerradas sin Editar/Eliminar, solo Comprobar (aprobado).

## 6. Tests (const. 4, sin instalar nada)
- Nueva suite `tests/002-apuestadia.js` con el mismo harness: V7 con banca, ubicar antigua→histórico, botones por lista, campos deshabilitados, aviso presente, borrado del día con balance intacto, ejemplo exacto + recarga. `node --check`, divs, 200.
