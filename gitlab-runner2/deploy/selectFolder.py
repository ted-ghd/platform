# -*- coding: utf-8 -*-
import os
import sys

sys.path.insert(0, '.')


# Property Read 함수
# KEY="VALUE" \n 형식으로 저장된 Property 파일을 읽어서
# JSON 형태로 return 한다
def load_properties(filepath, sep='=', comment_char='#'):
    props = {}
    with open(filepath, "rt") as f:
        for line in f:
            l = line.strip()
            if l and not l.startswith(comment_char):
                key_value = l.split(sep)
                key = key_value[0].strip()
                value = sep.join(key_value[1:]).strip() .strip('"')
                props[key] = value
    return props

### STEP 1 : myBuild.py를 읽어들인다

# gitlab-runner의 현재 work directory에 있는 myBuild.py를 읽음
props = load_properties("folder.py");

################### GENERATE BUILD SCRIPT  #########################

# 현재 gitlab-runner가 위치한 work directory를
# '/'를 기준문자로 파싱하여 디렉토리 트리구조를 리스트로 획득
# gitlab group과 project를 얻어낸다
docker_work_dir = os.path.abspath('.')
docker_work_dir_list = docker_work_dir.split("/")
group = docker_work_dir_list[-2].lower()
project = docker_work_dir_list[-1].lower()

folder=props['FOLDER']

if folder == "":
    print("no folder description. confirm folder.py")
    exit(1)

buildf = open("/temp/deploy/folder_copy_script", "w")
buildf.write("cp -rf Deployments/"+folder+"/* ./\n")
buildf.close()

