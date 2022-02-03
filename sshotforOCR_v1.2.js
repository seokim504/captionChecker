
var screenshot = require('desktop-screenshot');

const TelegramBot = require('node-telegram-bot-api');
// const token = '2075724351:AAFxbBw8BF_hoQqXnkdrqwPeXMU-ksGqGZs';  //  @captionChecker
// const chatId = '-737668705';  // @단톡방
const token= '2126794155:AAGp5KFf3Mxz02ms8TFVWS6iKYuBQQiK3JY';    // @test_by_INDIGO
const chatId = 1656535070; // @test_by_INDIGO
const bot = new TelegramBot(token, {polling: true});

async function sshotForOCR(n) {
    setTimeout(function(){
      screenshot('sshotForOCR.png');
    //   console.log(n+'sec later 스크린샷 완료');
  
    }, n*1000);
}

async function sendPng(n) {
    setTimeout(function(){
      bot.sendPhoto(chatId, 'sshotForOCR.png');
    }, (n+0.5)*1000);
}

/*            OCR            */
async function sendOCR() {

  const spawn = require('child_process').spawn; 
  var result = spawn('python', ['LiveOCR.py'], ); 
  result.stdout.on('data', function(data) { 
      console.log(data.toString()); 
  }); 
  result.stderr.on('data', function(data) { 
      console.log(data.toString()); 
  });
}



sshotForOCR(3); // 스크린샷
sendPng(3); // 텔레그램전송

/*       OCR 분석 및 전송       */
setTimeout(function(){
  sendOCR();
},4000);

