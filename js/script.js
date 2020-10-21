'use strict';

function isCode(num, code) {
  const lengthCode = String(code).length;
  const numCode = +String(num).substring(0, lengthCode);

  return code === numCode;
}
