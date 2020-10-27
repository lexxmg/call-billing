'use strict';



// let strToArr = strExample.split('\n');
// strToArr[2].split(';')[5].replaceAll('"', '').trim();

let arr = strToArr(strExample);
let result = [];

for (let i = 1; i < arr.length; i++) {
  result.push( new Subscribers(arr, arr[i]) );
}

for (let obj of result) {
  let numA = obj['Номер A'];

  if ( isCode(numA, 926935) ) {
    //console.log( numA );
    obj.userName = 'lexx';
    console.log(obj);
    console.log(obj.userName);
  }

  if ( isCode(numA, 916950) ) {
    //console.log( numA );
    obj.userName = 'pasha';
    console.log(obj);
    console.log(obj.userName);
  }
}

//const users = new Subscribers(arr, arr[2]);

function Subscribers(arr, arrNext) {
  let result = [];
  const nameArr = arr[0];

  for (let i = 0; i < nameArr.length; i++) {
    this[nameArr[i]] = arrNext[i];
  }
}


function strToArr(str) {
  const arr = str.split('\n');
  let result = [];

  for (let i of arr) {
    let array = i.replaceAll('"', '').trim().split(';');
    result.push(array);
  }

  return result;
}

function isCode(num, code) {
  const lengthCode = String(code).length;
  const numCode = +String(num).substring(0, lengthCode);

  return code === numCode;
}
