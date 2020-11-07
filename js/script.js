'use strict';

const inputFile = document.querySelector('.form__item');

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
    console.log(callOut);
    console.table(callOut);
  });

  reader.addEventListener('error', () => {
    console.log('файл не прочитан ' + reader.error);
  });
});
