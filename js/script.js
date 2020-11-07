'use strict';

const inputFile = document.querySelector('.form__item');


const mn = new ParsMNcsv(strMN);
const result = [];

inputFile.addEventListener('change', () => {
  const file = inputFile.files[0];

  let reader = new FileReader();
  reader.readAsText(file);

  reader.addEventListener('loadstart', () => {
    console.log('чтение файла начато');
  });

  reader.addEventListener('load', () => {
    const ats = new ParsATScsv(reader.result);
    const callOut = ats.callOut;

    for (let obj of callOut) {
      for (let pref of mn.mn) {
        if ( isCode(obj['Номер Б'], pref.combine) ) {
          obj['Оператор'] = pref.nameCountry;
          obj['Тариф'] = pref.cost;
          obj['Списание'] = +obj['Длит. (окр.)'] * parseFloat(pref.cost.replace(',', '.') );
        }
      }
    }
    console.log(callOut);
    console.table(callOut);
  });

  reader.addEventListener('error', () => {
    console.log('файл не прочитан ' + reader.error);
  });
});

function isCode(num, code) {
  const lengthCode = String(code).length;
  const numCode = String(num).substring(0, lengthCode);

  return String(code) === numCode;
}
