/**
 * Encuestas rápidas (Google Forms) — primer paso de "Decisiones" del roadmap de mng_color.
 *
 * Para una encuesta nueva: copia una plantilla de ENCUESTAS, cambia preguntas, pon su
 * nombre en ENCUESTA_ACTUAL y ejecuta `crearEncuesta` desde el editor (Ejecutar).
 * Crea el Form (anónimo, sin pedir cuenta de Google), manda las respuestas a una
 * pestaña nueva de esta hoja y muestra el enlace para compartir en el registro.
 */
var ENCUESTA_ACTUAL = 'confraternidad-2026';

var ENCUESTAS = {
  'confraternidad-2026': {
    titulo: 'Confraternidad 17/10 · ¿Qué tal te pareció?',
    descripcion: 'Encuesta anónima de la promoción Greens 2037. Toma 1 minuto y nos ayuda a mejorar el próximo evento. ¡Gracias por participar!',
    gracias: '¡Gracias! Tu opinión llega directo al comité.',
    preguntas: [
      { tipo: 'escala', titulo: 'En general, ¿qué tan satisfecho(a) quedaste con la confraternidad?', min: 1, max: 5, bajo: 'Nada', alto: 'Muchísimo', obligatoria: true },
      { tipo: 'grilla', titulo: '¿Cómo calificas cada parte?',
        filas: ['Desfile', 'Barra y canto', 'Organización y horarios', 'Comida y bebidas', 'Juegos y actividades', 'Comunicación antes del evento'],
        columnas: ['Mala', 'Regular', 'Buena', 'Muy buena', 'No participé'] },
      { tipo: 'opcion', titulo: '¿Recomendarías repetir este tipo de evento el próximo año?', opciones: ['Sí', 'Tal vez', 'No'] },
      { tipo: 'parrafo', titulo: '¿Qué fue lo que más te gustó?' },
      { tipo: 'parrafo', titulo: '¿Qué mejorarías para la próxima?' },
      { tipo: 'opcion', titulo: 'Grado de tu hijo(a) (opcional)', opciones: ['K1', 'K2', 'K3', 'Prefiero no decir'] }
    ]
  }
};

function crearEncuesta() {
  var def = ENCUESTAS[ENCUESTA_ACTUAL];
  if (!def) throw new Error('No existe la encuesta ' + ENCUESTA_ACTUAL);
  var props = PropertiesService.getScriptProperties(), clave = 'encuesta_' + ENCUESTA_ACTUAL;
  var ya = props.getProperty(clave);
  if (ya) { Logger.log('Ya existe: ' + FormApp.openById(ya).getPublishedUrl()); return; }

  var form = FormApp.create(def.titulo)
    .setDescription(def.descripcion)
    .setConfirmationMessage(def.gracias)
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false) // sin login: anónima de verdad
    .setAllowResponseEdits(false)
    .setShowLinkToRespondAgain(false)
    .setProgressBar(false);
  def.preguntas.forEach(function (q) {
    var it;
    if (q.tipo === 'escala') it = form.addScaleItem().setBounds(q.min, q.max).setLabels(q.bajo, q.alto);
    else if (q.tipo === 'grilla') it = form.addGridItem().setRows(q.filas).setColumns(q.columnas);
    else if (q.tipo === 'opcion') it = form.addMultipleChoiceItem().setChoiceValues(q.opciones);
    else if (q.tipo === 'parrafo') it = form.addParagraphTextItem();
    else it = form.addTextItem();
    it.setTitle(q.titulo);
    if (q.obligatoria) it.setRequired(true);
  });
  form.setDestination(FormApp.DestinationType.SPREADSHEET, SpreadsheetApp.getActive().getId());
  props.setProperty(clave, form.getId());

  var url = form.getPublishedUrl();
  Logger.log('Enlace para compartir: ' + url);
  Logger.log('Editar: ' + form.getEditUrl());
  try { SpreadsheetApp.getUi().alert('Encuesta creada', 'Enlace para compartir:\n' + url, SpreadsheetApp.getUi().ButtonSet.OK); } catch (e) { /* ejecutado desde el editor */ }
}
