import requests
import uuid
import time
import json
import base64


import telegram

bot = telegram.Bot(token='2126794155:AAGp5KFf3Mxz02ms8TFVWS6iKYuBQQiK3JY') # test_by_INDIGO
chat_id = 1656535070 # test_by_INDIGO

bot.sendMessage(chat_id=chat_id, text='imagesearch Test!')
