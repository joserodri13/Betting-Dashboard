# Registro 001-Modificar_Historico
Objetivo: corregir o eliminar apuestas finalizadas para que el histórico refleje la realidad.
Cambios: botones Editar/Eliminar en el histórico; modales de edición (mismos campos) y Sí/No; validaciones V1–V6; recálculo automático; stake ½ Kelly + referencia.
Decisiones: alcance solo histórico (delegado); ½ Kelly absorbido aquí por mandar AGENTS §6 (descartada tarea aparte); modal propio en vez de confirm() nativo (RNF-1); funciones puras con hoy inyectado.
Archivos: index.html, tests/001-historico.js, AGENTS §8 (V1–V6), README, tasks.md.
Verificación: 44 assertions OK, node --check OK, divs 59/59, página 200.
Pendientes: E3 sin test automático (solo revisión); alinear resto de textos si aparece Kelly completo.
Corrección post-cierre: los modales de editar/eliminar no tenían estilo de ventana (solo #modal lo tenía); CSS extendido a los tres.
