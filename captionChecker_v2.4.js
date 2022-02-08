var fs = require("fs");
// const path = 'C:/Users/seong-minkim/AppData/Roaming/udms/logs/2021/';
const path = "D:\\Coder\\captionChecker\\Logs\\2022\\";

// const path = "C:/Users/PKLNS/AppData/Roaming/udms/logs/2021/";
//seong-minkim -> user name 으로 대체 필요
// var screenshot = require('desktop-screenshot');
const TelegramBot = require("node-telegram-bot-api");
// const token = '2075724351:AAFxbBw8BF_hoQqXnkdrqwPeXMU-ksGqGZs';  //  @captionChecker
// const chatId = '-737668705';  // @단톡방
const token = "2126794155:AAGp5KFf3Mxz02ms8TFVWS6iKYuBQQiK3JY"; // @test_by_INDIGO
const chatId = 1656535070; // @test_by_INDIGO

// Create a bot that uses 'polling' to fetch new updates
// const bot = new TelegramBot(token, { polling: true });
const bot = new TelegramBot(token);

bot.onText(/\/run/, (msg) => {
  screenshot("sshot_1sec_later.png");
  console.log("run 스크린샷 완료");
  setTimeout(function () {
    bot.sendPhoto(chatId, "./sshot_1sec_later.png");
    console.log("run 스크린샷 텔레그램 전송");
  }, 1000);
});

/*      의무 코드 불러오기 (.txt)       */
const mandatory_code = fs.readFileSync("./mandatory.txt").toString().split(",");

/*      최신 로그파일 선택      */
function filePicker() {
  /*      path내 로그파일 불러오기     */
  var files = [];
  var filelist = fs.readdirSync(path, function (err, items) {
    if (err) return;
    for (let item of items) {
      files[files.length] = item;
    }
    return files;
  });

  /*       파일정렬 내림차순      */
  filelist.sort(function (a, b) {
    const upperCaseA = a.toUpperCase();
    const upperCaseB = b.toUpperCase();
    if (upperCaseA < upperCaseB) return 1;
    if (upperCaseA > upperCaseB) return -1;
    if (upperCaseA === upperCaseB) return 0;
  });
  // 최종 불러낼 파일 : filelist[0]

  return filelist[0];
}

async function getData(file) {
  var data = fs.readFileSync(path + file, "utf8", (err, data) => {});

  /*      로그 파일 중 업데이트 부분       */
  if (oldData !== data) {
    updatedData = data.substr(oldData.length, data.length - oldData.length);
    oldData = data;
    // console.log(data);
  } else {
    updatedData = "";
  }

  return updatedData;
  // return data;
}

/*        의무코드와 data비교       */
async function compareCode() {
  for (var i of mandatory_code) {
    var suffix = "_" + i + "_";

    /*       의무코드 발생시        */
    if (updatedData.indexOf(suffix) != -1) {
      console.log(" 의무코드 " + i + " 가 발생하였습니다.");

      /*      텔레그램 메세지 전송  */
      bot.sendMessage(chatId, "***의무코드(" + i + ")가 수신되었습니다.***");

      /*      OCR 결과 분석        */

      /*      OCR 결과 분석        */
    }
  }
}

/******************************  MAIN CODE  ******************************/
/* setInterval => 의무코드 발생 시,
1) 로그파일 로드
2) 바뀐부분 데이터 로드 : period(3초)
3) 로그 비교
4) 의무코드 발생 시, 텔레그램 메세지 전송
*/

var oldFile = "";
var oldData = "";

setInterval(() => {
  /****       Log Data(전체) 불러오기       ****/
  var file = filePicker();

  /*      로그 파일이 바뀌었다면      */
  if (oldFile != file) {
    console.log("로그파일이 바뀌었습니다 : " + file);
    oldFile = file;
  }

  /*      로그파일 중 바뀐부분 data 읽어오기      */
  var data = getData(file);

  /*      의무코드 와 비교        */
  compareCode(data);
}, 3000);
