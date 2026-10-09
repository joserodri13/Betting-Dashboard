// Tests 001-Modificar_Historico. Node puro, sin dependencias.
// Carga las funciones de index.html y las prueba. RF cubiertos por bloque.
const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
const src = html.match(/<script>([\s\S]*)<\/script>/)[1];

// Stubs de navegador (hora local del equipo, igual que el navegador real).
const store = {};
const els = {};
const fakeEl = () => ({ value: '', textContent: '', innerHTML: '', style: {}, dataset: {},
  classList: { toggle() {}, add() {}, remove() {} },
  addEventListener() {}, onclick: null, getAttribute() { return null; } });
global.document = { getElementById: (id) => els[id] || (els[id] = fakeEl()), querySelectorAll: () => [] };
global.localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } };
global.alert = () => {};
global.prompt = () => null;

eval(src);

// Acceso del test al DOM stubeado (el const $ del script no sale del eval).
const $t = (id) => global.document.getElementById(id);

let n = 0;
const ok = (cond, msg) => { n++; assert.ok(cond, msg); console.log('  ok ' + n + ' - ' + msg); };

// ---- T1: ubicación día/histórico (RF-9) ----
console.log('T1 ubicar (RF-9)');
ok(fechaLocal('2026-10-09T12:00') === '2026-10-09', 'fechaLocal extrae día local');
ok(esDelDia({ fecha: '2026-10-09T12:00' }, '2026-10-09') === true, 'misma fecha es del día');
ok(esDelDia({ fecha: '2026-10-08T12:00' }, '2026-10-09') === false, 'otra fecha no es del día');
ok(ubicar({ estado: 'finalizada', fecha: '2026-10-01T12:00' }, '2026-10-09') === 'historico', 'finalizada va al histórico');
ok(ubicar({ estado: 'pendiente', fecha: '2026-10-09T12:00' }, '2026-10-09') === 'dia', 'pendiente de hoy va al día');
ok(ubicar({ estado: 'pendiente', fecha: '2026-10-08T12:00' }, '2026-10-09') === 'historico', 'pendiente de otro día va al histórico (regla 002)');

// ---- T2: validarApuesta V1-V6 (RF-5) ----
console.log('T2 validar (RF-5)');
const baseVal = { partido: 'A - B', cuota: 2, prob: 0.55, stake: 10, estado: 'pendiente', resultado: null, cierre: 0 };
ok(validarApuesta(baseVal).length === 0, 'apuesta válida no devuelve fallos');
ok(validarApuesta({ ...baseVal, partido: '  ' }).includes('V1'), 'V1 partido vacío');
ok(validarApuesta({ ...baseVal, cuota: 1 }).includes('V2'), 'V2 cuota no mayor que 1');
ok(validarApuesta({ ...baseVal, prob: 0 }).includes('V3'), 'V3 prob 0 fuera de rango');
ok(validarApuesta({ ...baseVal, prob: 1 }).includes('V3'), 'V3 prob 1 fuera de rango');
ok(validarApuesta({ ...baseVal, stake: 0 }).includes('V4'), 'V4 stake menor que 1');
ok(validarApuesta({ ...baseVal, estado: 'finalizada', resultado: null }).includes('V5'), 'V5 finalizada sin resultado');
ok(validarApuesta({ ...baseVal, estado: 'finalizada', resultado: 'ganada' }).length === 0, 'V5 finalizada con resultado ok');
ok(validarApuesta({ ...baseVal, cierre: 0 }).length === 0, 'V6 cierre vacío permitido');

// ---- T3: aplicarEdicion y eliminarApuesta (RF-1, RF-3, RF-6, E1/E2) ----
console.log('T3 edición y borrado puros');
const b1 = { id: 1, partido: 'A - B', cuota: 2, prob: 0.5, stake: 10, estado: 'finalizada', resultado: 'perdida', cierre: 0, fecha: '2026-10-09T12:00' };
const b2 = { id: 2, partido: 'C - D', cuota: 2, prob: 0.5, stake: 10, estado: 'finalizada', resultado: 'ganada', cierre: 0, fecha: '2026-10-09T12:00' };
const r1 = aplicarEdicion([b1, b2], 1, { cuota: 3 });
ok(r1.ok === true && r1.apuestas[0].cuota === 3 && r1.apuestas[1].cuota === 2, 'edición válida sustituye solo esa apuesta');
ok(b1.cuota === 2, 'no muta la lista original');
const r2 = aplicarEdicion([b1], 1, { cuota: 1 });
ok(r2.ok === false && r2.error === 'E1' && r2.fallos.includes('V2'), 'edición inválida devuelve E1 con V2');
const r3 = aplicarEdicion([b1], 99, { cuota: 3 });
ok(r3.ok === false && r3.error === 'E2', 'id inexistente devuelve E2');
ok(ganancia(b2) === 10 && ganancia(b1) === -10, 'ganancia por apuesta exacta');
const r4 = eliminarApuesta([b1, b2], 2, 500);
ok(r4.ok === true && r4.apuestas.length === 1 && r4.bal === -10, 'borrado devuelve resto y balance nuevo antes de borrar');
const r5 = eliminarApuesta([b1], 99, 500);
ok(r5.ok === false && r5.error === 'E2', 'borrar inexistente devuelve E2');

// ---- T4: recalcular puro + stats delega (RF-7) ----
console.log('T4 recalcular (RF-7)');
const g1 = { id: 1, cuota: 2, stake: 10, estado: 'finalizada', resultado: 'ganada', fecha: '2026-10-08T12:00' };
const p1 = { id: 2, cuota: 3, stake: 10, estado: 'finalizada', resultado: 'perdida', fecha: '2026-10-09T12:00' };
const rc = recalcular([g1, p1], 500);
ok(rc.bal === 0 && rc.banca === 500 && rc.yld === 0 && rc.dd === 10, 'balance 0, banca 500, yield 0, drawdown 10 exactos');
const rc2 = recalcular([g1], 500);
ok(rc2.bal === 10 && rc2.banca === 510 && rc2.dd === 0, 'una ganada sin drawdown');
store['apuestas_bets'] = JSON.stringify([g1, p1]); store['apuestas_bankroll'] = '500';
const st = stats();
ok(st.bal === 0 && st.banca === 500 && st.dd === 10, 'stats delega y mantiene resultado');
store['apuestas_bets'] = JSON.stringify([]); delete store['apuestas_bankroll'];

// ---- T5: botones solo en histórico (RF-1) ----
console.log('T5 botones histórico (RF-1)');
const hf = { id: 7, partido: 'X - Y', deporte: 'futbol', mercado: '1X2', prob: 0.6, cuota: 2, cierre: 0, stake: 10, estado: 'finalizada', resultado: 'ganada', fecha: '2026-10-09T12:00' };
const hp = { ...hf, id: 8, estado: 'pendiente', resultado: null };
ok(betHtml(hf, 'hist').includes('data-edit="7"') && betHtml(hf, 'hist').includes('data-del="7"'), 'finalizada editable muestra Editar y Eliminar');
ok(!betHtml(hf).includes('data-edit'), 'finalizada no editable no muestra Editar');
ok(!betHtml(hp, 'hist').includes('data-edit'), 'pendiente no muestra Editar aunque editable');

// ---- T6: modal de edición (RF-1, RF-5, RF-6) ----
console.log('T6 modal edición');
store['apuestas_bets'] = JSON.stringify([{ id: 9, partido: 'A - B', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'finalizada', resultado: 'perdida', fecha: '2026-10-09T12:00' }]);
abrirEdicion('9');
ok($t('ePartido').value === 'A - B', 'abre y rellena los campos');
$t('eCuota').value = '1'; guardarEdicion();
ok($t('eError').textContent.toLowerCase().includes('cuota'), 'E1 inline en español');
ok(JSON.parse(store['apuestas_bets'])[0].cuota === 2, 'inválido no guarda');
$t('eCuota').value = '3'; guardarEdicion();
ok(JSON.parse(store['apuestas_bets'])[0].cuota === 3, 'válido actualiza la tarjeta');
abrirEdicion('99');
ok(ultimoAviso().includes('no encontrada'), 'E2 avisa en español');

// ---- T7: modal Sí/No de borrado (RF-2, RF-3, RF-4) ----
console.log('T7 modal borrado');
store['apuestas_bets'] = JSON.stringify([
  { id: 11, partido: 'A - B', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'finalizada', resultado: 'perdida', fecha: '2026-10-09T12:00' },
  { id: 12, partido: 'C - D', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'finalizada', resultado: 'ganada', fecha: '2026-10-09T12:00' }]);
store['apuestas_bankroll'] = '500';
pedirBorrado('11');
ok($t('delTexto').textContent.includes('A - B'), 'pide confirmación identificando la apuesta');
cancelarBorrado();
ok(JSON.parse(store['apuestas_bets']).length === 2, 'No deja intacta');
pedirBorrado('11'); confirmarBorrado();
const rest = JSON.parse(store['apuestas_bets']);
ok(rest.length === 1 && rest[0].id === 12, 'Sí borra solo esa apuesta');
ok(stats().bal === 10, 'balance recalculado tras borrar');
pedirBorrado('99');
ok(ultimoAviso().includes('no encontrada'), 'E2 avisa en español');
store['apuestas_bets'] = JSON.stringify([]); delete store['apuestas_bankroll'];

// ---- T8: stake ½ Kelly + referencia (RF-7) ----
console.log('T8 medio Kelly (RF-7)');
store['apuestas_bets'] = JSON.stringify([]);
store['apuestas_bankroll'] = '500';
const hk = { id: 20, partido: 'X - Y', deporte: 'futbol', mercado: '1X2', prob: 0.6, cuota: 2, cierre: 0, stake: 10, estado: 'finalizada', resultado: 'ganada', fecha: '2026-10-09T12:00' };
const hkh = betHtml(hk, 'hist');
ok(hkh.includes('50.00') && hkh.includes('100.00') && hkh.includes('Kelly'), 'tarjeta muestra sugerido 50 y referencia 100');
$t('fProb').value = '60'; $t('fCuota').value = '2'; preview();
ok($t('preview').innerHTML.includes('50.00') && $t('preview').innerHTML.includes('100.00'), 'previsión muestra ½ Kelly y referencia');
delete store['apuestas_bankroll'];

// ---- T9: re-render, movimientos y persistencia (RF-7, RF-8, RF-9) ----
console.log('T9 render y persistencia');
store['apuestas_bets'] = JSON.stringify([
  { id: 31, partido: 'Ayer Fin', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'finalizada', resultado: 'ganada', fecha: '2026-10-08T12:00' },
  { id: 32, partido: 'Hoy Pend', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'pendiente', resultado: null, fecha: hoyLocal() + 'T12:00' },
  { id: 33, partido: 'Ayer Pend', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'pendiente', resultado: null, fecha: '2026-10-08T12:00' }]);
store['apuestas_bankroll'] = '500';
render();
ok($t('listaHoy').innerHTML.includes('Hoy Pend') && !$t('listaHoy').innerHTML.includes('Ayer Pend'), 'día muestra solo pendientes de hoy');
ok($t('listaHist').innerHTML.includes('Ayer Fin') && $t('listaHist').innerHTML.includes('Ayer Pend') && !$t('listaHist').innerHTML.includes('Hoy Pend'), 'histórico con finalizadas y antiguas pendientes (regla 002)');
const all = getBets(); const mv = aplicarEdicion(all, 31, { estado: 'pendiente', resultado: null });
saveBets(mv.apuestas); render();
ok($t('listaHist').innerHTML.includes('Ayer Fin'), 'finalizada antigua→pendiente queda en histórico a la espera de cierre');
ok(stats().bal === 0, 'al salir del balance este vuelve a cero');
saveBets(getBets());
ok(JSON.stringify(getBets()) === store['apuestas_bets'], 'RF-8 persiste tras recargar');
store['apuestas_bets'] = JSON.stringify([]); delete store['apuestas_bankroll'];

console.log('TOTAL ' + n + ' assertions OK');
