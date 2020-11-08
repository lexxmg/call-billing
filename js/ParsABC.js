class ParsABC {
  constructor(string) {
    this.array = this._stringToArray(string);
    this.objPref = this._objPref();
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

  _objPref() {
    const arrNames = ['abc', 'start', 'end', 'count', 'prov', 'RegionName'];
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
}
