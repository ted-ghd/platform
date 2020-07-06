# -*- coding: utf-8 -*- 
import os
import sys

sys.path.insert(0, '.')

# templates load 함수
# 1번째 인자 : templates 파일 이름
# 2번째 인자 : myBuild.py에서 읽어온 값 TRUE / FALSE
# 3번째 인자 : templates의 내용을 쓸 target 파일 디스크립터
def load_template(template_name, val, targetFile):

    name = template_name
    value = val

    if value == "TRUE":
        tempF = open("/workdir/build/templates/"+name, "r")
        tempData = tempF.read()
        targetFile.write(tempData+"\n")
        tempF.close()

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
props = load_properties("myBuild.py");

################ START PRINT DOCKERFILE ####################

wf=open("/temp/build/Dockerfile.tmp", "w");

try:
    wf.write("FROM "+props['BASE']+"\n")
# myBuild.py에 BASE가 작성되어 있지 않은 경우 곧바로 종료한다
except KeyError as error:
    print("no BASE in myBuild.py")
    wf.close()
    exit(1)

try: 
	wf.write("MAINTAINER "+props['MAINTAINER']+"\n")
#작성자가 없다고 하여 빌드가 되지 않는 것은 아니므로 출력만 하고 계속한다
except KeyError as error:
	print("no MAINTAINER in myBuild.py")


############## HAE APT / PIP REPO SETTING ##################

load_template("haehpc_repo", "TRUE", wf)

try: 
	customYn = props['CUSTOM']
# CUSTOM props가 없는 경우는 FALSE로 간주한다
except KeyError as error:
	customYn = "FALSE"
	

# CUSTOM이 TRUE인 경우는 Dockerfile이 gitlab work directory에 있으므로
# 이 Dockerfile을 앞에는 repo설정을, 뒤에는 swift 설치를 덧붙인다
if customYn == "TRUE" :
    tempF = open("Dockerfile", "r")
    tempData = tempF.read()
    wf.write(tempData+"\n")
    tempF = open("/workdir/build/templates/extras", "r") 
    tempData = tempF.read()
    wf.write(tempData+"\n")
    try:
        workDir = props['WORKDIR']
        wf.write("WORKDIR "+workDir+"\n")
    except KeyError as error:
	print("no workDir option in myBuild.py")
    tempF.close()
else: # customYn == "FALSE"

    ############## EXPT PACKAGE INSTALL ########################
    # PYTHON 3.6과 같이 ubuntu 16.04에서 apt-get으로 설치할 수 없는 패키지를
    # 직접 다운로드/압축해제/make install하여 설치한다
    try:
        ext_pkgs = props['EXT_PKGS']
        
        # EXT_PKGS props을 정의만 해두고 아무것도 작성하지 않았을 수 있으므로
        # 방어 코딩한다 ( Example : EXT_PKGS="" 인 경우 )
        if len(ext_pkgs) > 0:
            # EXT_PKGS에 작성된 내용은 공백문자 ' '를 기준으로 파싱하여
            # 리스트에 담는다
            ext_pkgs_list =ext_pkgs.split(" ")
    
            # 아직 python3.6만 지원되므로 python3.6이 아닌 경우는 빌드를 중단하고
            # 종료한다
            for pkg in ext_pkgs_list:
                if pkg != "python3.6":
                    print(pkg+" is not supported yet")
                    # exit(0)은 정상적인 종료를 의미하고, exit(1)은 무언가 잘못되었음을 의미
                    exit(1)
            
            #for ext_pkg in ext_pkgs_list:
            #    extF = open("/workdir/build/templates/"+ext_pkg,"r")
            #    extData = extF.read()
            #    wf.write(extData+"\n")
            #    extF.close()

    # EXT_PKGS가 꼭 있어야 빌드가 가능한 것은 아니므로
    # 경고 메세지만 출력하고 넘어간다
    except KeyError as error:
        print("no EXT_PKGS in myBuild.py")
    
    ############## INSTALL APT PKGS ############################
    try:
        apt_pkgs = props['APT_PKGS'] 
        
        # APT_PKGS props을 정의만 해두고 아무것도 작성하지 않았을 수 있으므로
        # 방어 코딩한다 ( Example : APT_PKGS="" 인 경우 )
        if len(apt_pkgs) > 0:
            wf.write("RUN  apt-get -y install "+apt_pkgs+"\n")

    # APT_PKGS가 꼭 있어야 빌드가 가능한 것은 아니므로
    # 경고 메세지만 출력하고 넘어간다
    except KeyError as error:
        print("no APT_PKGS in myBuild.py")
    
    ############### INSTALL PYTHON #############################
    
    try:
        py_ver = props['PY_VER'] 

        # python 버전은 .을 구분자로 하여 3개의 숫자로 구성된다 (Example : 3.6.0)
        py_ver_spec = py_ver.split(".")
        py_major = py_ver_spec[0]
        py_minor1 = py_ver_spec[1]
        py_minor2 = py_ver_spec[2]
        pip_ver = ""
        
        if py_major == "2":
        # Python main 버전이 2인 경우에는 apt-get 으로 설치한다
            wf.write("RUN apt-get -y install python\n")
            # PIP PKG 설치시 사용할 python 명령어의 prefix를 준비
            pip_ver=""
        
        elif py_major+py_minor1 < "36":
        # Python main+minor1이 3.6 미만인 경우에는 apt-get으로 설치한다
            wf.write("RUN apt-get -y install python3\n")
            # PIP PKG 설치시 사용할 python 명령어의 prefix를 준비
            pip_ver="3"
        
        else:
        # Python 3.6 이상은 ubuntu 16.04에서는 apt-get 으로 설치 불가하다
        # python.tmp 파일에 version을 명시하고 http://www.hae-hpc.com/etc/src/ 에서 내려받아
        # 설치한다
            pyF = open("/workdir/build/templates/python.tmp","r")
            pyData = pyF.read()
            wf.write(pyData.replace("#PY_VER#", py_ver)+"\n")
            pyF.close()
            # PIP PKG 설치시 사용할 python 명령어의 prefix를 준비
            pip_ver=py_ver_spec[0]+"."+py_ver_spec[1]

        ################ PIP INSTALL ###############################
        
        # PIP PKG 설치 전에 PIP를 최신 버전으로 업그레이드 한다
        wf.write("RUN python"+pip_ver+" -m pip install --no-cache-dir --timeout 6000 --trusted-host pypi.hmc.co.kr --upgrade pip\n")
        
        try:
            pip_pkgs = props['PIP_PKGS'] 

            # PIP_PKGS props을 정의만 해두고 아무것도 작성하지 않았을 수 있으므로
            # 방어 코딩한다 ( Example : PIP_PKGS="" 인 경우 )
            if len(pip_pkgs) > 0:
                wf.write("RUN python"+pip_ver+" -m pip install --no-cache-dir --timeout 6000 --trusted-host pypi.hmc.co.kr --upgrade "+props['PIP_PKGS']+"\n")
        # PIP_PKGS가 꼭 있어야 빌드가 가능한 것은 아니므로
        # 경고 메세지만 출력하고 넘어간다
        except KeyError as error:
            print("no PIP_PKGS in myBuild.py")

    # PY_VER가 없으면 Python을 설치할 수 없고, Python 설치가 안되면 PIP PKGS도 의미가 없다
    # 경고 메세지만 출력하고 넘어간다
    except KeyError as error:    
        print("no PY_VER in myBuild.py")
        print("PIP_PKGS cannot work")
    
    ################## CUDNN VERSION #############################

    ## CUDNN 라이브러리 버전을 맞춰야 하는 경우 (현업요구사항)
    try:
    	cudnn_ver = props['CUDNN'] 

        ## 현재 7버전만 지원한다. 7이 아닌 경우 빌드하지 않고 종료한다
    	if cudnn_ver != "7" : 
    	    print("only cudnn 7 is supported")
    	    sys.exit(-1)
    	else:
            #CUDNN 템플릿파일을 빌드 파일에 옮겨 적는다.
    	    cudnnF = open("/workdir/build/templates/CUDNN", "r")
    	    cudnnData = cudnnF.read()
    	    wf.write(cudnnData+"\n")

    # CUDNN이 없다하여 Docker 빌드가 불가한 것이 아니므로
    # 경고 메세지만 출력하고 넘어간다
    except KeyError as error:
        print("no CUDNN in myBuild.py")
        
    ################## NODE INSTALL ##############################
    
    try:
    	node_ver = props['NODE_VER'] 

        # http://www.hae-hpc.com/etc/nodejs/ 에서 nodejs 설치파일을 내려받아
        # 압축을 풀고 PATH에 잡아준다
        # 8 버전만 지원한다
    	if node_ver != "8":
    	    print("only node 8 is supported")
    	    sys.exit(-1)
    	else:
    	    nodeF = open("/workdir/build/templates/NODE", "r")
    	    nodeData = nodeF.read()
    	    res=nodeData.replace("#NODE_VER#", node_ver)
    	    wf.write(res+"\n")
    
    
        ################## NPM INSTALL ##############################
        
        try:
            npm_pkgs = props['NPM_PKGS']
            wf.write("RUN npm install -g "+npm_pkgs+"\n")
        
        # NODE_JS만 필요한 경우는 NPM_PKGS가 없을 수 있다
        # 경고 메세지만 출력하고 넘어간다
        except KeyError as error:
            print("no NPM_PKGS in myBuild.py")
    
        ################## JUPYTER HUB INSTALL########################
        
        ################## MAKE JUPYTER HUB ACCOUNT ##################
        try:
            jup_acts = props['JUP_ACT'] 
            jup_act_list =jup_acts.split(" ")
            
            for acts in jup_act_list:
                # JUP_ACT는 계정:패스워드 형식으로 작성되어 있다
                # :를 구분자로 하며 리스트를 생성한다
                infos = acts.split(":")
                # info[0]은 계정이 들어있다
                wf.write("RUN useradd "+infos[0]+"\n")
                wf.write("RUN mkdir /home/"+infos[0]+"\n")
                wf.write("RUN chown "+infos[0]+": /home/"+infos[0]+"\n")
                # 계정:패스워드 문자열을 그대로 사용하여 생성된 계정의 패스워드를 변경한다
                wf.write("RUN echo "+acts+"|chpasswd\n")
        
            ############# LOAD Jupyter hub TEMPLATE #########################
            
            try:
                load_template("JUP_HUB", props['JUP_HUB'], wf)	

            # 이럴 경우는 거의 없겠지만, JUP_ACT만 정의하고 JUP_HUB를 깜빡했을 수 있다
            # 경고메세지만 출력하고 넘어간다
            except KeyError as error:
                print("no JUP_HUB option in myBuild.py")

        # JUP_ACT 정의가 없으면 JUP_HUB 설치해봐야 아무 소용 없다
        # 경고 메세지 출력하고 넘어간다
        except KeyError as error:
            print("no JUP_ACT in myBuild.py")
            print("JUP_HUB option cannot work")

    # NODE_VER이 없으면 Jupyter HUB와 NPM PKGS는 의미가 없다
    # 경고 메세지만 출력하고 넘어간다
    except KeyError as error:
        print("no NODE_VER in myBuild.py")
        print("JUP_ACT JUP_HUB NPM_PKGS option cannot work")

    # SSHD를 설치하는 기능
    # 현재는 HAE REPO 설정에서 기본적으로 saslauthd를 이용하기 위해 sshd가 설치되므로
    # 의미 없는 소스가 되었음
    #try:
    #    load_template("SSHD", myBuild.SSHD, wf)
    #except:  
    #    print("no SSHD option in myBuild.py")
    
    # VIM 에디터 설치 옵션
    try:
        load_template("VIM", props['VIM'], wf) 
    except KeyError as error:
        print("no VIM option in myBuild.py")

    # Local 설정 옵션    
    try:
        load_template("UTF8", props['UTF8'], wf) 
    except KeyError as error:
        print("no UTF8 option in myBuild.py")

    # CUDA Library path 설정 옵션
    try:
        load_template("SET_LD_PATH", props['SET_LD_PATH'], wf) 
    except KeyError as error:
        print("no LD_PATH option in myBuild.py")
    
    
    # swiftclient와 keystoneclient 설치 (myBuild.py와 상관없이 무조건 설치)
    load_template("extras", "TRUE", wf) 
    
        
    
    ############## PORT EXPORT #############################

    ## Docker image로 컨테이너 실행시 노출시킬 container port    
    try:
        ports = props['EXPOSE_PORTS']
        port_list =ports.split(" ")
    
        for i in port_list:
            wf.write("EXPOSE "+i+"\n")
    except KeyError as error:
        print("no export ports option in myBuild.py")
    
    ################# SUPD SETTING ##########################
    
    ## Docker container 에서 2개 이상의 app를 띄울 필요가 있는 경우 사용
    try:
        supd = props['SUPD']
        supd_progs = props['SUPD_PROGRAM']
        
        #각 프로그램 명령어는 ; 으로 구분한다
        prog_list = supd_progs.split(";")
        
        wf.write("RUN echo \"[supervisord]\" > /etc/supervisord.conf \n")
        wf.write("RUN echo \"nodaemon=true\" >> /etc/supervisord.conf \n")
        wf.write("RUN echo \"logfile=/var/log/supervisord.log\" >> /etc/supervisord.conf \n")
        wf.write("RUN echo \"pidfile=/run/supervisord.pid\" >> /etc/supervisord.conf \n")
        
        for i in prog_list:
            wf.write("RUN echo \"[program:"+i+"]\" >> /etc/supervisord.conf \n")
            wf.write("RUN echo \"command="+i+"\" >> /etc/supervisord.conf  \n")
            wf.write("RUN echo \"autorestart=true\" >> /etc/supervisord.conf \n")

    except KeyError as error:
        print("no "+error+" option in myBuild.py")
    
    ################### CMD ########################################

    ## Docker container 실행시 mother process로 삼을 app 실행 명령어
    try:
        cmd = props['CMD']
        wf.write("CMD "+cmd+"\n")
    except KeyError as error:
        print("no CMD option in myBuild.py")
    

    # 정의되어 있는 모든 작업에 대한 검사와 쓰기가 끝났으므로 wf 닫는다
    wf.close()        
    ################### GENERATE BUILD SCRIPT  #########################

# 현재 gitlab-runner가 위치한 work directory를 
# '/'를 기준문자로 파싱하여 디렉토리 트리구조를 리스트로 획득
# gitlab group과 project를 얻어낸다
docker_work_dir = os.path.abspath('.')
docker_work_dir_list = docker_work_dir.split("/")
group = docker_work_dir_list[-2].lower()
project = docker_work_dir_list[-1].lower() 

# 이미지의 SUB NAME을 지정했으면, 도커 태그에 포함시키기 위해 문자열 저장
# 지정이 안되어 있으면 공백으로 저장
try:
	sub_prj = "/"+props['SUB_PRJ']
	sub_prj = sub_prj.lower()
except KeyError as error:
	sub_prj = ""

# 이미지 태그 생성
try:
    docker_tag = "docker.hmc.co.kr/"+group+"/"+project+sub_prj+":"+props['TAG']

# 태그가 없으면 빌드할 수 없다. 프로그램 종료한다.
except KeyError as error:
    print("no tag option")
    exit(-1)	

# 생성된 Dockerfile.tmp를 기반으로 한 build, tag, push 스크립트 작성
buildf = open("/temp/build/docker_build_script", "w")
# 이미 이미지가 registry에 존재하는 경우 빌드 시간을 줄이기 위해 pull
buildf.write("sudo docker pull "+docker_tag+"\n")
# Docker 빌드에 필요한 source를 work directory로 복사한다
# Dockerfile에서 COPY 등의 명령어로 접근할 파일들
buildf.write("cp /workdir/source/* "+docker_work_dir+"/source/\n")
# 만들어진 Dockerfile을 work directory로 옮긴다
buildf.write("cp /temp/build/Dockerfile.tmp "+docker_work_dir+"/Dockerfile.tmp\n")
buildf.write("sudo docker build -t "+docker_tag+" -f "+docker_work_dir+"/Dockerfile.tmp "+docker_work_dir+" \n")
buildf.write("sudo docker push "+docker_tag+"\n")
buildf.close()

# 생성 완료된 docker_build_script의 실행은 gitlab-runner가 수행한다
# gitlab 프로젝트의 .gitlab-ci.yml을 참조
