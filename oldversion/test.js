const { createWorker } = require('tesseract.js');

const worker = createWorker();

const rectangle = { left: 0, top: 980, width: 1920, height: 26 };


(async () => {
  await worker.load();
  await worker.loadLanguage('kor');
  await worker.initialize('kor');
//   const { data: { text } } = await worker.recognize('./screenshot.png');
  const { data: { text } } = await worker.recognize('./screenshot.png',  { rectangle });
  // const { data: { text } } = await worker.recognize('./screenshot.png');

  console.log(text);
  await worker.terminate();
})();
