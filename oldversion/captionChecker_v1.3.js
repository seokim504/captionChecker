var fs = require('fs');
const path = "C:/Users/seong-minkim/AppData/Roaming/udms/logs/2021/";
//seong-minkim -> user name 으로 대체 필요



var screenshot = require('desktop-screenshot');

const TelegramBot = require('node-telegram-bot-api');
const token = '2075724351:AAFxbBw8BF_hoQqXnkdrqwPeXMU-ksGqGZs';
const chatId = '1656535070';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

var screencap = require('screencap');
// const { SourceMap } = require('module');


function sendToimage() {
  bot.sendPhoto(chatId, 'screenshot.png');
}

function sendTogif() {
  bot.sendAnimation(chatId, 'screenshot.gif');
}

/*      의무 코드 불러오기 (.txt)       */
const mandatory_code = fs.readFileSync('./mandatory.txt').toString().split(',');



/*      최신 로그파일 선택      */
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



/*                Main Code               */
function toTelegram() { 
  setInterval(() => {

    /*      큐(배열) 생성     */ 
    var cue = [];

    /*      로그 파일(전체) 불러오기       */
    var file = filePicker();
    var data = fs.readFileSync(path + file,'utf8', (err,data)=>{
    });

    /*      로그 파일(전체) 복사      */
    // var strdatetime = new Date().toString();
    // if ( fs.existsSync(path + '../copyData/') == 0){
    //   fs.mkdirSync(path + '../copyData/');
    // }

    // fs.copyFileSync(path + file, path+'../copyData/'+strdatetime.slice(11,24)+'.txt', (err) => {    // error!
    //   if (err) throw err;
    //   console.log('source was copied to destination');
    // });


    /*      로그 파일이 바뀌었다면      */
    if (oldFile != file){
      console.log('날짜가 바뀌었습니다 : '+file);
      oldFile = file;
      oldData = ''; // Data 초기화
    }


    /*      로그 파일 업데이트 부분 불러오기        */
    var updatedData = '';
    if (oldData !== data){
      updatedData = data.substr(oldData.length, (data.length - oldData.length));
      // console.log(updatedData);
      oldData = data;

      /*      큐 추가     */
      cue.push(updatedData);

    }



    /*      로그 파일 업데이트 부분 배열로 저장     */
    // var updatedDataArr = updatedData.split('\n');






    /*      로그 파일 업데이트 부분과 의무코드 비교     */
    for ( var i of mandatory_code){
      var suffix = '_'+i+'_';

      /*      의무코드 발생시      */
      if (updatedData.indexOf(suffix) != -1){
        console.log(' 의무코드 '+ i +' 가 발생하였습니다.');
        
        /*      스크린 샷(png, gif) 및 텔레그램전송       */
        screenshot('screenshot.png', function(error, complete) {
          if(error)
              console.log("Screenshot failed", error);
          else
              console.log("Screenshot succeeded");
        });

        var screen = screencap('screenshot.gif');
        screen.gif('1080','5'); // resolution, duration of gif
        

        setTimeout(sendToimage, 1000);        
        setTimeout(sendTogif, 6000);


      }
    }

    // return mdt_massage;

    
  }, 3000);
}

toTelegram();


// module.exports ={
//   toTelegram
// }