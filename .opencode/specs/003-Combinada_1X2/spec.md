# Spec: 003-Combinada_1X2 (combinadas + mercado solo 1X2)

## Contexto y objetivo
La app solo registra apuestas simples y acepta cualquier mercado en texto libre. Objetivo: registrar combinadas de 1 a 20 selecciones 1X2 (cuota y probabilidad totales por producto) y limitar toda la app al mercado 1X2, eliminando automáticamente lo existente de otros mercados.

## Usuarios
- Usuario único: el apostante que registra y analiza sus propias apuestas.

## Historias de usuario
- HU-1: Como apostante que juega combinadas, quiero registrarlas con sus selecciones para seguirlas como una sola apuesta.
- HU-2: Como apostante de 1X2, quiero que la app solo admita ese mercado para no mezclar métricas.

## Requisitos funcionales
- RF-1: Cuando el usuario registre una combinada de 1 a 20 selecciones 1X2, el sistema debe pedir por selección partido, pronóstico (1/X/2), cuota y probabilidad propia.
- RF-2: El sistema debe calcular cuota_total y p_total como producto de las selecciones (suponiendo legs independientes); 1 selección equivale a simple.
- RF-3: Cada selección registra su resultado; el estado total es ganada si todas aciertan, perdida si falla una (aunque queden pendientes) y pendiente si hay aciertos sin fallos y faltan por cerrar.
- RF-4: El sistema debe marcar value si p_total × cuota_total > 1.05 y calcular EV = p_total × cuota_total − 1.
- RF-5: El stake sugerido es ¼ Kelly sobre totales con tope 1% de banca; Kelly completo como referencia; si f* ≤ 0, 0 €.
- RF-6: El sistema debe calcular CLV = (producto tomadas / producto cierres − 1) × 100; si falta un cierre, sin CLV; CLV por pierna solo informativo.
- RF-7: La app solo admite el mercado 1X2 en nuevos registros; las apuestas existentes de otros mercados se borran automáticamente una vez, recalculando el balance.
- RF-8: El sistema debe validar 1–20 selecciones; por selección partido, cuota > 1 y probabilidad 1–99; sin repetir partido en la misma combinada (V8); V7 sobre el stake total; mensajes en español.

## Requisitos no funcionales
- RNF-1: Toda la operativa debe mantenerse en español y con hora local.
- RNF-2: Ningún cambio debe alterar las fórmulas de Kelly, CLV y EV ni el umbral value > 1.05.
- RNF-3: La banca, único dato privado, no debe salir del dispositivo.

## Casos límite
- 0 o más de 20 selecciones: rechazado. 1 selección: como simple. Partido repetido: rechazado (V8). Cierre ausente: sin CLV. f* ≤ 0: 0 €. Borrado masivo inicial con balance recalculado.

## Fuera de alcance
- Editar o eliminar combinadas (v1: registrar, resolver, consultar). Auditoría, deshacer, masivo. Probabilidad conjunta para correlacionadas.

## Verificación por requisito
- RF-1: 0 y 21 rechazadas, 1 y 20 aceptadas. RF-2: ejemplo con producto exacto. RF-3: tabla todo-ganadas/perdida-con-pendientes/pendiente-sin-fallos. RF-4: ejemplo > 1.05 y <. RF-5: ejemplo ¼+cap exacto. RF-6: ejemplo numérico. RF-7: tras aplicar, cero mercados no-1X2 y balance recalculado. RF-8: cada validación rechazada en español. Todo sin instalar dependencias.

## Criterios de finalización
- RF-1–RF-8 verificados según lo anterior. Sin funcionalidades añadidas. Documentación afectada actualizada.

## Dudas abiertas
- Ninguna. V8 (sin repetir partido) aprobada por el usuario.
