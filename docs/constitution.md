# Constitución Betting-Dashboard
1. Un solo `index.html` vainilla, sin dependencias ni build; verificable con `git ls-files` sin `package.json`.
2. Nada se codea sin tu aprobación previa; cada cambio traza a AGENTS/MEMORY; prohibido añadir lo no pedido.
3. Cálculos deterministas separados del DOM; el LLM jamás decide probabilidades.
4. Cada cambio se verifica sin instalar nada: `node --check`, estructura equilibrada y página 200 local.
5. La banca (único dato privado hoy) nunca sale del `localStorage`; futuras fuentes externas serán solo de lectura, aprobadas y sin enviar datos privados; la lista de datos privados vive en MEMORY.
6. Interfaz en español salvo excepciones aprobadas y registradas; sin traducir nombres internos del código.
