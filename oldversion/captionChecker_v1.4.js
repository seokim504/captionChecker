var fs = require('fs');
// const path = "C:/Users/seong-minkim/AppData/Roaming/udms/logs/2021/";
const path = "C:/Users/PKLNS/AppData/Roaming/udms/logs/2021/";

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
// const { send } = require('process');
// const { SourceMap } = require('module');


function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
  msleep(n*1000);
}

function sendPng() {
  bot.sendPhoto(chatId, 'screenshot.png');
}

// function sendGif() {
//   bot.sendAnimation(chatId, 'screenshot.gif');
// }

/*      의무 코드 불러오기 (.txt)       */
const mandatory_code = fs.readFileSync('./mandatory.txt').toString().split(',');

/*      스크린샷 폴더 생성        */
// if ( fs.existsSync(path + '../screenshot/') == 0){
//   fs.mkdirSync(path + '../screenshot/');
// }


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


var updatedData = '';
var cue = [];

function codeChecker(data){

  /*      로그 파일 중 업데이트 부분       */
  if (oldData !== data){
    updatedData = data.substr(oldData.length, (data.length - oldData.length));
    oldData = data;
    console.log(updatedData);
  } else{
    updatedData = '';
    console.log('변동된 로그가 없습니다.');
  }
  
  /*      로그 파일 업데이트 부분과 의무코드 비교     */
  for ( var i of mandatory_code){
    var suffix = '_'+i+'_';

    /*       의무코드 발생시        */
    if (updatedData.indexOf(suffix) != -1){
      console.log(' 의무코드 '+ i +' 가 발생하였습니다.');

      /*      큐 추가       */
      cue.push(updatedData);
      console.log(cue);
    }
  }
}

function proccessingCue(){
  if (cue.length == 0) {
    return 0;
  } else if (cue.length > 0 && sec_interval == 0 ) {
    sleep(5);
    screenshot('screenshot.png', function(error, complete) {
      if(error)
          console.log("Screenshot failed", error);
      else
          console.log("Screenshot succeeded");
    });
    // setTimeout(secDecade,sendPng());

  }
}

function toConsole() {
  sec_interval = sec_interval + 180000; // 3분 [인터벌] 설정
  console.log('스크린샷이 전송되었습니다.');
  cue.shift();
}


var oldFile = '';
var oldData = '';
var sec_interval = 0;

/*                Main Code               */
// function pollingLog() { 
  setInterval(() => {

    /*      로그 파일(전체) 불러오기       */
    var file = filePicker();
    var data = fs.readFileSync(path + file,'utf8', (err,data)=>{
    });


    /*      로그 파일이 바뀌었다면      */
    if (oldFile != file){
      console.log('로그파일이 바뀌었습니다 : '+file);
      oldFile = file;
      oldData = ''; // Data 초기화
    }


    codeChecker(data); // 의무코드 확인 & 큐 적재
    console.log(cue.length+', sec_interval: '+sec_interval);
    proccessingCue(); // 큐 적재 확인 
 
    if (sec_interval == 0 && cue.length > 0) {
      toConsole();        
      setTimeout(sendPng, 1000);

    }

    if (sec_interval != 0) {sec_interval = sec_interval - 5000}
  }, 5000);
// }




// pollingLog();


//     /*      로그 파일 업데이트 부분 배열로 저장     */
//     // var updatedDataArr = updatedData.split('\n');



        
//         /*      스크린 샷(png, gif) 및 텔레그램전송       */
//         screenshot('screenshot.png', function(error, complete) {
//           if(error)
//               console.log("Screenshot failed", error);
//           else
//               console.log("Screenshot succeeded");
//         });

//         var screen = screencap('screenshot.gif');
//         screen.gif('1080','5'); // resolution, duration of gif
        

//         setTimeout(sendPng, 1000);        
//         setTimeout(sendGif, 6000);


//       }
//     }

//     // return mdt_massage;

    
//   }, 10000);
// }

// toTelegram();


// module.exports ={
//   toTelegram
// }