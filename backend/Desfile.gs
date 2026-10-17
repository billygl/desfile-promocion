/**
 * Backend del desfile (greens2037.website/desfile): asistencia y asignación de tareas.
 * Web app: ejecutar como yo, acceso "Cualquier usuario".
 *
 * GET  ?rev=N           -> {rev, same:true} si no hubo cambios; si no, {rev, data, at}
 * POST {key,data,tables} -> guarda (solo con la clave de administrador), devuelve {rev, at}
 *
 * La clave vive solo en el proyecto de Apps Script (archivo Clave.gs con DESFILE_KEY),
 * nunca en el repo público.
 * El estado se guarda en la pestaña "Desfile_Estado" y se copia legible a
 * "Desfile_Asistencia" y "Desfile_Tareas" para revisarlo en la hoja.
 */
var DESFILE_TAB = 'Desfile_Estado';
var DESFILE_CACHE = 'desfile-state';

function doGet(e) {
  var st = desfileLoad_();
  var rev = String((e && e.parameter && e.parameter.rev) || '');
  if (rev && rev === String(st.rev)) return desfileJson_({ rev: st.rev, same: true });
  var data = st.data;
  // attendance stays private until the admin publishes it
  var k = desfileKey_();
  if (data && !data.attLive && (!k || (e.parameter.key || '') !== k)) {
    data = JSON.parse(JSON.stringify(data)); data.att = {};
  }
  return desfileJson_({ rev: st.rev, at: st.at, data: data });
}

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return desfileJson_({ error: 'json' }); }
  var key = desfileKey_();
  if (!key || body.key !== key) return desfileJson_({ error: 'clave' });
  if (body.check) return desfileJson_({ ok: true });
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var st = desfileLoad_();
    var next = { rev: (Number(st.rev) || 0) + 1, at: new Date().toISOString(), data: body.data || {} };
    var sh = desfileSheet_(DESFILE_TAB);
    sh.getRange(1, 1, 1, 3).setValues([[JSON.stringify(next.data), next.rev, next.at]]);
    CacheService.getScriptCache().put(DESFILE_CACHE, JSON.stringify(next), 21600);
    if (body.tables) {
      desfileTable_('Desfile_Asistencia', body.tables.asistencia);
      desfileTable_('Desfile_Tareas', body.tables.tareas);
    }
    return desfileJson_({ rev: next.rev, at: next.at });
  } finally {
    lock.releaseLock();
  }
}

function desfileKey_() {
  return typeof DESFILE_KEY === 'string' ? DESFILE_KEY : '';
}

function desfileLoad_() {
  var cache = CacheService.getScriptCache(), hit = cache.get(DESFILE_CACHE);
  if (hit) return JSON.parse(hit);
  var v = desfileSheet_(DESFILE_TAB).getRange(1, 1, 1, 3).getValues()[0];
  var st = { data: v[0] ? JSON.parse(v[0]) : null, rev: Number(v[1]) || 0, at: v[2] ? String(v[2]) : '' };
  cache.put(DESFILE_CACHE, JSON.stringify(st), 21600);
  return st;
}

function desfileSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function desfileTable_(name, rows) {
  if (!rows || !rows.length) return;
  var sh = desfileSheet_(name), w = rows.reduce(function (m, r) { return Math.max(m, r.length); }, 0);
  sh.clearContents();
  sh.getRange(1, 1, rows.length, w).setValues(rows.map(function (r) {
    var o = r.slice(); while (o.length < w) o.push(''); return o;
  }));
  sh.setFrozenRows(1);
}

function desfileJson_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Ejecutar una vez desde el editor para dar permiso a la hoja (lo pide Google la primera vez). */
function desfileAutorizar() {
  desfileSheet_(DESFILE_TAB);
  Logger.log('Listo: ' + SpreadsheetApp.getActiveSpreadsheet().getName());
}
