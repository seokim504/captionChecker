//KMP 알고리즘
// const { match } = require("assert");
// const { result } = require("lodash");

let broadcastText = "○ 코로나19 백신 3차접종 관련 안내입니다. ○ 코로나19 감염 예방과 중증, 사망 위험을 줄이기 위해 18세 이상은 3차접종이 필요합니다.○ 2차접종 3개월 경과 시 사전예약 ncvr.kdca.go.kr 후 가까운 병의원에서 3차접종을 받아주시기 바랍니다.○ 네이버, 카카오톡을 통하여 잔여백신 예약 시 당일 접종도 가능합니다.○ 코로나19에 대한 면역 획득을 위해 빠른 시일 내에 접종하시기 바랍니다.○ 이상 질병관리청에서 알려드렸습니다.  끝. ";
broadcastText = broadcastText.replace(/○/g,' '); // 방송문안 'o' 제거
broadcastText = broadcastText.replace(/\s/g,''); // 방송문안 공백 제거
let broadcastArr = broadcastText.split('');

// const ocrText1_1 = "로나19 감염 예방과 중증, 사망 위험을 줄이기 위해 18세 이상은 3차접종이 필요합니다."
// const ocrText1_2 = "○ 2차접종 3개월 경과시 사"

// const ocrText2_1 = "과 시 사전예약 ncvr.kdca.go.kr 후 가까운 병의원에서 3차접종을 받아주시기 바랍니다."
// const ocrText2_2 = "○ 네이버, 카카오톡을 통하"

// const ocrText3_1 = "을 통하여 잔여백신 예약 시 당일 접종도 가능합니다."
// const ocrText3_2 = " 0 코로나19에 대한 면역 획득을 위해 빠른 시일 내에 접종하시기"



const ocrText1_1 = "코로나19 백신 3차접종 관련 안내입니다."
const ocrText1_2 = ""

const ocrText2_1 = "입니다. 코로나19 감염 예방과 중증, 사망 위험을 줄이기 위해 18세 이상은 3차접종이 필요합니다.○ 2차접종 3개월"
const ocrText2_2 = ""

const ocrText3_1 = "종 3개월 경과 시 사전예약 ncvr.kdca.go.kr 후 가까운 병의원에서 3차접종을 받아주시기 바랍니다.○ 네이버, 카카오"
const ocrText3_2 = ""




// let gapremovedOCR = gapremoveOCR(ocrText1_1);
// let gapremovedOCR = gapremoveOCR(ocrText1_2);
// let gapremovedOCR = gapremoveOCR(ocrText2_1);
// let gapremovedOCR = gapremoveOCR(ocrText2_2);
let gapremovedOCR = gapremoveOCR(ocrText3_1);
// let gapremovedOCR = gapremoveOCR(ocrText3_2);    // -1

// console.log(gapremovedOCR);

// findPrefix(broadcastText, gapremovedOCR);





/*       OCR 양쪽 끝 자르고 공백 없애기              */
function gapremoveOCR (OCRtext) {
    let temp = OCRtext.substr(1, OCRtext.length-1);
    let resultText = temp.replace(/\s/g, ''); // OCR 정보 공백없애기
    return resultText;
}


/* 버려진 글자 수 리턴 */ 
function OCRerrorTry(description, textOCR){ //
    let Trial = 0;
    for (i=0; i < textOCR.length; i++){
        let temp = textOCR[i];
        if (description.indexOf(temp) == -1) {
            Trial = Trial +1;
        } else {
            break;
        }
    }
    return Trial;
}

/*      OCR의 첫 글자 방송문안에서의 INDEX 리턴         */
function findPrefix(description, gapremovedOCR){
    let resultArray = [];

    console.log("length of OCR pure text :" +gapremovedOCR.length);
    console.log("searcing Text : " +gapremovedOCR[0]);

    indexPrefix = description.indexOf(gapremovedOCR[0]);

    if (indexPrefix == -1){
        console.log("indexOf: null, 문자내용 : "+gapremovedOCR[0]);
        resultArray.push("-1");
        console.log(resultArray);
        return resultArray;
    } else{
        let pos = 0;
        while(true) {
            let foundPos = description.indexOf(gapremovedOCR[0], pos);
            if(foundPos == -1) break;
            resultArray.push(foundPos)
            pos = foundPos + 1;
        }
        return resultArray;
    }
}

/*          방송문안에서 gapremoved OCR 문장 전체 비교 X Num of Indexs          */

calc_ratio(broadcastText, gapremovedOCR)

function calc_ratio (description, gapremovedOCR){
    console.log(gapremovedOCR);
    console.log(description);
    broadcastArr = description.split('');
    let num_index = findPrefix(description, gapremovedOCR); // OCR의 첫 글자 방송문안에서의 INDEX 리턴
    let Num_match = []

    for (n in num_index){
        let Correspond = 0;
        for (i=0; i<gapremovedOCR.length; i++){
            if( broadcastArr[num_index[n]+i] == gapremovedOCR[i]){
                Correspond++;
            }
        }
        Num_match.push(Correspond);
    }
    console.log(Num_match)
    let maxVlaue = Math.max(...Num_match)
    console.log((maxVlaue/gapremovedOCR.length)*100+'%')

}

function compare_str (string1, string2) {
    for (i=0; i < string1.length; i++){
        if(string1[i] == string2[i]){
            Correspond = Correspond +1;
        }
    }

    return Correspond;
}
