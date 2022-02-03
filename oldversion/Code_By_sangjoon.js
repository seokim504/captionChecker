////telegram

const TelegramBot = require('node-telegram-bot-api');

const screenshot = require('screenshot-desktop');
// absolute paths work too. so do pngs

//screenshot

function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
  }
function sleep(n) {
    msleep(n*1000);
  }





// replace the value below with the Telegram token you receive from @BotFather
const token = '1095139091:AAFvqn-Lnb_dqKzvB4vFI-OJe5gU0Qc3Rfk';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token);


/////

  



let iconv = require('iconv-lite');
const { setNonEnumerableProperties } = require('got/dist/source');

//var encode = new Iconv('euc-kr', 'utf-8');

var savelist = [];
var mandatoryList = [];

//var path = "C:/Users/peter/AppData/Roaming/udms/logs/2021/"
var path = "C:/Users/korea/AppData/Roaming/udms/logs/2021/"

var today = ""

function nowdate(){
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    var temptoday = year + month + date

    console.log("Today : " + temptoday)
    if (temptoday != today) today = temptoday

}

function initialize(){
    var fs = require("fs");
    fs.readFile('./mandatory.txt','utf8' ,function(err,data){
        console.log("=========mandatory list==========")
        //console.log(data)
        mandatoryList = data.split(',')
        mandatoryList.forEach(function(element){
            console.log(element)
        });          
             
    })
}

function read(){

    nowdate();
    
    var finalpath = path + today + '.log';

    console.log("finalpath : " + finalpath);

    var fs = require("fs");
    
    fs.readFile( finalpath,function(err,data){//Reading file Asynchronously

      console.log("=========savelist=========")
      console.log(savelist)
      
      if(!err) {

          let utf8Str = iconv.decode(data, 'euc-kr');

          //var kr = encode.convert(data);
          var logarray = utf8Str.toString().split('\n')  
          logarray.forEach(function(element){
            //console.log(element)
            if (element.includes("문서의 수신일자를 업데이트 합니다.") 
                && !element.includes("DSTR")){
                  temparray = element.split('KR')
                  eventarray = temparray[1].split(' ')
                  
                  //whether mandatory or not according to eventCode
                  eventCode = eventarray[0].split('_')

                  
                  if(!savelist.includes(eventarray[0])){ 
                  
                    console.log(eventarray[0])

                    var message = "";

                    if(mandatoryList.includes(eventCode[1])){
                        message = "***의무전송 입니다***\n" + eventarray[0]
                    }else{
                        message = "의무전송이 아닙니다\n" + eventarray[0]
                    }
                    
                    bot.sendMessage('439074326', 'KMA : ' + message)
                      
                      screenshot({ filename: './demodd.png' });

                      sleep(5);

                      bot.sendPhoto('439074326', "./demodd.png", { caption: 'image' });  
                    
                      savelist.push(eventarray[0]);

                  }
                  
              } 
            })
          //console.log(kr.toString());


      }
    });
/*
    // Close the file descriptor
    fs.close(file_descriptor, (err) => {
      if (err)
        console.error('Failed to close file', err);
      else {
        console.log("\n> File Closed successfully");
      }
    });*/
    //console.log("something else");
}

initialize()
read()
setInterval(read, 3000,)