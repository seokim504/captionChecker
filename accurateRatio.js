const { func } = require("assert-plus");
const { filter } = require("bluebird");

const fs = require("fs");
const { Iconv } = require("iconv");
const { connected } = require("process");

let mandatoryCode = fs.readFileSync("./mandatory.txt").toString().split(",");

function findParameter(data, value) {
  // console.log("searching : " + value);
  // console.log(data.indexOf("<" + value + ">"));
  // console.log(data.indexOf("</" + value + ">"));

  if (data.indexOf(value) == -1) {
    return " ";
  } else {
    return data.substring(
      data.indexOf("<" + value) + value.length + 1,
      data.indexOf("</" + value + ">")
    );
  }
}

// let requestCode = [];
// havecode.forEach((value, index) => {
//   let startPosi = value.indexOf("<value>", value.indexOf("KR.eventCode"));
//   let endPosi = value.indexOf("</value>", value.indexOf("KR.eventCode"));

//   requestCode.push(value.substring(startPosi + 7, endPosi));
// });

// let filteredApplog = BroadcastText.filter((element) => element.length > 2000);

let BroadcastTextArray = new Array();
let prefix = "<value>"; // 로그파일 방송문안 시작 지점 문자열

// BroadcastText.push(
//   filteredApplog[0].slice(
//     filteredApplog[0].indexOf(prefix) + prefix.length,
//     filteredApplog[0].indexOf("끝.")
//   )
// );

// if (   && (filteredApplog[0].indexOf(prefix) != -1)) {
//   BroadcastText.push(
//     filteredApplog[0].slice(
//       filteredApplog[0].indexOf(prefix) + prefix.length,
//       filteredApplog[0].indexOf("끝.")
//     )
//   );
// }

// console.log(BroadcastText);
// console.log(BroadcastText.length);

// let writeLog = fs.writeFile(
//   "filteredLog.txt",
//   BroadcastText[2],
//   "utf-8",
//   (err) => {
//     if (err) throw err;
//     console.log("the file has been saved!");
//   }
// );

// applog.forEach(function (text) {
//   if (text.indexOf("########## Event Requst Info ##########") == -1) {
//     applog.shift;
//   }
// });

// let vi = [
//   "item1",
//   "item2",
//   "item3",
//   "item4",
//   "item5",
//   "itemA",
//   "itemB",
//   "itemC",
// ];
// console.log(vi);

// let filtered = vi.filter((element) => element !== "itemA");
// console.log(filtered);

let broadcastText =
  "?�� ?��?�� ?��?��권과 강원, 충청, ?���?, 경북 ?�� ?��?�� ?���? �??��?��?��?�� ?�� ?��?���? ?��?�� 교통?�� 증�????? ?���? 결빙?�� ?���? ?��로정체�?? ?��?��?��?�� �?급적 ???중교?��?�� ?��?��?��?���? 바랍?��?��.?�� ?��?��, ?��?��?��?��?�� 미끄?��?���? ?��방을 ?��?�� 차량 ?��?��?��비�?? 구비?��?���?, ?��?�� ?�� 차량?��?��?��?�� 감속 ?�� ?��?��?��?��?�� 만전?�� 기해주시�? 바랍?��?��. ?�� ?��?�� ?��?���? ?��?��?��?�� 빌라, 주택, 복도?��?��?��?��?��?��?�� ?��?���? ?���? ?�� ?��?��물이 조금?�� ?��르도�? ?��?���?�?�? ?��?��?��?���? 바랍?��?��.?�� ?��?��?��?�� ?��?��주의보�?? 발효 중이?�� ?��객선 �? 조업?��?�� ?��??? ?��?��?��?��?�� 각별?�� ?��경써 주시�? 바랍?��?��.?�� ?��?��, ?��?�� ?���? ???�?�? �??��?��?�� 강한 ?��?��?�� �??�� 곳이 ?��겠으?�� ?��별진료소, 건설?��?��, ?���?, 주택�? ?�� ?��?���? �?리�?? ?��?��?��고에 ?��?��?��?���? 바랍?��?��. ?�� ?��?�� ?��?��?��?���??��?�� ?��?��?��?��?��?��?��.  ?��. ";

broadcastText = broadcastText.replace(/o/g, " "); // 방송문안 'o' ?���?
broadcastText = broadcastText.replace(/0/g, " "); // 방송문안 '0' ?���?
broadcastText = broadcastText.replace(/\?/g, " "); // 방송문안 '?' ?���?
broadcastText = broadcastText.replace(/\s/g, ""); // 방송문안 공백 ?���?

// const ocrText1_1 = "로나19 감염 ?��방과 중증, ?���? ?��?��?�� 줄이�? ?��?�� 18?�� ?��?��??? 3차접종이 ?��?��?��?��?��."
// const ocrText1_2 = "?�� 2차접�? 3개월 경과?�� ?��"

// const ocrText2_1 = "�? ?�� ?��?��?��?�� ncvr.kdca.go.kr ?�� �?까운 병의?��?��?�� 3차접종을 받아주시�? 바랍?��?��."
// const ocrText2_2 = "?�� ?��?���?, 카카?��?��?�� ?��?��"

// const ocrText3_1 = "?�� ?��?��?�� ?��?��백신 ?��?�� ?�� ?��?�� ?��종도 �??��?��?��?��."
// const ocrText3_2 = " 0 코로?��19?�� ????�� 면역 ?��?��?�� ?��?�� 빠른 ?��?�� ?��?�� ?��종하?���?"

const ocrText1_1 =
  "�? 결빙?�� ?���? ?��로정체�?? ?��?��?��?�� �?급적 ???중교?��?�� ?��?��?��?���? 바랍?��?��. 0 ?��?��, ?��?��?��?��?�� 미끄?��?���? ?��방을";

const ocrText2_1 =
  "?��출할 경우?��?�� ?���?, 목도�?, 모자, ?���? ?��?���? 체온?�� ?��?��?���? ?���??��?�� ?��?��?��. ?��?�� ?���?, 기억 ?��?��, 방향";

const ocrText3_1 =
  "t, ?��?�� ?���? ???�?�? �??��?��?�� 강한 ?��?��?�� �??�� 곳이 ?��겠으?�� ?��별진료소, 건설?��?��, ?���?, 주택�? ?�� ?��?���? �?리�?? ?��";

// let gapremovedOCR = gapremoveOCR(ocrText1_1);
// let gapremovedOCR = gapremoveOCR(ocrText2_1);
let gapremovedOCR = gapremoveOCR(ocrText3_1);

// console.log(gapremovedOCR);

// findPrefix(broadcastText, gapremovedOCR);

/*       OCR ?���? ?�� ?��르고 공백 ?��?���?              */
function gapremoveOCR(OCRtext) {
  let temp = OCRtext.substr(1, OCRtext.length - 1);
  temp = temp.replace(/0/g, ""); // '0' ?��?���?
  let resultText = temp.replace(/\s/g, ""); // OCR ?���? 공백?��?���?
  return resultText;
}

/* 버려�? �??�� ?�� 리턴 */
function OCRerrorTry(description, textOCR) {
  //
  let Trial = 0;
  for (i = 0; i < textOCR.length; i++) {
    let temp = textOCR[i];
    if (description.indexOf(temp) == -1) {
      Trial = Trial + 1;
    } else {
      break;
    }
  }
  return Trial;
}

/*      OCR?�� �? �??�� 방송문안?��?��?�� INDEX 리턴         */
function findPrefix(description, gapremovedOCR) {
  let resultArray = [];

  console.log("length of OCR pure text :" + gapremovedOCR.length);
  console.log("searcing Text : " + gapremovedOCR[0]);

  indexPrefix = description.indexOf(gapremovedOCR[0]);

  if (indexPrefix == -1) {
    console.log("indexOf: null, 문자?��?�� : " + gapremovedOCR[0]);
    resultArray.push("-1");
    console.log(resultArray);
    return resultArray;
  } else {
    let pos = 0;
    while (true) {
      let foundPos = description.indexOf(gapremovedOCR[0], pos);
      if (foundPos == -1) break;
      resultArray.push(foundPos);
      pos = foundPos + 1;
    }
    return resultArray;
  }
}

/*          방송문안?��?�� gapremoved OCR 문장 ?���? 비교 X Num of Indexs          */

// calc_ratio(broadcastText, gapremovedOCR);

function calc_ratio(description, gapremovedOCR) {
  console.log(gapremovedOCR);
  console.log(description);
  broadcastArr = description.split("");
  let num_index = findPrefix(description, gapremovedOCR); // OCR?�� �? �??�� 방송문안?��?��?�� INDEX 리턴
  let Num_match = [];

  for (n in num_index) {
    let Correspond = 0;
    for (i = 0; i < gapremovedOCR.length; i++) {
      if (broadcastArr[num_index[n] + i] == gapremovedOCR[i]) {
        Correspond++;
      }
    }
    Num_match.push(Correspond);
  }
  console.log(Num_match);
  let maxVlaue = Math.max(...Num_match);
  console.log((maxVlaue / gapremovedOCR.length) * 100 + "%");
}

function compare_str(string1, string2) {
  for (i = 0; i < string1.length; i++) {
    if (string1[i] == string2[i]) {
      Correspond = Correspond + 1;
    }
  }

  return Correspond;
}

/**************************************************/
/*                       MAIN                     */
/**************************************************/

var oldData = "";

setInterval(() => {
  let rawlog = fs.readFileSync("./app.log");
  let Applog = Iconv("EUC-KR", "utf8").convert(rawlog).toString();
  let updateData = "";

  // if (Applog.length > oldData.length) {
  //   updateData = Applog.substring(oldData.length, Applog.length);
  // }
  /***************************/
  updateData = Applog;

  let occurAlert = findParameter(updateData, "alert");
  console.log(occurAlert);

  if ((occurAlert = " ")) {
    console.log("발생된 경고가 없습니다.");
  } else {
    let occurCode = findParameter(occurAlert, "source");
    console.log(occurCode + " 발생.");
  }

  // let BroadcastText = updateData.toString().split("<identifier>");
  // let havecode = [];
  // BroadcastText.forEach((value, index) => {
  //   if (value.indexOf("KR.eventCode") != -1) {
  //     havecode.push(BroadcastText[index]);
  //   }
  //   // console.log(`${value} : ${index}`);
  // });

  // let parameterName = findParameter(havecode, "<value>");
  // console.log(havecode);
  // console.log(havecode.length);

  oldData = Applog;
}, 3000);
