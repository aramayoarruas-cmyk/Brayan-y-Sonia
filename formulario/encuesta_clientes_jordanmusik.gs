/**
 * ENCUESTA DE CLIENTES JORDÁNMUSIK + CÓDIGO DE DESCUENTO PERSONAL DEL 5 %
 *
 * Qué hace este script:
 *  1. crearEncuesta(): crea el formulario de Google, una hoja de cálculo para las
 *     respuestas y una pestaña "Códigos" donde se guarda el código de cada persona.
 *  2. Instala un activador para que, cada vez que alguien envía la encuesta, se ejecute
 *     enviarCodigo(): genera un código único (por ejemplo JORDAN5-K7M2QX), lo guarda en la
 *     pestaña "Códigos" y se lo envía por correo a esa persona. Si un correo ya recibió
 *     código, no se le envía otro.
 *
 * Uso: script.google.com > Nuevo proyecto > pegar este código > Guardar >
 *      ejecutar "crearEncuesta" > Autorizar > ver los enlaces en el "Registro de ejecución".
 *      Ejecútalo UNA sola vez; si lo ejecutas de nuevo se crea otro formulario.
 */

// ---------- CONFIGURACIÓN (podéis cambiar estos textos) ----------
var MARCA = 'JORDÁNMUSIK';
var PREFIJO_CODIGO = 'JORDAN5-';
var VALIDEZ = 'durante 3 meses desde que lo recibas';
var DONDE_USAR = 'en nuestra tienda de Cartagena (C.C. Espacio Mediterráneo) y en nuestra web';

// Títulos que el envío del código necesita encontrar (no cambiarlos sin cambiarlos abajo)
var T_EMAIL = 'Correo electrónico';
var T_CONSENT = 'Protección de datos';

function crearEncuesta() {
  var form = FormApp.create('Encuesta JORDÁNMUSIK · Gana un 5 % de descuento');
  form.setDescription(
    '¡Hola! En ' + MARCA + ' queremos conocerte mejor para mejorar nuestros auriculares JORDÁNPODS.\n\n' +
    '🎁 Responde a esta encuesta (unos 3 minutos) y te enviaremos por correo un CÓDIGO DE DESCUENTO PERSONAL DEL 5 % ' +
    'para tu próxima compra.\n\n' +
    'Condiciones: un código por persona, de un solo uso, válido solo para el titular del correo electrónico ' +
    'con el que respondas, ' + VALIDEZ + ', ' + DONDE_USAR + '. No acumulable con otras promociones.\n\n' +
    'Participar es totalmente voluntario.'
  );
  form.setProgressBar(true);
  form.setCollectEmail(false);
  form.setShowLinkToRespondAgain(false);
  form.setConfirmationMessage(
    '¡Gracias por ayudarnos! En unos minutos recibirás en tu correo tu código personal del 5 % de descuento. ' +
    'Si no lo ves, revisa la carpeta de correo no deseado o promociones.'
  );

  // ===== SECCIÓN 1: SOBRE TI =====
  form.addSectionHeaderItem().setTitle('Sobre ti');

  form.addTextItem()
    .setTitle(T_EMAIL)
    .setHelpText('Aquí te enviaremos tu código de descuento personal.')
    .setValidation(FormApp.createTextValidation()
      .requireTextIsEmail()
      .setHelpText('Escribe un correo electrónico válido.')
      .build())
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Qué edad tienes?')
    .setChoiceValues(['Menos de 18', '18-24', '25-34', '35-44', '45-54', '55 o más'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿A qué te dedicas?')
    .setChoiceValues(['Estudio', 'Trabajo', 'Estudio y trabajo', 'Ninguna de las anteriores'])
    .setRequired(true);

  form.addListItem()
    .setTitle('¿En qué provincia vives?')
    .setChoiceValues(PROVINCIAS)
    .setRequired(true);

  // ===== SECCIÓN 2: TUS AURICULARES =====
  form.addPageBreakItem().setTitle('Tus auriculares');

  form.addCheckboxItem()
    .setTitle('¿En qué momentos usas auriculares?')
    .setHelpText('Puedes marcar varias opciones.')
    .setChoiceValues(['En el transporte', 'Haciendo deporte', 'Estudiando', 'Trabajando', 'Jugando a videojuegos', 'En casa, para relajarme'])
    .showOtherOption(true)
    .setRequired(true);

  form.addGridItem()
    .setTitle('¿Qué importancia tiene cada aspecto al elegir unos auriculares?')
    .setHelpText('1 = nada importante · 5 = muy importante')
    .setRows(['Precio', 'Batería', 'Calidad de sonido', 'Cancelación de ruido', 'Comodidad', 'Diseño'])
    .setColumns(['1', '2', '3', '4', '5'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Si solo pudieras elegir uno, ¿cuál es el aspecto más importante para ti?')
    .setChoiceValues(['Precio', 'Batería', 'Calidad de sonido', 'Cancelación de ruido', 'Comodidad', 'Diseño'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Cuánto estarías dispuesto/a a pagar por unos auriculares inalámbricos?')
    .setChoiceValues(['Menos de 30 €', 'Entre 30 € y 60 €', 'Entre 60 € y 100 €', 'Más de 100 €'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Cuál es la principal razón por la que cambiarías tus auriculares?')
    .setChoiceValues(['Se rompen', 'Falla la batería', 'Los pierdo', 'Quiero unos mejores', 'Se rayan muy rápido',
                      'Las almohadillas se ensucian y no incluyen unas de repuesto'])
    .showOtherOption(true)
    .setRequired(true);

  // ===== SECCIÓN 3: CÓMO COMPRAS =====
  form.addPageBreakItem().setTitle('Cómo compras');

  form.addCheckboxItem()
    .setTitle('¿Dónde sueles comprar tus auriculares?')
    .setHelpText('Puedes marcar varias opciones.')
    .setChoiceValues(['Tienda física', 'Web de la marca', 'Amazon'])
    .showOtherOption(true)
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('¿Cuándo sueles comprarlos?')
    .setHelpText('Puedes marcar varias opciones.')
    .setChoiceValues(['Espero a las rebajas', 'Espero al Black Friday', 'Los compro como regalo de Navidad',
                      'Cuando los necesito, sin esperar a ofertas'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('¿Qué miras antes de comprar unos auriculares?')
    .setHelpText('Puedes marcar varias opciones.')
    .setChoiceValues(['TikTok', 'Instagram', 'YouTube', 'Reseñas de otros compradores', 'Consejos de amigos o familia',
                      'Lo que me dicen en la tienda'])
    .setRequired(true);

  // ===== SECCIÓN 4: MARCAS =====
  form.addPageBreakItem().setTitle('Marcas');

  form.addListItem()
    .setTitle('¿De qué marca son los auriculares que usas ahora?')
    .setChoiceValues(['AirPods (Apple)', 'Samsung', 'Xiaomi', 'Sony', 'JBL', 'Huawei', 'Bose', 'JORDÁNPODS',
                      'Otra marca', 'No sé la marca', 'Ahora no uso auriculares'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Conoces los JORDÁNPODS?')
    .setChoiceValues(['Sí, los tengo', 'Sí, los conozco pero no los tengo', 'Me suenan', 'No los conozco'])
    .setRequired(true);

  // ===== SECCIÓN 5: SOSTENIBILIDAD Y ECONOMÍA =====
  form.addPageBreakItem().setTitle('Sostenibilidad y economía');

  form.addScaleItem()
    .setTitle('¿Cuánto te importa que la caja de los auriculares sea de cartón reciclado?')
    .setBounds(1, 5)
    .setLabels('Nada', 'Mucho')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Pagarías algo más por unos auriculares sostenibles?')
    .setChoiceValues(['No', 'Sí, hasta 5 € más', 'Sí, hasta 10 € más', 'Sí, más de 10 €'])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('La subida de precios, ¿te ha hecho gastar menos en tecnología?')
    .setBounds(1, 5)
    .setLabels('Gasto mucho menos', 'Gasto lo mismo o más')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('¿Quieres contarnos algo más sobre tus auriculares ideales?')
    .setHelpText('Opcional.');

  // ===== SECCIÓN 6: PROTECCIÓN DE DATOS =====
  form.addPageBreakItem().setTitle('Último paso');

  form.addCheckboxItem()
    .setTitle(T_CONSENT)
    .setHelpText('Responsable: ' + MARCA + '. Finalidad: analizar las respuestas de forma agregada y enviarte tu código de ' +
                 'descuento. No cederemos tus datos a terceros. Puedes pedir que los borremos en cualquier momento ' +
                 'respondiendo al correo del código.')
    .setChoiceValues(['He leído la información y acepto que ' + MARCA + ' use mis datos para estos fines.'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Novedades y ofertas')
    .setChoiceValues(['Quiero recibir novedades y ofertas de ' + MARCA + ' por correo (opcional).']);

  // ===== HOJA DE RESPUESTAS + PESTAÑA DE CÓDIGOS =====
  var hoja = SpreadsheetApp.create('Respuestas · Encuesta JORDÁNMUSIK (descuento 5 %)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, hoja.getId());
  var codigos = hoja.insertSheet('Códigos');
  codigos.appendRow(['Fecha', 'Correo', 'Código', 'Estado del envío', 'Usado (marcar en tienda)']);
  codigos.setFrozenRows(1);
  codigos.getRange('A1:E1').setFontWeight('bold');

  PropertiesService.getScriptProperties().setProperty('HOJA_ID', hoja.getId());

  // Activador: enviarCodigo() se ejecuta con cada respuesta
  ScriptApp.newTrigger('enviarCodigo').forForm(form).onFormSubmit().create();

  Logger.log('Editar formulario:  ' + form.getEditUrl());
  Logger.log('Enlace para enviar: ' + form.getPublishedUrl());
  Logger.log('Hoja de respuestas: ' + hoja.getUrl());
}

/** Se ejecuta sola cada vez que alguien envía la encuesta. */
function enviarCodigo(e) {
  var email = '';
  e.response.getItemResponses().forEach(function (r) {
    if (r.getItem().getTitle() === T_EMAIL) email = String(r.getResponse()).trim().toLowerCase();
  });
  if (!email) return;

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var hoja = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('HOJA_ID'));
    var codigos = hoja.getSheetByName('Códigos');
    var datos = codigos.getDataRange().getValues();

    // Un solo código por correo
    for (var i = 1; i < datos.length; i++) {
      if (String(datos[i][1]).toLowerCase() === email) return;
    }

    var usados = datos.map(function (f) { return f[2]; });
    var codigo;
    do { codigo = PREFIJO_CODIGO + aleatorio(6); } while (usados.indexOf(codigo) !== -1);

    var estado = 'Enviado';
    try {
      MailApp.sendEmail({
        to: email,
        subject: 'Tu código del 5 % de descuento en ' + MARCA,
        htmlBody: correoHtml(codigo),
        name: MARCA
      });
    } catch (err) {
      estado = 'Error: ' + err.message;
    }
    codigos.appendRow([new Date(), email, codigo, estado, '']);
  } finally {
    lock.releaseLock();
  }
}

function aleatorio(n) {
  var c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin O/0 ni I/1 para que no se confundan
  var s = '';
  for (var i = 0; i < n; i++) s += c.charAt(Math.floor(Math.random() * c.length));
  return s;
}

function correoHtml(codigo) {
  return '<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#232769">' +
    '<div style="background:#232769;color:#fff;padding:24px;border-radius:12px 12px 0 0;text-align:center">' +
    '<div style="font-size:26px;font-weight:bold;letter-spacing:1px">JORDÁNMUSIK</div>' +
    '<div style="font-size:14px;opacity:.85">Gracias por responder nuestra encuesta</div></div>' +
    '<div style="background:#EEF0FC;padding:24px;border-radius:0 0 12px 12px;text-align:center">' +
    '<p style="font-size:16px;margin:0 0 12px">Este es tu código personal de <b>5 % de descuento</b>:</p>' +
    '<div style="display:inline-block;background:#fff;border:2px dashed #6C77D6;border-radius:10px;padding:14px 22px;' +
    'font-size:26px;font-weight:bold;letter-spacing:3px">' + codigo + '</div>' +
    '<p style="font-size:13px;color:#555a7a;margin:16px 0 0">Válido para tu próxima compra ' + DONDE_USAR + ', ' + VALIDEZ +
    '. Un solo uso, solo para el titular de este correo. No acumulable con otras promociones.</p></div></div>';
}

var PROVINCIAS = ['Murcia', 'Granada', 'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila',
  'Badajoz', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ceuta', 'Ciudad Real', 'Córdoba',
  'Cuenca', 'Girona', 'Guadalajara', 'Gipuzkoa', 'Huelva', 'Huesca', 'Illes Balears', 'Jaén', 'La Rioja',
  'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Melilla', 'Navarra', 'Ourense', 'Palencia',
  'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel',
  'Toledo', 'Valencia', 'Valladolid', 'Bizkaia', 'Zamora', 'Zaragoza', 'Vivo fuera de España'];
