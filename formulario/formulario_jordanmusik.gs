/**
 * Crea el formulario de Google "Estudio sobre hábitos y preferencias en auriculares"
 * de JORDÁNMUSIK (15 preguntas cuantitativas) y una hoja de cálculo vinculada
 * donde se guardarán las respuestas.
 *
 * Uso: script.google.com > Nuevo proyecto > pegar este código > Guardar >
 *      Ejecutar "crearFormulario" > Autorizar > ver enlaces en "Registro de ejecución".
 */
function crearFormulario() {
  var form = FormApp.create('Estudio sobre hábitos y preferencias en auriculares');
  form.setDescription(
    'Desde JORDÁNMUSIK, una marca de auriculares de Cartagena (Murcia), queremos conocer ' +
    'tus hábitos y preferencias. Responder te llevará unos 4 minutos. Las respuestas son ' +
    'anónimas y solo se analizarán de forma agregada con fines de investigación comercial.'
  );
  form.setProgressBar(true);
  form.setCollectEmail(false);
  form.setShowLinkToRespondAgain(false);
  form.setConfirmationMessage('¡Gracias por tu tiempo! Tus respuestas nos ayudarán a mejorar.');

  var SEGUIR = FormApp.PageNavigationType.CONTINUE;
  var ENVIAR = FormApp.PageNavigationType.SUBMIT;

  // ---------- SECCIÓN 1: Edad (filtro) ----------
  var p1 = form.addMultipleChoiceItem()
    .setTitle('1. ¿Qué edad tienes?')
    .setRequired(true);
  p1.setChoices([
    p1.createChoice('Menos de 14 años', ENVIAR),
    p1.createChoice('14-17', SEGUIR),
    p1.createChoice('18-24', SEGUIR),
    p1.createChoice('25-34', SEGUIR),
    p1.createChoice('35-44', SEGUIR),
    p1.createChoice('45-54', SEGUIR),
    p1.createChoice('55 o más', SEGUIR)
  ]);

  // ---------- SECCIÓN 2: Sobre ti ----------
  form.addPageBreakItem().setTitle('Sobre ti');

  form.addMultipleChoiceItem()
    .setTitle('2. Género')
    .setChoiceValues(['Mujer', 'Hombre', 'Otro', 'Prefiero no decirlo'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('3. ¿Cuál es tu ocupación principal?')
    .setChoiceValues(['Estudiante', 'Estudio y trabajo', 'Trabajo por cuenta ajena',
                      'Autónomo/a', 'Desempleado/a', 'Jubilado/a'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('4. ¿Dónde vives?')
    .setChoiceValues(['Cartagena', 'Resto de la Región de Murcia', 'Otra comunidad autónoma'])
    .setRequired(true);

  var p5 = form.addMultipleChoiceItem()
    .setTitle('5. ¿Con qué frecuencia usas auriculares?')
    .setRequired(true);
  p5.setChoices([
    p5.createChoice('Todos los días', SEGUIR),
    p5.createChoice('Varias veces por semana', SEGUIR),
    p5.createChoice('Una vez por semana o menos', SEGUIR),
    p5.createChoice('Nunca o casi nunca', ENVIAR)
  ]);

  // ---------- SECCIÓN 3: Tus auriculares ----------
  form.addPageBreakItem().setTitle('Tus auriculares');

  form.addCheckboxItem()
    .setTitle('6. ¿En qué situaciones los usas?')
    .setHelpText('Puedes marcar varias opciones.')
    .setChoiceValues(['Transporte o desplazamientos', 'Deporte', 'Estudio o trabajo',
                      'Llamadas', 'Videojuegos', 'En casa', 'Viajes'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('7. ¿Qué tipo de auriculares usas principalmente?')
    .setChoiceValues(['Intrauditivos inalámbricos con estuche', 'Intrauditivos con cable',
                      'De diadema inalámbricos', 'De diadema con cable', 'Deportivos con gancho'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('8. ¿Cuánto costaron tus auriculares actuales?')
    .setChoiceValues(['Menos de 20 €', '20-49 €', '50-99 €', '100-149 €', '150 € o más',
                      'No lo sé o fueron un regalo'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('9. ¿Cada cuánto cambias de auriculares?')
    .setChoiceValues(['Menos de 6 meses', '6-12 meses', '1-2 años', 'Más de 2 años'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('10. ¿Por qué motivos has cambiado de auriculares?')
    .setHelpText('Puedes marcar varias opciones.')
    .setChoiceValues(['Se rompieron', 'La batería duraba poco', 'Eran incómodos',
                      'Fallos de conexión', 'Los perdí', 'Quería mejores prestaciones',
                      'Por diseño', 'Nunca los he cambiado'])
    .setRequired(true);

  // ---------- SECCIÓN 4: Preferencias ----------
  form.addPageBreakItem().setTitle('Tus preferencias');

  form.addGridItem()
    .setTitle('11. Valora la importancia de cada aspecto al comprar auriculares')
    .setHelpText('1 = nada importante · 5 = muy importante')
    .setRows(['Calidad de sonido', 'Duración de la batería', 'Comodidad', 'Cancelación de ruido',
              'Diseño', 'Precio', 'Marca', 'Resistencia al agua y al sudor', 'Garantía',
              'Sostenibilidad'])
    .setColumns(['1', '2', '3', '4', '5'])
    .setRequired(true);

  var validacionPrecio = FormApp.createTextValidation()
    .setHelpText('Escribe solo un número entre 0 y 500.')
    .requireNumberBetween(0, 500)
    .build();
  form.addTextItem()
    .setTitle('12. ¿Cuál es el precio máximo que pagarías por unos auriculares inalámbricos? (en €)')
    .setValidation(validacionPrecio)
    .setRequired(true);

  form.addScaleItem()
    .setTitle('13. ¿Qué importancia tiene para ti que el envase sea sostenible (sin plástico, reciclable)?')
    .setBounds(1, 5)
    .setLabels('Nada importante', 'Muy importante')
    .setRequired(true);

  form.addGridItem()
    .setTitle('14. ¿Qué relación tienes con estas marcas?')
    .setRows(['Apple', 'Samsung', 'Sony', 'JBL', 'Xiaomi', 'Soundcore', 'Bose', 'JORDÁNMUSIK'])
    .setColumns(['No la conozco', 'La conozco', 'La he usado', 'La uso ahora'])
    .setRequired(true);

  // ---------- SECCIÓN 5: JORDÁNPODS ----------
  form.addPageBreakItem()
    .setTitle('JORDÁNPODS')
    .setHelpText('JORDÁNPODS son los auriculares inalámbricos de JORDÁNMUSIK, ' +
                 'una marca de Cartagena (Murcia).');

  form.addScaleItem()
    .setTitle('15. ¿Qué probabilidad hay de que compraras unos JORDÁNPODS?')
    .setBounds(1, 5)
    .setLabels('Seguro que no', 'Seguro que sí')
    .setRequired(true);

  // ---------- Hoja de respuestas vinculada ----------
  var hoja = SpreadsheetApp.create('Respuestas - Encuesta JORDÁNMUSIK');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, hoja.getId());

  Logger.log('Editar formulario: ' + form.getEditUrl());
  Logger.log('Vista previa:      ' + form.getPublishedUrl());
  Logger.log('Hoja de respuestas: ' + hoja.getUrl());
}
