
class ParsMNcsv {
  /**
   * Направление;Код страны;Коды региона;Стоимость, руб./мин. (без учета НДС)
   * Абхазия;7;840;12,83
   * Абхазия, Moб, A-Mobile;7;9407;16,93
   * Абхазия, Moб, Others;7;940;17,41
   * Абхазия, Моб, Aquafon;7;9409;16,93
   * Абхазия, Сухуми;7;840222,840223,840226,840229;14,51
   * Австралийская Антарктическая Территория;672;;90,88
   * Австралия;61;;0,70
   *
   *
   *
   *
   */
  constructor(string) {
    this.array = this._stringToArray(string);
    this.objectMN = this._arrToObject();
    this.stringCsv = string;
    this.mn = this._combine();
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

  _arrToObject() {
    const arrNames = ['nameCountry', 'prefCountry', 'prefRegion', 'cost'];
    const array = this.array;
    const result = [];

    array.splice(0, 1);

    for (let arr of array) {
      const obj = {};
      for (let i = 0; i < arr.length; i++) {
        obj[arrNames[i]] = arr[i];
      }
      obj.prefRegion = obj.prefRegion.split(',');

      result.push(obj);
    }

    return result;
  }

  _combine() {
    const arrObj = this.objectMN;
    const result = [];

    for (let obj of arrObj) {
      if (obj.prefRegion[0] !== '') {
        for (let pref of obj.prefRegion) {
          const newObj = {};
          newObj.nameCountry = obj.nameCountry;
          newObj.combine = '10' + obj.prefCountry + pref;
          newObj.cost = obj.cost;

          result.push(newObj);
        }
      } else {
        const newObj = {};
        newObj.nameCountry = obj.nameCountry;
        newObj.combine = '10' + obj.prefCountry;
        newObj.cost = obj.cost;

        result.push(newObj);
      }
    }

    return result;
  }
}
