class ParsATScsv {
  /** Парсер CSV 
   *
   *
   * this.array  Maссив всез звонков
   * this.allCalls Массив объектов всех звонков
   *
   *
   */

  constructor(string) {
    this.array = this._stringToArray(string);
    this.allCalls = this._allCalls();
  }

  get callIn(){
    const arr = this.allCalls;

    return arr.filter(arr => {
      return arr['Напр.'] === '0';
    });
  }

  get callOut(){
    const arr = this.allCalls;

    return arr.filter(arr => {
      return arr['Напр.'] === '1';
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
}
