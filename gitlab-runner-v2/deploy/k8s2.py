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

# templates load 함수
# 1번째 인자 : templates 파일 이름
# 2번째 인자 : myBuild.py에서 읽어온 값 TRUE / FALSE
# 3번째 인자 : templates의 내용을 쓸 target 파일 디스크립터
def load_template(template_name, val, targetFile):

    name = template_name
    value = val

    if value == "TRUE":
        tempF = open("/workdir/buildtemplates/"+name, "r")
        tempData = tempF.read()
        targetFile.write(tempData+"\n")
        tempF.close()
        

#myDeploy와 myBuild를 각각 props로 읽어들인다
#bProps = load_properties("myBuild.py");   
dProps = load_properties("myDeploy.py");
 
# myBuild.py에 ENABLE_CD값이 없거나, FALSE이면 Deploy 즉시 종료 하도록 한다    
#try:
#    enable_cd = bProps['ENABLE_CD']
#except KeyError as error:
#    enable_cd = "FALSE"
#    deployf = open("/temp/deploy/k8s_deploy_script", "w")
#    deployf.write("echo Continuous Deployment is disabled. See myBuild.ENABLE_CD");
#    deployf.close()
#    exit(0)
#
#if enable_cd != "TRUE" :
#    deployf = open("/temp/deploy/k8s_deploy_script", "w")
#    deployf.write("echo Continuous Deployment is disabled. See myBuild.ENABLE_CD");
#    deployf.close()
#    exit(0)


# myDeploy.py에 ENABLE_CD값이 없거나, FALSE이면 Deploy 즉시 종료 하도록 한다
try:
    enable_cd = dProps['ENABLE_CD']
except KeyError as error:
    deployf = open("/temp/deploy/k8s_deploy_script", "w")
    deployf.write("echo Continuous Deployment is disabled. See myDeploy.ENABLE_CD");
    deployf.close()
    exit(0)

if enable_cd != "TRUE" :
    deployf = open("/temp/deploy/k8s_deploy_script", "w")
    deployf.write("echo Continuous Deployment is disabled. See myDeploy.ENABLE_CD");
    deployf.close()
    exit(0)    

# 현재 gitlab-runner의 work directory를 파싱하여 group과 project 를 얻는다
# gitlab의 group은 k8s의 namespace와 동일하게 간주한다
k8s_work_dir = os.path.abspath('.').split("/")
group = k8s_work_dir[-2]
project = k8s_work_dir[-1]
# k8s에서는 namespace에 대하여 대문자 허용하지 않으므로 소문자로 바꾼다 
group = group.lower()
project = project.lower()

################ START PRINT DOCKERFILE ####################

#wf=open("/temp/deploy/deployment.yaml", "w");
    
############## HAE APT / PIP REPO SETTING ##################


# myBuild.py에서 SUB_PRJ를 읽는다.
# 정의되어 있지 않다면 공백으로 세팅한다
#try:
#    sub_prj = "/"+bProps['SUB_PRJ']
#except KeyError as error:
#    sub_prj = ""
#
#sub_prj = sub_prj.lower()

# Build 단계에 push 되었을 image의 url을 생성한다
try:
    #image_url = "docker.hmc.co.kr/"+group+"/"+project+sub_prj+":"+bProps['TAG']
    image_url = dProps['IMAGE_PATH']
    image_url = image_url.replace(":443", "")

except KeyError as error:
    # 빌드를 끝내고 deploy로 넘어온 것인데 TAG가 없다면 잘못된 것이다.
    # 곧바로 종료시킨다
    print("no TAG in myBuild.py")
    exit(1)

################### PREPARE PVC & SHM TEMPLATE ################################


try:
    pvc_cnt = dProps['PVC_CNT']
except KeyError as error:
    # pvc_cnt 값이 없다면 pvc_cnt가 0인 것으로 간주한다
    pvc_cnt = 0

merge_pvcData = ""

for i in range(0, int(pvc_cnt)):
    pvcF = open("/workdir/deploy/templates/pvc.tmp", "r")
    originPvcData = pvcF.read()
    pvcF.close()    
    pvcType = "NAS"
    try:
        pvcType = dProps["VOL_TYPE"+str(i)]
        if pvcType == "HOST":
            # HOST TYPE VOLUME은 template을 바꿔야 한다
            hostPvcF = open("/workdir/deploy/templates/host_pvc.tmp", "r")
            originPvcData = hostPvcF.read()
            hostPvcF.close() 
    except KeyError as error:
        # Type이 없으면 NAS PVC 생성으로 간주한다
        print("no "+str(error)+"in myDeploy.py")
        print("consider as making NAS pvc")

    pvcData = originPvcData

    if pvcType == "NAS":
        try:
            pvcData = pvcData.replace("#VOL_NAME#", dProps["VOL_NAME"+str(i)])
        except KeyError as error:
            #pvc_cnt가 0보다 큰데 VOL_NAME이 없다는 것은 잘못된 것이다
            #deploy 작업을 중단한다
            print("no "+str(error)+" in myDeploy.py")
            exit(1)
    else: # HOST PVC 처리
        try:
            pvcData = pvcData.replace("#VOL_NAME#", dProps["VOL_NAME"+str(i)])
            pvcData = pvcData.replace("#HOST_PATH#", dProps["VOL_PATH"+str(i)])
        except KeyError as error:
            # pvc_cnt 가 0보다 크고 pvcType이 NAS가 아닌데
            # VOL_NAME이나 VOL_PATH가 하나라도 없으면 뭘 할수가 없다
            # deploy 작업을 중단한다
            print("no "+str(error)+" in myDeploy.py")
            exit(1)

    # volume 내용을 만들어 merge_pvcData에 합친다
    merge_pvcData = merge_pvcData + pvcData

# shm size를 늘리는 옵션 처리
try:

    shm_size = dProps['SHM_SIZE']
    shmF = open("/workdir/deploy/templates/shm.tmp", "r")
    shmData = shmF.read()
    shmF.close()

    shmData = shmData.replace("#SHM_SIZE#", dProps['SHM_SIZE'])
    shmData = shmData.replace("#SHM_NAME#", group+"-"+project+"-shm")

    merge_pvcData = merge_pvcData + shmData

except KeyError as error:
    # SHM_SIZE 설정이 없다해서 deploy를 중단할 이유는 되지 않으므로
    # 경고 메세지만 출력하고 계속한다.
    print("no SHM_SIZE option")

################# WRITE CLAIM.YAML #########################################

# myDeploy.py에 작성된 pvc volume을 k8s에 제줄할 yaml을 만든다
for i in range(0, int(pvc_cnt)):
    claimF=open("/temp/deploy/claim"+str(i)+".yaml", "w");
    
    pvcF = open("/workdir/deploy/templates/claim.tmp", "r")
    originPvcData = pvcF.read()
    pvcF.close()
    
    pvcData = originPvcData
    pvcData = pvcData.replace("#NAMESPACE#", group)
    
    try:
        pvcType = dProps["VOL_TYPE"+str(i)]
        if pvcType == "HOST":
            # HOST TYPE VOLUME은 PVC Claim을 생성할 필요가 없다
            continue
    except KeyError as error:
        # Type이 없으면 NAS PVC 생성으로 간주한다
        print("no "+str(error)+"in myDeploy.py")
        print("consider as making NAS pvc")	
     
    try:
        pvcData = pvcData.replace("#VOL_NAME#", dProps["VOL_NAME"+str(i)])
    except:
        #pvc_cnt가 0보다 큰데 VOL_NAME이 없다는 것은 잘못된 것이다
        #deploy 작업을 중단한다
        print("no "+str(error)+" in myDeploy.py")
        exit(1)
    
    try:
        pvcData = pvcData.replace("#VOL_SIZE#", dProps["VOL_SIZE"+str(i)])
    except KeyError as error:
        #pvc_cnt가 0보다 큰데 VOL_NAME이 없다는 것은 잘못된 것이다
        #deploy 작업을 중단한다
        print("no "+str(error)+" in myDeploy.py")
        exit(1)
        
    #storage class는 팀별로 이미 만들어져 있다
    pvcData = pvcData.replace("#SC_NAME#", "rnd-"+group)
    
    claimF.write(pvcData);
    claimF.close();

###################################################################################
# 동일한 컨테이너를 여러개 배포하는 설정
mul_dep = 0;

try:
    mul_dep = int(dProps["MUL_DEP"])
except KeyError as error:
    # mul_dep 옵션이 없다면 1개만 배포하는 것으로 간주한다
    # 경고메세지만 출력하고 계속한다
    print("no MUL_DEP option in myDeploy.py")
    print("Continue to deploy 1 pod")
    mul_dep = 1


for m in range(0, mul_dep):
#################### PREPARE CONTAINER TEMPLATE ###############################
    wf=open("/temp/deploy/deployment.yaml"+str(m), "w");
    conF = open("/workdir/deploy/templates/container.tmp", "r")
    originConData = conF.read()
    conF.close()

    try:
        con_cnt = dProps['CON_CNT']
    except KeyError as error:
        # 컨테이너의 개수가 없다는 것은 뭔가 잘못된 것이다 종료시킨다
        print("no CON_CNT option in myDeploy.py")
        exit(1)

    # Container를 1개 이상 배포하는 경우를 처리     
    merge_conData = ""

    for i in range(0, int(con_cnt)):
        conData = originConData

        try:
            conData = conData.replace("#CON_NAME#", dProps["CON_NAME"+str(i)])
        except KeyError as error:
            # CON_CNT가 0보다 큰데 CON_NAME이 없다는건 뭔가 잘못된 것이다 종료한다
            print("no "+str(error)+" in myDeploy.py")
            exit(1)

        image_url = dProps['IMAGE_PATH'] #"docker.hmc.co.kr/"+group+"/"+project+sub_prj+":"+bProps['TAG']
        image_url = image_url.replace(":443", "")


        conData = conData.replace("#IMAGE#", image_url)

        # 컨테이너가 사용할 port가 지정되어있지 않으면 60000 + i를 사용한다
        try:
            con_port = dProps["CON_PORT"+str(i)]
        except KeyError as error:
            con_port = str(60000 + i)

        conData = conData.replace("#CON_PORT#", con_port)

        # 컨테이너나 사용할 port가 22번인 경우, SAC와 연결되어야 하므로
        # hostPort와 연결시켜야 한다
        # 사용자가 myDeploy에 지정한 EXP_PORT(30000~30050)와 연결시킨다
        if con_port == "22":
            try:
                conData=conData.replace("#EXP_PORT#", str( int(dProps["EXP_PORT"+str(i)]) + m))
            except KeyError as error:
                # 컨테이너에서 22번 포트를 사용하는 앱을 띄울 건데
                # hostport를 지정하지 않았다면 정상적이지 않다
                # 경고메세지를 출력하고 종료 시킨다
                print("no EXP_PORT option in myDeploy.py")
                print("EXP_PORT is required if you want to deploy SSH daemon")
                exit(1)
        else:
            # 22번이 아닌 경우 hostPort와 연결하지 않고 K8s의 NodePort를 사용하면 되므로
            # 아예 지정하지 않는다 (자동으로 매핑됨)
            conData=conData.replace("hostPort: #EXP_PORT#", "")
        
        con_envs=""
        try:
            con_envs = dProps["CON_ENV"+str(i)]
        except:
            print("no container envs")

        if con_envs=="":
            conData=conData.replace("#CON_ENVS#", "")
        else:
            env_list=con_envs.split(" ")

            env_str= ""
            for env in env_list:
                env = env.split(":")
                tmp_str = "\n        - name: " + env[0] +"\n" + "          value: "+ env[1]
                env_str = env_str+tmp_str

            conData=conData.replace("#CON_ENVS#", env_str)
 
        # 컨테이너에 PVC를 붙이는 작업
        merge_conVolData= ""

        try:
            conVolCnt = dProps["CON"+str(i)+"_VOL_CNT"]
        except KeyError as error:
            # 볼륨을 사용하지 않는 컨테이너가 있을 수 있다
            # conVolCnt 를 0으로 세팅하고 넘어간다
            conVolCnt = 0
            print("no "+str(error)+" in myDeploy.py")
            
        conVolF = open("/workdir/deploy/templates/container_volume.tmp","r")
        originConVolData = conVolF.read()
        conVolF.close()
        #merge_conVolData = ""

        for j in range(0, int(conVolCnt)):
            conVolData = originConVolData

            try:
                conVolData = conVolData.replace("#CON_VOL_NAME#", dProps["CON"+str(i)+"_VOL_NAME"+str(j)])
                conVolData = conVolData.replace("#CON_VOL_PATH#", dProps["CON"+str(i)+"_VOL_PATH"+str(j)])
            except KeyError as error:
                # CON_VOL_CNT가 0보다 큰데 NAME 이나 PATH가 없다는건 잘못된 것이므로 종료시킨다
                print("no "+str(error)+" in myDeploy.py")
                exit(1)
            
            merge_conVolData = merge_conVolData + conVolData

        
        #SHM_SIZE 옵션이 있는 경우 컨테이너에 SHM을 마운트시킨다
        try:
            shm_size = dProps['SHM_SIZE']
            conVolData = originConVolData
            conVolData = conVolData.replace("#CON_VOL_NAME#", group+"-"+project+"-shm")
            conVolData = conVolData.replace("#CON_VOL_PATH#", "/dev/shm")
            merge_conVolData = merge_conVolData + conVolData
        except:
            # SHM_SIZE 옵션이 없다고 해서 deploy를 못하는 것은 아니다
            # 경고메세지만 출력하고 계속한다
            print("no SHM_SIZE in myDeploy.py")

        

        ### 컨테이너에서 실행시킬 앱 커맨드의 매개변수 (tensorboard --logdir /data 라면 --logdir /data 부분 )

        try:
            con_args = dProps["CON_ARGS"+str(i)]
            # 공백으로 된 부분을 잘라내어서
            con_arg_list = con_args.split(" ")
            con_arg_str = ""
            for j in con_arg_list:
                con_arg_str += "- "+j+"\n        "
            # 줄바꿈과 - 문자로 작성한다
            # Example -- logdir /data ==>   - --logdir
            #                         ==>   - /data 
        except KeyError as error:
            # args가 특별히 필요없는 어플리케이션일 수도 있다
            print("no CON_ARGS in myDeploy.py")
            con_args = ""

        conData = conData.replace("#CON_ARGS#", con_arg_str)

        # CON_CMD가 없을 수는 없다 종료 시킨다
        try:
            conData = conData.replace("#CON_CMD#", "- "+dProps["CON_CMD"+str(i)])
        except KeyError as error:
            print("no "+str(error)+" in myDeploy.py")
            exit(1)

        conData = conData.replace("#CON_VOLUME#", merge_conVolData) 


        # GPU를 몇개 할당할지에 대한 옵션 처리
        gpuF = open("/workdir/deploy/templates/gpus.tmp", "r")
        gpuData = gpuF.read()
        gpuF.close()

        try:
            gpuData = gpuData.replace("#GPUS#", dProps["CON"+str(i)+"_GPUS"])
        except KeyError as error:
            # 아예 GPU에 대한 고민을 하지 않는 컨테이너일 수 있다
            # GPU 개수를 0으로 처리한다
            gpuData = gpuData.replace("#GPUS#", str(0))
        
        conData = conData.replace("#GPU#", gpuData)

        # 지금까지 작성한 i번째 컨테이너의 설정을 하나의 string에 merge
        merge_conData = merge_conData + conData

    #################### WRITE DEPLOYMENET.YAML ###############################

    # deployment template을 불러온다
    depF = open("/workdir/deploy/templates/deployment.tmp", "r")
    depData = depF.read()
    depF.close()

    # gitlab의 group은 k8s의 namespace와 동일하다
    depData = depData.replace("#NAMESPACE#", group)

    # pod을 구분할 이름은 group - project로 한다 ( gitlab 1개 project는 1개의 pod만 제출 가능)
    depData = depData.replace("#POD_LABEL#", dProps['POD_NAME']+"-"+str(m))
    depData = depData.replace("#POD_NAME#", dProps['POD_NAME']+"-"+str(m))

    # 지금까지 merge한 container 정보를 입력
    depData = depData.replace("#CONTAINER#", merge_conData)
    # 지금까지 merge한 pvc 정보를 입력 (container volume 정보는 merge_conData에 있음)
    depData = depData.replace("#VOLUME#", merge_pvcData)

    
    # TARGET_HOST를 명시적으로 적었을 경우에는, k8s node의 group 정보 대신 host명을 사용한다
    try:
            hostName = dProps['TARGET_HOST']
            depData = depData.replace("group: #GROUP#", "kubernetes.io/hostname: "+hostName)
    except KeyError as error:
    # TARGET_HOST가 명시되어 있지 않은 경우에는 k8s node에 미리 정의된 group 명을 따라간다
            depData = depData.replace("#GROUP#", group)

    # Docker Registry에 접근하기 위핸 img secret을 설정 (namespace별로 미리 만들어두어야 한다)
    depData = depData.replace("#IMG_SCRT#", group)

    wf.write(depData);
    wf.close();

    #################### WRITE SERVICE.YAML ###############################

    # pod에 배포될 container port로 접근하기 위한 k8s service 정보
    wf=open("/temp/deploy/service.yaml"+str(m), "w");

    svcPortF = open("/workdir/deploy/templates/service_port.tmp", "r")
    originSvcPortData = svcPortF.read()
    svcPortF.close()

    merge_svcData = ""

    for i in range(0, int(con_cnt)):
        # Container에서 노출시킨 port가 22번인 경우에는 HostPort이므로 SAC 접근을 해야한다
        # 따라서 NodePort가 아예 할당되지 않으므로 service를 만들 필요가 없음
        if dProps["CON_PORT"+str(i)] == "22":
            continue

        svcPortData = originSvcPortData
        svcPortData = svcPortData.replace("#CON_PORT#", dProps["CON_PORT"+str(i)])
        merge_svcData = merge_svcData + svcPortData

    svcF = open("/workdir/deploy/templates/service.tmp", "r")
    svcData = svcF.read()
    svcF.close()

    svcData = svcData.replace("#SERVICE_PORT#", merge_svcData)
    svcData = svcData.replace("#POD_NAME#", dProps['POD_NAME']+"-"+str(m))
    svcData = svcData.replace("#NAMESPACE#", group)
    svcData = svcData.replace("#POD_LABEL#", dProps['POD_NAME']+"-"+str(m))

    #merge_svcData가 null이라는것은 hostPort 이외에 노출시킬 것이 없다는 것이므로
    #service를 만들 필요가 없다
    if merge_svcData == "":
        wf.close();
    else:
        wf.write(svcData);
        wf.close();

    #################### WRITE INGRESS.YAML ###############################

    # k8s 외부에서 service로 접근할 수 있는 URL (ingress)를 생성
    for i in range(0, int(con_cnt)):
        # Container에서 노출시킨 port가 22번인 경우에는 HostPort이므로 SAC 접근을 해야한다
        # 따라서 NodePort가 아예 할당되지 않으므로 service도 없고, ingress를 만들 필요가 없음
        if dProps["CON_PORT"+str(i)] == "22":
            continue

        wf=open("/temp/deploy/ingress"+str(i)+".yaml"+str(m), "w");
        ingressF = open("/workdir/deploy/templates/ingress.tmp", "r")
        ingressData = ingressF.read()
        ingressF.close()

        ingressData = ingressData.replace("#POD_NAME#", dProps['POD_NAME']+"-"+str(m))
        ingressData = ingressData.replace("#CON_NAME#", dProps["CON_NAME"+str(i)])
        ingressData = ingressData.replace("#NAMESPACE#", group)
        ingressData = ingressData.replace("#CON_PORT#", dProps["CON_PORT"+str(i)])

        wf.write(ingressData);
        wf.close();



    ################## WRITE NAMESPACE.YAML ###################################
    # namespace가 존재하지 않는 경우 namespace를 만들어준다
    # 지금은 사용하지 않는다. k8s에 미리 만들어두자
    #wf=open("/temp/deploy/namespace.yaml"+str(m), "w");
    #nsF = open("/workdir/deploy/templates/namespace.tmp", "r")
    #nsData = nsF.read()
    #nsF.close()

    #nsData = nsData.replace("#NAMESPACE#", group)
    #wf.write(nsData)
    #wf.close();




################### GENERATE DEPLOY SCRIPT  #########################

deployf = open("/temp/deploy/k8s_deploy_script", "w")


mode_command = "create"

#UPDATE 방지 기능
try:
    upt = dProps["UPT"]
    if upt == "TRUE":
        mode_command = "create"
    else:
        mode_command = "create"
except KeyError as error:
    mode_command = "create"


#MODE를 읽어온다 (2018.12.05 신기능)

try:
    mode = dProps["MODE"]
except KeyError as error:
    mode = "MERGE"


#if mode == "TRUNC":
    # 전부 삭제하고 다시 배포하므로, 삭제를 뿌린다
#    deployf.write("sudo rancher kubectl get deployment -n "+group+" | awk '/"+group+"-"+project+"/ {print \"sudo rancher kubectl delete deployment \"$1\" -n "+group+" --wait=false\"}' > delete.sh\n")
#    deployf.write("chmod 777 delete.sh\n")
#    deployf.write("sh delete.sh\n")
#    deployf.write("echo wait for k8s delete deployment - 30sec\n")
#    deployf.write("sleep 30s\n")
#    deployf.write("echo pod delete completed\n")
#    mode_command="create --save-config"
#elif mode == "MERGE":
    # 이미 배포되어있는 것도 포함해서 전부 업데이트한다 (1번이 배포되어있는데 4개 배포하면 1번도 다시 배포)
#    mode_command="apply"
#elif mode == "CREATE":
    # 이미 배포되어 있는건 건들지 않는다 (예를 들어, 1번이 배포되어있는데 1개는 안건드리고 3개만 새로 만듬)
#    mode_command="create --save-config"

# pvc 개수만큼 claim.yaml을 제출하는 스크립트 작성
for i in range(0, int(pvc_cnt)):
    try:
        pvcType = dProps["VOL_TYPE"+str(i)]
        if pvcType == "HOST":
            # HOST TYPE VOLUME은 PVC Claim을 생성할 필요가 없다
            continue
    except KeyError as error:
        # Type이 없으면 NAS PVC 생성으로 간주한다
        print("no "+str(error)+"in myDeploy.py")
        print("consider as making NAS pvc")

    try:
        vol_name = dProps["VOL_NAME"+str(i)];
        deployf.write("sudo rancher kubectl apply -f /temp/deploy/claim"+str(i)+".yaml\n");
    except KeyError as error:
        # pvc_cnt가 0보다 큰데 VOL_NAME이 없다는건 문제가 있다
        # 바로 종료한다
        print("no "+str(error)+" volume claim");
        exit(1)

# multi deploy에 정의된 개수 만큼 yaml 제출 스크립트 작성
for m in range(0, mul_dep):
    deployf.write("sudo rancher kubectl "+mode_command+" --record -f /temp/deploy/deployment.yaml"+str(m)+"\n");
    
    # size가 0인 경우 제출하지 않는다
    if os.path.getsize("/temp/deploy/service.yaml"+str(m)) != 0:
        deployf.write("sudo rancher kubectl apply -f /temp/deploy/service.yaml"+str(m)+"\n")

    for i in range(0, int(con_cnt)):
        # Container에서 노출시킨 port가 22번인 경우에는 HostPort이므로 SAC 접근을 해야한다
        # 따라서 NodePort가 아예 할당되지 않으므로 service도 없고 ingress도 없으니 제출할 필요가 없음
        if dProps["CON_PORT"+str(i)] == "22":
            continue
        deployf.write("sudo rancher kubectl apply -f /temp/deploy/ingress"+str(i)+".yaml"+str(m)+"\n")

    deploymentName = group+"-"+project+"-deployment"+str(m)

    # ssh 접속을 하기 위한 host IP를 얻어낸다
    #deployf.write("sudo rancher kubectl get pod $(echo $(sudo rancher kubectl get pod  -n "+group+" -o name|grep " \
    #                        +deploymentName+") | sed 's/pod\///') -n "+group+" -o yaml|grep hostIP\n")
    # ssh 접속을 하기 위한 host Port를 얻어낸다
    #deployf.write("sudo rancher kubectl get pod $(echo $(sudo rancher kubectl get pod  -n "+group+" -o name|grep " \
    #                        +deploymentName+") | sed 's/pod\///') -n "+group+" -o yaml|grep hostPort\n")

deployf.write("echo ============PODS==============\n")
deployf.write("rancher kubectl get pod -n "+group+" -o=custom-columns=NAME:.metadata.name,\
CONTAINERS:spec.containers[*].name,\
IMAGE:spec.containers[*].image,\
NODE:spec.nodeName,\
HOST_IP:status.hostIP,\
HOST_PORT:spec.containers[*].ports[*].hostPort,\
GPU:spec.containers[*].resources.\"limits\".*,\
PHASE:status.phase |\
awk '{\
if(FNR>1) {\
printf \"%-2s \", NR-2; print $ALL;\
} \
else { \
printf \"%-2s \", \"ID\";\
print $ALL\
}\
}'\n\n")

# Deploy가 제대로 이루어졌는지 확인하기 위해 조회 쿼리를 날린다
#deployf.write("sudo rancher kubectl get pods --namespace="+group+"\n")
deployf.write("echo ============SERVICES==============\n")
deployf.write("sudo rancher kubectl get service --namespace="+group+"\n\n")
deployf.write("echo ============INGRESSES==============\n")
#deployf.write("sudo rancher kubectl get ingress --namespace="+group+"\n\n")
deployf.write("sudo rancher kubectl get ingress --namespace="+group+" | awk '{ printf \"%-40s %-2s %-50s\\n\", $1, \" \", $2}'\n")

# k8s에 만든 namespace가 rancher project에서 보이려면 associate 작업을 해야 하는데
# 이 부분은 현재 사용하지 않는다
#deployf.write("sudo rancher namespaces associate "+group+" c-sxf4p:p-w58d5\n");
deployf.close()

# 완성된 k8s_deploy_script는 gitlab-runner에 의해 실행된다
# 각 프로젝트의 .gitlab-ci.yml 참조


