class ParsATScsv {
  /** Парсер CSV
   * "Дата";"Напр.";"Оператор";"Длит.";"Длит. (окр.)";"Номер A";"Номер Б";"Тариф";"Категория";"Входящая линия";"Исходящая линия";"Класс";"Причина";"Списание";"Валюта"
   " 2016-07-01 07:12:53";"1";"";"00:00:13";"00:00:13";"3499523026";"84957950541";"Не определено";"Не определено";"A1730";"001000021";"Внутренняя связь";"16";"0,00";""
   " 2016-07-01 08:04:49";"1";"";"00:00:51";"00:00:51";"9287692887";"84957950550";"Не определено";"Не определено";"A1729";"001000022";"Внутренняя связь";"16";"0,00";""
   *
   * this.array  Maссив всех звонков
   * this.allCalls Массив объектов всех звонков
   * this.exception = [8495, 8499, 8496, 8800]  Исключение префексов
   * this.psm = ['001000', '001001'] Исходящие потоки
   */

  constructor(string) {
    this.array = this._stringToArray(string);
    this.allCalls = this._allCalls();
    this.exception = [8495, 8499, 8496, 8800];
    this.psm = ['001000', '001001'];
  }

  get callIn() {
    const arr = this.allCalls;

    return arr.filter(arr => {
      return arr['Напр.'] === '0';
    });
  }

  get callOut() {
    const arr = this.allCalls;
    const exception = this.exception;

    if (exception.length !== 0) {
      return arr.filter(arr => {
        const psmBull = this._psmOut(arr['Исходящая линия'], this.psm);

        if (psmBull) {
          for (let pref of exception) {
            if ( this._isCode(arr['Номер Б'], pref) ) {
              return false;
            }
          }
          return true;
        }
      });
    } else {
      return arr.filter(arr => {
        const psmBull = this._psmOut(arr['Исходящая линия'], this.psm);

        return psmBull;
      });
    }
  }

  get test() {
    const arr = this.callOut;

    return arr.filter(arr => {

      return arr['Входящая линия'].length > 5;
    });
  }

  _allCalls() {
    const arrNames = this.array[0];
    const array = this.array;
    const result = [];

    array.splice(0, 1);

    for (let arr of array) {
      const obj = {};
      for (let i = 0; i < arr.length; i++) {
        obj[arrNames[i]] = arr[i];
      }

      result.push(obj);
    }

    return result;
  }

  _stringToArray(string) {
    const result = [];
    const arr = string.split('\n');

    for (let csv of arr) {
      result.push( this._csvToArray(csv) );
    }

    return result;
  }

  _csvToArray(stringCsv) {
    return stringCsv.replaceAll('"', '').trim().split(';');
  }

  _isCode(num, code) {
    const lengthCode = String(code).length;
    const numCode = String(num).substring(0, lengthCode);

    return String(code) === numCode;
  }

  _strToSeconds(str) {
    const arr = str.split(':');

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    return (+arr[0]) * 60 * 60 + (+arr[1]) * 60 + (+arr[2]);
  }

  _psmOut(outLine, psmArr) {
    for (let psm of psmArr) {
      if ( this._isCode(outLine, psm) ) {
        return true;
      }
    }
    return false;
  }
}
