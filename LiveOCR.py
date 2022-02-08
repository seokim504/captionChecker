import requests
import uuid
import time
import json
import base64


import telegram

# bot = telegram.Bot(token='2126794155:AAGp5KFf3Mxz02ms8TFVWS6iKYuBQQiK3JY') # test_by_INDIGO
# chat_id = 1656535070 # test_by_INDIGO
bot = telegram.Bot(token='2075724351:AAFxbBw8BF_hoQqXnkdrqwPeXMU-ksGqGZs')
chat_id = -737668705

api_url = 'https://666a7d48980c40908dd9352a32f81d6f.apigw.ntruss.com/custom/v1/12802/b3dca6aaf72e6a1d47cf4ed50e8738a00cca6d778ccbefebbe784df50792312f/infer'
secret_key = 'YXJUSnNVYlh1U0ZVR0ZjcnRKQ2JMdmp2YWxldEtydG0='

image_file = 'sshotForOCR.png'

with open(image_file,'rb') as f:
    file_data = f.read()

request_json = {

    'images': [
        {
            'format': 'png',
            'name': 'sshotForOCR',
            'data': base64.b64encode(file_data).decode()
            # 'url': image_url
        }


    ],
    'requestId' : str(uuid.uuid4()),
    'version' : 'V2',
    'timestamp' : int(round(time.time() * 1000))
}

# payload = {'message': json.dumps(request_json).encode('UTF-8')}
# headers = {
#     'X-OCR-SECRET': secret_key
# }


payload = json.dumps(request_json).encode('UTF-8')
headers = {
  'X-OCR-SECRET': secret_key,
  'Content-Type': 'application/json'
}


# response = requests.request("POST", api_url, headers=headers, data = payload, files=file)
response = requests.request("POST", api_url, headers=headers, data = payload)


result = response.text.encode('utf8')
result_json = json.loads(result.decode('utf8').replace("'",'"'))
result_valid = result_json['images'][0]['inferResult']

tm = time.localtime(time.time())
f = open('Log_OCR.txt', 'a')

if result_valid == 'FAILURE' :
    result_txt = 'OCR분석 실패'
    bot.sendMessage(chat_id=chat_id, text=result_txt)
else :
    # result_txt = result_json['images'][0]['fiels'][0]['inferText']
    result_txt = result_json['images'][0]['title']['inferText']

f.write(('0'+str(tm.tm_year))[-2:] + ('0'+str(tm.tm_mon))[-2:] + ('0'+str(tm.tm_mday))[-2:]+' '+('0'+str(tm.tm_hour))[-2:]+':'+('0'+str(tm.tm_min))[-2:]+' '+result_txt+'\n')
f.close()
