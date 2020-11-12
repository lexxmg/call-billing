'use strict';

const inputFile = document.querySelector('.input__item');
const table = document.querySelector('.table__body');
const link = document.querySelector('.link');
const listItem = document.querySelectorAll('.list__item');

document.querySelectorAll('.table_sort thead')
  .forEach(tableTH => {
    tableTH.addEventListener('click', () => {
      getSort(event)
    });
  });

let subscriberData;
let phonecallsData;
let mnData;
let abc3Data;
let abc4Data;
let abc8Data;
let abc9Data;

inputFile.addEventListener('change', () => {
  const file = inputFile.files;

  for (let elem of file) {
    if (elem.name === 'phonecallsdata.csv' && !phonecallsData) {
      readeFile(elem, data => {
        phonecallsData = data;
        console.log('callBack phpnecall');
        listItem[0].classList.add('list__item--active');
        check();
      });
    } else if (elem.name === 'MN.csv' && !mnData) {
      readeFile(elem, data => {
        mnData = data;
        console.log('callBack MN');
        listItem[1].classList.add('list__item--active');
        check();
      });
    }else if (elem.name === 'subscriber.csv' && !subscriberData) {
      readeFile(elem, data => {
        subscriberData = data;
        console.log('callBack subscriber');
        listItem[2].classList.add('list__item--active');
        check();
      });
    } else if (elem.name === 'ABC-3xx.csv' && !abc3Data) {
      readeFile(elem, data => {
        abc3Data = data;
        console.log('callBack ABC-3');
        listItem[3].classList.add('list__item--active');
        check();
      });
    } else if (elem.name === 'ABC-4xx.csv' && !abc4Data) {
      readeFile(elem, data => {
        abc4Data = data;
        console.log('callBack ABC-4');
        listItem[4].classList.add('list__item--active');
        check();
      });
    } else if (elem.name === 'ABC-8xx.csv' && !abc8Data) {
      readeFile(elem, data => {
        abc8Data = data;
        console.log('callBack ABC-8');
        listItem[5].classList.add('list__item--active');
        check();
      });
    } else if (elem.name === 'DEF-9xx.csv' && !abc9Data) {
      readeFile(elem, data => {
        abc9Data = data;
        console.log('callBack ABC-9');
        listItem[6].classList.add('list__item--active');
        check();
      });
    } else {
      alert('недопустимое имя файла');
    }
  }

});

function check() {
  if (phonecallsData && subscriberData && mnData && abc3Data && abc4Data && abc8Data && abc9Data) {
    console.log('Все файли загружены');

    document.querySelector('.background').classList.remove('hidden');

    // console.log(phonecallsData);
    // console.log(mnData);

    setTimeout(() => {
      console.time('time1');
      pars(phonecallsData, subscriberData, mnData, abc3Data, abc4Data, abc8Data, abc9Data);
    }, 3000);
  }
}

function readeFile(data, callBack) {
  let reader = new FileReader();
  reader.readAsText(data);

  reader.addEventListener('loadstart', () => {
    console.log('чтение файла начато');
  });

  reader.addEventListener('load', function() {
    callBack(reader.result);
  });

  reader.addEventListener('error', () => {
    console.log('файл не прочитан ' + reader.error);
  });
}

function pars(phoneData, sub, mN, abc3x, abc4x, abc8x, abc9x) {
  const ats = new ParsATScsv(phoneData, {
    exception: [495, 499],
    psm: ['001000', '001001']
  });

  const subscriber = new ParsAbonCsv(sub);
  const mn = new ParsMNcsv(mN);
  const abc3 = new ParsABC(abc3x);
  const abc4 = new ParsABC(abc4x);
  const abc8 = new ParsABC(abc8x);
  const abc9 = new ParsABC(abc9x);
  const callOut = ats.callOut;
  const result = [];

start: for (let obj of callOut) {
    //if ( +obj['Причина'] !== 16 && +obj['Причина'] !== 17 && +obj['Причина'] !== 19) continue start; // Оnбросить всё что не
    //if ( +obj['Причина'] !== 16 ) continue; // Оnбросить всё что не 16
    //if ( obj['Длит. (окр.)'] === '0' ) continue; //Отбросить нулевую длительность
    if (+obj['Причина'] === 17) continue start;


    for (let abon of subscriber.abonents) {
      if ( isCode(obj['Номер A'], abon.phoneNumber) ) {
        obj['Абонент'] = abon.bonentName;
        break;
      }
    }

    if (obj['Абонент'] === '') continue start; // Отбросить всех кто не в базе наших номеров

    if ( isCode(obj['Номер Б'], 9) ) {
      for (let objABC of abc9.objPref) {
        if ( isCode(obj['Номер Б'], objABC.abc) ) {
          if ( +obj['Номер Б'] >= Number(objABC.abc + objABC.start) && +obj['Номер Б'] <= Number(objABC.abc + objABC.end) ) {
            obj['Оператор'] = objABC.RegionName;
            obj['Класс'] = objABC.prov;
            obj['Тариф'] = String(objABC.cost);
            obj['Категория'] = 'Сотовые';
            obj['Списание'] = +obj['Длит. (окр.)'] * parseFloat( obj['Тариф'].replace(',', '.') );

            if (obj['Оператор'] === 'г. Москва и Московская область' && obj['Класс'] === 'ПАО Мобильные ТелеСистемы') continue start;
            //if (obj['Оператор'] === 'г. Москва и Московская область' && obj['Класс'] === 'ПАО Мобильные ТелеСистемы') continue start;

            table.append(createTables(obj));
            result.push(obj);
            continue start;
          }
        }
      }
    }

    if ( isCode(obj['Номер Б'], 3) ) {
      for (let objABC of abc3.objPref) {
        if ( isCode(obj['Номер Б'], objABC.abc) ) {
          if ( +obj['Номер Б'] >= Number(objABC.abc + objABC.start) && +obj['Номер Б'] <= Number(objABC.abc + objABC.end) ) {
            obj['Оператор'] = objABC.RegionName;
            obj['Класс'] = objABC.prov;
            obj['Тариф'] = String(objABC.cost);
            obj['Категория'] = 'МГ';
            obj['Списание'] = +obj['Длит. (окр.)'] * parseFloat( obj['Тариф'].replace(',', '.') );

            //if (obj['Оператор'] === 'г. Москва и Московская область' && obj['Класс'] === 'ПАО Мобильные ТелеСистемы') continue start;

            table.append(createTables(obj));
            result.push(obj);
            continue start;
          }
        }
      }
    }

    if ( isCode(obj['Номер Б'], 8) ) {
      for (let objABC of abc8.objPref) {
        if ( isCode(obj['Номер Б'], objABC.abc) ) {
          if ( +obj['Номер Б'] >= Number(objABC.abc + objABC.start) && +obj['Номер Б'] <= Number(objABC.abc + objABC.end) ) {
            obj['Оператор'] = objABC.RegionName;
            obj['Класс'] = objABC.prov;
            obj['Тариф'] = String(objABC.cost);
            obj['Категория'] = 'МГ';
            obj['Списание'] = +obj['Длит. (окр.)'] * parseFloat( obj['Тариф'].replace(',', '.') );

            //if (obj['Оператор'] === 'г. Москва и Московская область' && obj['Класс'] === 'ПАО Мобильные ТелеСистемы') continue start;

            table.append(createTables(obj));
            result.push(obj);
            continue start;
          }
        }
      }
    }

    if ( isCode(obj['Номер Б'], 4) ) {
      for (let objABC of abc4.objPref) {
        if ( isCode(obj['Номер Б'], objABC.abc) ) {
          if ( +obj['Номер Б'] >= Number(objABC.abc + objABC.start) && +obj['Номер Б'] <= Number(objABC.abc + objABC.end) ) {
            obj['Оператор'] = objABC.RegionName;
            obj['Класс'] = objABC.prov;
            obj['Тариф'] = String(objABC.cost);
            obj['Категория'] = 'МГ';
            obj['Списание'] = +obj['Длит. (окр.)'] * parseFloat( obj['Тариф'].replace(',', '.') );

            //if (obj['Оператор'] === 'г. Москва и Московская область' && obj['Класс'] === 'ПАО Мобильные ТелеСистемы') continue start;

            table.append(createTables(obj));
            result.push(obj);
            continue start;
          }
        }
      }
    }

    for (let pref of mn.mn) {
      if ( isCode(obj['Номер Б'], pref.combine) ) {
        obj['Оператор'] = pref.nameCountry;
        obj['Тариф'] = String(pref.cost);
        obj['Категория'] = 'МН';
        obj['Списание'] = +obj['Длит. (окр.)'] * parseFloat( pref.cost.replace(',', '.') );
        table.append(createTables(obj));
        result.push(obj);
        continue start;
      }
    }

    table.append(createTables(obj));
    result.push(obj);
  }
  //console.log(callOut);
  //console.table(callOut);
  console.timeEnd('time1');

  console.log('докумнт свормирован можно скачивать');
  document.querySelector('.input-container').classList.add('hidden');
  document.querySelector('.background').classList.add('hidden');
  document.querySelector('.tadle-container').classList.remove('hidden');
  //link.classList.remove('hidden');

  //const csv = arrObjtoCSV(callOut);
  const csv = arrObjtoCSV(result);

  const blob = new Blob(["\ufeff", csv]);
  const url = URL.createObjectURL(blob);
  const dat = date();
  link.href = url;
  link.download = 'billing-data_' + dat + '.csv';

  console.log( minutesCount(result) );
  console.log(result.length);
}

function isCode(num, code) {
  const lengthCode = String(code).length;
  const numCode = String(num).substring(0, lengthCode);

  return String(code) === numCode;
}

function createTables(obj) {
  const tr = document.createElement('tr');
  tr.className = 'table__row';

  tr.innerHTML = `
    <td class="table__data">${obj['Дата']}</td>
    <td class="table__data">${obj['Абонент']}</td>
    <td class="table__data">${obj['Напр.']}</td>
    <td class="table__data">${obj['Оператор']}</td>
    <td class="table__data">${obj['Длит.']}</td>
    <td class="table__data">${obj['Длит. (окр.)']}</td>
    <td class="table__data">${obj['Номер A']}</td>
    <td class="table__data">${obj['Номер Б']}</td>
    <td class="table__data">${obj['Тариф']}</td>
    <td class="table__data">${obj['Категория']}</td>
    <td class="table__data">${obj['Входящая линия']}</td>
    <td class="table__data">${obj['Исходящая линия']}</td>
    <td class="table__data">${obj['Класс']}</td>
    <td class="table__data">${obj['Причина']}</td>
    <td class="table__data">${obj['Списание']}</td>
  `;

  return tr;
}

function arrObjtoCSV(arrObj) {
  const title = 'Дата' + ';' +
          'Абонент' + ';' +
          'Напр' + ';' +
          'Куда' + ';' +
          'Длит.' + ';' +
          'Минуты' + ';' +
          'Номер А' + ';' +
          'Номер Б' + ';' +
          'Тариф' + ';' +
          'Категория' + ';' +
          'Входящая линия' + ';' +
          'Исходящая линия' + ';' +
          'Оператор' + ';' +
          'Причина' + ';' +
          'Списание' + '\n';
  let string = '';
  string += title;

  for (let obj of arrObj) {
    let data = '';

    data = obj['Дата'] + ';' +
          obj['Абонент'] + ';' +
          obj['Напр.'] + ';' +
          obj['Оператор'] + ';' +
          obj['Длит.'] + ';' +
          obj['Длит. (окр.)'] + ';' +
          obj['Номер A'] + ';' +
          obj['Номер Б'] + ';' +
          obj['Тариф'] + ';' +
          obj['Категория'] + ';' +
          obj['Входящая линия'] + ';' +
          obj['Исходящая линия'] + ';' +
          obj['Класс'] + ';' +
          obj['Причина'] + ';' +
          obj['Списание']  + '\n';

    string += data;
  }

  return string;
}

function date() {
  const date = new Date();
  let result = '';

  result += date.getDate() + '-';
  result += (date.getMonth() + 1) + '-';
  result += date.getFullYear();

  return result;
}

function minutesCount(array) {
  let result = 0;

  for (let obj of array) {
    result += +obj['Длит. (окр.)'];
  }

  return result;
}

function getSort({ target }) {
  const order = (target.dataset.order = -(target.dataset.order || -1));
  const index = [...target.parentNode.cells].indexOf(target);
  const collator = new Intl.Collator(['en', 'ru'], { numeric: true });

  function comparator(index, order) {
    return function(a, b) {
      return order * collator.compare(a.children[index].innerHTML, b.children[index].innerHTML);
    }
  }

  for(const tBody of target.closest('table').tBodies) {
    tBody.append( ...[...tBody.rows].sort( comparator(index, order) ) );
  }

  for(const cell of target.parentNode.cells) {
    cell.classList.toggle('sorted', cell === target);
  }
};
