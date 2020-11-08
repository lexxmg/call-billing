'use strict';

const inputFile = document.querySelector('.form__item');

const abonents = new ParsAbonCsv(abonCsv);
const mn = new ParsMNcsv(strMN);
const abc3 = new ParsABC(strABC3);
const abc4 = new ParsABC(strABC4);
const abc8 = new ParsABC(strABC8);
const abc9 = new ParsABC(strABC9);
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

      for (let abon of abonents.abonents) {
        if ( isCode(obj['Номер A'], abon.phoneNumber) ) {
          obj['Абонент'] = abon.bonentName;
        }
      }

      if ( isCode(obj['Номер Б'], 3) ) {
        for (let objABC of abc3.objPref) {
          if ( +obj['Номер Б'] >= Number(objABC.abc + objABC.start) && +obj['Номер Б'] <= Number(objABC.abc + objABC.end) ) {
            obj['Оператор'] = objABC.RegionName;
            break;
          }
        }
      }

      if ( isCode(obj['Номер Б'], 4) ) {
        for (let objABC of abc4.objPref) {
          if ( +obj['Номер Б'] >= Number(objABC.abc + objABC.start) && +obj['Номер Б'] <= Number(objABC.abc + objABC.end) ) {
            obj['Оператор'] = objABC.RegionName;
            break;
          }
        }
      }

      if ( isCode(obj['Номер Б'], 8) ) {
        for (let objABC of abc8.objPref) {
          if ( +obj['Номер Б'] >= Number(objABC.abc + objABC.start) && +obj['Номер Б'] <= Number(objABC.abc + objABC.end) ) {
            obj['Оператор'] = objABC.RegionName;
            break;
          }
        }
      }

      if ( isCode(obj['Номер Б'], 9) ) {
        for (let objABC of abc9.objPref) {
          if ( +obj['Номер Б'] >= Number(objABC.abc + objABC.start) && +obj['Номер Б'] <= Number(objABC.abc + objABC.end) ) {
            obj['Оператор'] = objABC.RegionName;
            break;
          }
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
