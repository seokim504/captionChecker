const fs = require('fs');
const { doesNotThrow } = require('assert');
var screenshot = require('desktop-screenshot');

const TelegramBot = require('node-telegram-bot-api');
// const token = '2075724351:AAFxbBw8BF_hoQqXnkdrqwPeXMU-ksGqGZs';  //  @captionChecker
// const chatId = '-737668705';  // @단톡방
const token = '2126794155:AAGp5KFf3Mxz02ms8TFVWS6iKYuBQQiK3JY'; // @test_by_INDIGO
const chatId = 1656535070; // @test_by_INDIGO
// const bot = new TelegramBot(token, { polling: true });
const bot = new TelegramBot(token);
// const bot = new TelegramBot(token);

today = '';
function nowTime() {
  let date_raw = new Date();
  // current date
  // adjust 0 before single digit date
  let date = ('0' + date_raw.getDate()).slice(-2);

  // current month
  let month = ('0' + (date_raw.getMonth() + 1)).slice(-2);

  // current year
  let year = String(date_raw.getFullYear()).slice(-2);
  let temptoday = year + month + date;

  let nowHours = ('0' + date_raw.getHours()).slice(-2);
  let nowMinutes = ('0' + date_raw.getMinutes()).slice(-2);
  let nowSeconds = ('0' + date_raw.getSeconds()).slice(-2);

  let nowHMS = String(nowHours) + String(nowMinutes) + String(nowSeconds);

  if (temptoday != today) today = temptoday;

  return temptoday + nowHMS;
}

/********* 텔레그램 관련 function *********/
// const path_image = 'c:\\Nodejs\\captionChecker\\images\\';
const path_image = 'D:\\Coder\\captionChecker\\images\\';
async function sshotForOCR(n, pngname) {
  setTimeout(function () {
    screenshot(path_image + 'sshot_' + pngname + '.png');
  }, n * 1000);
}

async function sendPng(n, pngname) {
  setTimeout(function () {
    bot
      .sendPhoto(chatId, path_image + 'sshot_' + pngname + '.png')
      .catch((e) => {
        console.log(e);
      });
    // bot
    //   .sendMessage(chatId, '스샷 전송완료')
    //   .then(() => {
    //     process.exit();
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  }, (n + 2) * 1000);
}

/*            OCR            */
// async function sendOCR() {

//   const spawn = require('child_process').spawn;
//   var result = spawn('python', ['LiveOCR.py'], );
//   result.stdout.on('data', function(data) {
//       console.log(data.toString());
//   });
//   result.stderr.on('data', function(data) {
//       console.log(data.toString());
//   });
// }

/********************** Main Code **********************/

/*       1. 자바클라이언트 로그 분석     */
// captionChecker_v2.3.js 로 상시 분석

/*       2. 스샷 및 텔레그램 전송       */
let yymmddhhmmss = nowTime();
let pngname = 'sshot_' + yymmddhhmmss.slice(2);
sshotForOCR(3, pngname);
sendPng(3, pngname);

/*       3. OCR 분석                   */
// setTimeout(function(){
//   sendOCR();
// },4000);

/*       4. 방송문안 일치율 계산        */
