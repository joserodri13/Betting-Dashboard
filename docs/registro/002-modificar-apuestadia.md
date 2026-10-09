# Registro 002-Modificar_ApuestaDIA
Objetivo: editar y eliminar apuestas del día (pendientes/en juego) sin tocar estado ni fecha; cada apuesta en una sola lista.
Cambios: V7 (stake ≤ banca) en validación y registro; no-cerradas antiguas al histórico; botones Editar/Eliminar en el día; modal compartido con estado/fecha deshabilitados; borrado con Sí/No sin tocar balance; aviso fijo en Información; finalizada solo en histórico.
Decisiones: reutilizar modal y funciones de la 001 (descartado duplicar); no-cerradas al histórico (descartada lista nueva: UI extra no pedida); V7 con banca como parámetro y también al registrar (consistencia); antiguas solo Comprobar (aprobado); listas únicas (evita duplicados día/histórico).
Archivos: index.html, tests/002-apuestadia.js, .opencode/specs/002-Modificar_ApuestaDIA/spec.md (RF-9), .opencode/specs/001-Modificar_Historico/spec.md (línea listas únicas), MEMORY.
Verificación: 23 assertions OK (002), 45 OK (001), node --check OK, divs 60/60, página 200.
Pendientes: E3 sin test automático (heredado de 001); nada más abierto.
