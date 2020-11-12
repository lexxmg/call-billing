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
    const arrNames = ['abc', 'start', 'end', 'count', 'prov', 'RegionName', 'cost'];
    const array = this.array;
    const result = [];

    array.splice(0, 1);

    for (let arr of array) {
      const obj = {};

      if (arr.length !== arrNames.length) {
        arr.push('0');
      }

      for (let i = 0; i < arr.length; i++) {
        obj[arrNames[i]] = arr[i];
      }

      if ( String(obj.start).length < 7 ) {
        obj.start = this._addZeros(obj.start, 7);
      }

      if ( String(obj.end).length < 7 ) {
        obj.end = this._addZeros(obj.end, 7);
      }

      if (obj.cost === '') {
        obj.cost = '0';
      }

      result.push(obj);
    }

    return result;
  }

  _addZeros(num, numLength) {
    const str = String(num);
    const strLength = str.length;
    const countZero = numLength - strLength;

    let arr = str.split('');

    for (let i = 0; i < countZero; i++) {
      arr.unshift('0');
    }

    return arr.join('');
  }
}
