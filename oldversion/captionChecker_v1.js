var fs = require('fs');
const { indexOf, stubString } = require('lodash');
const path = "C:/Users/seong-minkim/AppData/Roaming/udms/logs/2021/";
var screenshot = require('desktop-screenshot');

const TelegramBot = require('node-telegram-bot-api');
const token = '2075724351:AAFxbBw8BF_hoQqXnkdrqwPeXMU-ksGqGZs';
const chatId = '1656535070';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


// var PDFImage = require('pdf-image').PDFImage;


function sendToimage() {
  bot.sendPhoto(chatId, 'screenshot.png');
}



/*      재난코드 불러오기       */
const file_csv = fs.readFileSync('./dis_code.csv');
const string_csv = file_csv.toString();


/*      재난코드 줄바꿈 위치(/n) 배열에 저장(csvPosi)      */
var csvPosi = [];
var posi = 0;
while(true){
  var foundPosi = string_csv.indexOf('\n', posi);
  if (foundPosi == -1) break;
  csvPosi[csvPosi.length] = foundPosi;
  posi = foundPosi +1;
} csvPosi.unshift(0);


/*      재난코드 줄바꿈 위치 기준으로 나누기     */
var csvLine = [];
for (i = 0; i< csvPosi.length -1 ;i++) {
  csvLine[i] = string_csv.slice(csvPosi[i],csvPosi[i+1]);
}


/*      의무 코드 불러오기 (.txt)       */
const mandatory_code = fs.readFileSync('./mandatory.txt').toString().split(',');


function filePicker(){
/*      path내 로그파일 불러오기     */
  var files = [];
  var filelist = fs.readdirSync(path, function(err, items){
    if(err) return;
    for(let item of items) {
      files[files.length] = item;
      }
    return files;
  });


  /*       파일정렬 내림차순      */
  filelist.sort(function(a, b) {
    const upperCaseA = a.toUpperCase();
    const upperCaseB = b.toUpperCase();
    if(upperCaseA < upperCaseB) return 1;
    if(upperCaseA > upperCaseB) return -1;
    if(upperCaseA === upperCaseB) return 0;
  });
  // 최종 불러낼 파일 : filelist[0]

  return filelist[0];
}


var oldFile = '';
var oldData = '';

function toTelegram() { 
  setInterval(() => {
    /*      로그 파일(전체) 불러오기       */
    var file = filePicker();
    var data = fs.readFileSync(path + file,'utf8', (err,data)=>{
    });


    /*      로그 파일이 바뀌었다면      */
    if (oldFile != file){
      console.log('파일이 바뀌었습니다:'+file);
      oldFile = file;
      oldData = ''; // Data 초기화
    }


    /*      로그 파일 업데이트 부분 불러오기        */
    var updatedData = '';
    if (oldData !== data){
      updatedData = data.substr(oldData.length, (data.length - oldData.length));
      // console.log(updatedData);
      oldData = data;
    }


    /*      로그 파일(전체)과 의무코드 비교     */
    // for ( var i in mandatory_code){
    //   if (data.indexOf(mandatory_code[i]) != -1){
    //     // console.log(mandatory_code[i]); // 의무코드명 
    //     // console.log(data.indexOf(mandatory_code[i])); // data내 의무코드 index확인
    //     console.log(data.substr(data.indexOf(mandatory_code[i]),mandatory_code[i].length)); // data내 의무코드 index로 출력
    //   }


    /*      로그 파일 업데이트 부분과 의무코드 비교     */
    var mdt_massage = '';
    for ( var i in mandatory_code){
      if (updatedData.indexOf(mandatory_code[i]) != -1){
        console.log('의무코드 포함:'+updatedData); // 최종 텔레그램에 전송할 Trigger
        mdt_massage = updatedData;

        /*      이벤트 발생시 스크린 샷      */
        screenshot('screenshot.png', function(error, complete) {
          if(error)
              console.log("Screenshot failed", error);
          else
              console.log("Screenshot succeeded");
        });
        
        setTimeout(sendToimage, 1000);

        /*      전송할 pdf 파일 생성      */
        // var PDFImage = require("pdf-image").PDFImage;
        // var pdfImage = new PDFImage("slide.pdf", {
        //   combinedImage: true
        // });

        // pdfImage.convertFile().then(function (imagePaths) {
        //   fs.existsSync("screenshot.png") // => true

        //      // /tmp/slide.png 
        //     });
        

        
        // bot.sendMessage(chatId, updatedData).then(bot.sendPhoto(chatId, 'screenshot.png'));


        // bot.sendPhoto(chatId, 'screenshot copy.png');


        // bot.sendPhoto(chatId, open('./screenshot.png','rb'));
        // bot.sendDocument(chatId, "screenshot.pdf");


      }
    }
    return mdt_massage;
  }, 3000);

}

toTelegram();

module.exports ={
  toTelegram
}