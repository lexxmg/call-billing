class ParsAbonCsv {
  constructor(string) {
    this.array = this._stringToArray(string);
    this.abonents = this._abonentsObj();
  }

  _abonentsObj() {
    const arrNames = ['phoneNumber', 'bonentName'];
    const array = this.array;
    const result = [];

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
