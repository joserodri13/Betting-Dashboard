// Tests 002-Modificar_ApuestaDIA. Node puro, sin dependencias.
const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
const src = html.match(/<script>([\s\S]*)<\/script>/)[1];

const store = {};
const els = {};
const fakeEl = () => ({ value: '', textContent: '', innerHTML: '', style: {}, dataset: {}, disabled: false,
  classList: { toggle() {}, add() {}, remove() {} },
  addEventListener() {}, onclick: null, getAttribute() { return null; } });
global.document = { getElementById: (id) => els[id] || (els[id] = fakeEl()), querySelectorAll: () => [] };
global.localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } };
global.alert = () => {};
global.prompt = () => null;

eval(src);

const $t = (id) => global.document.getElementById(id);
let n = 0;
const ok = (cond, msg) => { n++; assert.ok(cond, msg); console.log('  ok ' + n + ' - ' + msg); };

// ---- T1: V7 stake ≤ banca (RF-5) ----
console.log('T1 V7 (RF-5)');
const baseD = { partido: 'A - B', cuota: 2, prob: 0.55, stake: 10, estado: 'pendiente', resultado: null, cierre: 0 };
ok(validarApuesta({ ...baseD, stake: 600 }, 500).includes('V7'), 'V7 stake mayor que la banca');
ok(validarApuesta({ ...baseD, stake: 500 }, 500).length === 0, 'V7 stake igual aceptado');
ok(validarApuesta(baseD).length === 0, 'sin banca no exige V7');

// ---- T2: ubicar antiguas al histórico (RF-9) ----
console.log('T2 ubicar histórico (RF-9)');
ok(ubicar({ estado: 'pendiente', fecha: '2026-10-08T12:00' }, '2026-10-09') === 'historico', 'pendiente de otro día va al histórico');
ok(ubicar({ estado: 'enjuego', fecha: '2026-10-08T12:00' }, '2026-10-09') === 'historico', 'en juego de otro día va al histórico');
ok(ubicar({ estado: 'pendiente', fecha: '2026-10-09T12:00' }, '2026-10-09') === 'dia', 'pendiente de hoy sigue en el día');
ok(ubicar({ estado: 'finalizada', fecha: '2026-10-01T12:00' }, '2026-10-09') === 'historico', 'finalizada sigue en histórico');

// ---- T3: botones por zona (RF-1, RF-9) ----
console.log('T3 botones por zona');
const fd = { id: 40, partido: 'E - F', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'pendiente', resultado: null, fecha: '2026-10-09T12:00' };
const ff = { ...fd, id: 41, estado: 'finalizada', resultado: 'ganada' };
const fa = { ...fd, id: 42, fecha: '2026-10-08T12:00' };
ok(betHtml(fd, 'dia').includes('data-edit="40"') && betHtml(fd, 'dia').includes('data-del="40"'), 'día no finalizada muestra Editar y Eliminar');
ok(!betHtml(ff, 'dia').includes('data-edit'), 'finalizada en el día sin botones');
ok(betHtml(ff, 'hist').includes('data-edit="41"'), 'finalizada en histórico con botones (001)');
ok(!betHtml(fa, 'hist').includes('data-edit') && betHtml(fa, 'hist').includes('data-win="42"'), 'antigua no cerrada solo Comprobar');

// ---- T4: modal con bloqueo día (RF-1, RF-6) ----
console.log('T4 modal día (RF-1)');
store['apuestas_bets'] = JSON.stringify([{ id: 50, partido: 'E - F', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'pendiente', resultado: null, fecha: hoyLocal() + 'T12:00' }]);
abrirEdicion('50', 'dia');
ok($t('eEstado').disabled === true && $t('eFecha').disabled === true, 'estado y fecha visibles deshabilitados');
$t('eCuota').value = '2.5'; guardarEdicion();
const g = JSON.parse(store['apuestas_bets'])[0];
ok(g.cuota === 2.5 && g.estado === 'pendiente' && g.fecha === hoyLocal() + 'T12:00', 'guardado cambia cuota y preserva estado/fecha');
abrirEdicion('50', 'hist');
ok($t('eEstado').disabled === false, 'desde histórico siguen editables');
store['apuestas_bets'] = JSON.stringify([]);

// ---- T5: borrado del día (RF-2, RF-3, RF-4) ----
console.log('T5 borrado día');
store['apuestas_bets'] = JSON.stringify([
  { id: 60, partido: 'Hoy Pend', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'pendiente', resultado: null, fecha: hoyLocal() + 'T12:00' },
  { id: 61, partido: 'Fin', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'finalizada', resultado: 'ganada', fecha: '2026-10-08T12:00' }]);
store['apuestas_bankroll'] = '500';
pedirBorrado('60'); cancelarBorrado();
ok(JSON.parse(store['apuestas_bets']).length === 2, 'No deja intacta la del día');
pedirBorrado('60'); confirmarBorrado();
const rest5 = JSON.parse(store['apuestas_bets']);
ok(rest5.length === 1 && rest5[0].id === 61, 'Sí borra la del día');
ok(stats().bal === 10, 'balance intacto al borrar no finalizada');
store['apuestas_bets'] = JSON.stringify([]); delete store['apuestas_bankroll'];

// ---- T6: registro valida V7 (RF-5) ----
console.log('T6 registro V7');
store['apuestas_bets'] = JSON.stringify([]);
store['apuestas_bankroll'] = '500';
$t('fPartido').value = 'G - H'; $t('fProb').value = '55'; $t('fCuota').value = '2';
$t('fCierre').value = '0'; $t('fStake').value = '600'; $t('fEstado').value = 'pendiente'; $t('fRes').value = '';
$t('fFecha').value = hoyLocal() + 'T12:00'; $t('fDeporte').value = 'futbol'; $t('fMercado').value = '1X2';
let avisos = []; global.alert = (m) => { avisos.push(m); };
$t('btnAdd').onclick();
ok(JSON.parse(store['apuestas_bets']).length === 0 && avisos.some(m => m.toLowerCase().includes('banca')), 'registro bloquea stake mayor que la banca');
$t('fStake').value = '10'; $t('btnAdd').onclick();
ok(JSON.parse(store['apuestas_bets']).length === 1, 'registro válido guarda');
store['apuestas_bets'] = JSON.stringify([]); delete store['apuestas_bankroll'];

// ---- T7: aviso + repintado (RF-7, RF-9) ----
console.log('T7 aviso y repintado');
ok(html.includes('se editan en el Hist'), 'aviso fijo en información');
store['apuestas_bets'] = JSON.stringify([{ id: 70, partido: 'I - J', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'pendiente', resultado: null, fecha: hoyLocal() + 'T12:00' }]);
store['apuestas_bankroll'] = '500';
render();
abrirEdicion('70', 'dia'); $t('eCuota').value = '4'; guardarEdicion();
ok($t('listaHoy').innerHTML.includes('4'), 'tras editar se repinta el nuevo valor');
store['apuestas_bets'] = JSON.stringify([]); delete store['apuestas_bankroll'];

// ---- T3b: una sola lista (refinamiento RF-9) ----
console.log('T3b una sola lista');
const solo = [
  { id: 43, partido: 'Hoy Fin', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'finalizada', resultado: 'ganada', fecha: hoyLocal() + 'T12:00' },
  { id: 44, partido: 'Hoy Pend', deporte: 'futbol', mercado: '1X2', prob: 0.5, cuota: 2, cierre: 0, stake: 10, estado: 'pendiente', resultado: null, fecha: hoyLocal() + 'T12:00' }];
store['apuestas_bets'] = JSON.stringify(solo);
render();
ok(!$t('listaHoy').innerHTML.includes('Hoy Fin') && $t('listaHist').innerHTML.includes('Hoy Fin'), 'finalizada de hoy solo en histórico');
const re = aplicarEdicion(solo, 43, { estado: 'pendiente', resultado: null });
saveBets(re.apuestas); render();
ok($t('listaHoy').innerHTML.includes('Hoy Fin') && !$t('listaHist').innerHTML.includes('Hoy Fin'), 'reabierta a pendiente solo en el día');
store['apuestas_bets'] = JSON.stringify([]);

console.log('TOTAL ' + n + ' assertions OK');
