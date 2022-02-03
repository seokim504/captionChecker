import time

# 파일 열기
f = open('test1.txt', 'a')
result_txt = '텍스트 테스트'
# 파일에 텍스트 쓰기
time.sleep(5)
tm = time.localtime(time.time())
f.write(('0'+str(tm.tm_year))[-2:] + ('0'+str(tm.tm_mon))[-2:] + ('0'+str(tm.tm_mday))[-2:]+' '+('0'+str(tm.tm_hour))[-2:]+':'+('0'+str(tm.tm_min))[-2:]+' '+result_txt+'\n')

# 파일 닫기
f.close()

# log = open('test1.txt','r')
# text_log = log.readlines()
# print(text_log[-5:])