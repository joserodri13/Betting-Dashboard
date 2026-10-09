# Plan 001-Modificar_Historico

## 1. Archivos y responsabilidad (RF que cubre cada uno)
- `index.html` (modifica): única app (const. 1). Lógica pura nueva + botones editar/eliminar + diálogo Sí/No + stake ½ Kelly. Cubre RF-1–RF-9.
- `plan.md` (este archivo): plan aprobado. `tasks.md` se actualiza en fase siguiente, no aquí.
- `docs/registro/001-modificar-historico.md` (al cerrar): registro post-implementación.
- AGENTS/MEMORY: sin cambios (validaciones ya en §8).

## 2. Funciones puras (`hoy` como parámetro, sin fecha ni DOM dentro)
- `fechaLocal(iso)` → día local. `esDelDia(apuesta, hoy)`. `ubicar(apuesta, hoy)` → historico/día/oculta. (RF-9)
- `validarApuesta(datos)` → lista de V1–V5. (RF-5)
- `aplicarEdicion(apuestas, id, cambios)` → lista nueva o error E1/E2, sin mutar. (RF-1, RF-6)
- `eliminarApuesta(apuestas, id)` → calcula balance nuevo antes de borrar; E2 si no existe. (RF-3)
- `recalcular(apuestas, bancaInicial)` → balance, CLV, Kelly, sugerido = banca×f×0.5, drawdown; reutiliza fórmulas sin cambiarlas. (RF-7, RNF-2)

## 3. Algoritmo del mapa (pseudocódigo)
```
ubicar(apuesta, hoy):
  si estado == 'finalizada': 'historico'      # ordenado por fecha marcada desc
  si fecha_local(fecha) == hoy: 'dia'
  'oculta'   # pendiente/en juego de otro día: se conserva, no se muestra (igual que hoy)
tras editar/eliminar: recalcular → persistir → render   # RF-3, RF-7, RF-8, RF-9
```

## 4. Interfaz
- Tarjeta del histórico: botones Editar y Eliminar; día/en juego: sin botones. (RF-1, fuera de alcance)
- Editar: modal con los mismos campos del registro; E1 inline en español. (RF-5, RF-6, RNF-1)
- Eliminar: modal Sí/No; No intacta; Sí recalcula y borra. (RF-2, RF-3, RF-4)
- Stake en tarjetas y previsión: sugerido ½ Kelly + Kelly completo como referencia. (RF-7, RNF-2)

## 5. Decisiones (y descartada)
- D1 Campos del registro reutilizados en edición (V idénticas). Descartado: formulario separado (duplica validación).
- D2 Modal Sí/No propio en vez de `confirm()` nativo (idioma del navegador, rompe RNF-1).
- D3 `hoy` inyectado en vez de leer fecha dentro (determinismo testeable).
- D4 Alineamiento ½ Kelly absorbido aquí en vez de tarea aparte (RF-7 verificable ya; lo mandan AGENTS §6 y MEMORY §5).
- D5 Sin auditoría (pedido explícito).

## 6. Tests (const. 4, sin instalar nada)
- `node --check`, equilibrio de divs, página 200. Protocolo manual RF por RF de la spec (balance exacto + recarga para RF-8). Sin framework: lo prohíbe la constitución; las funciones puras dejan puerta abierta a unitario futuro.
