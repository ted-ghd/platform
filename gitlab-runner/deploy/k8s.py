import os

import sys
sys.path.insert(0, '.')
import myBuild
import myDeploy

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

def load_template(template_name, val, targetFile):

        name = template_name
        value = val

        if value == "TRUE":
            tempF = open("/workdir/buildtemplates/"+name, "r")
            tempData = tempF.read()
            targetFile.write(tempData+"\n")
            tempF.close()
        
    
    
if myBuild.ENABLE_CD != "TRUE" :
	deployf = open("/temp/deploy/k8s_deploy_script", "w")
	deployf.write("echo Continuous Deployment is disabled. See myBuild.ENABLE_CD");
	deployf.close()
	exit(0)
	
if myDeploy.ENABLE_CD != "TRUE":
	deployf = open("/temp/deploy/k8s_deploy_script", "w")
	deployf.write("echo Continuous Deployment is disabled. See myDeploy.ENABLE_CD");
	deployf.close()
	exit(0)
	

k8s_work_dir = os.path.abspath('.').split("/")
group = k8s_work_dir[-2]
project = k8s_work_dir[-1] 
group = group.lower()
################ START PRINT DOCKERFILE ####################

#wf=open("/temp/deploy/deployment.yaml", "w");
	
############## HAE APT / PIP REPO SETTING ##################


project = project.lower()
sub_prj = "/"+myBuild.SUB_PRJ
sub_prj = sub_prj.lower()

props = load_properties("myDeploy.py");

image_url = "docker.hmc.co.kr/"+group+"/"+project+sub_prj+":"+myBuild.TAG

################### PREPARE PVC & SHM TEMPLATE ################################

pvcF = open("/workdir/deploy/templates/pvc.tmp", "r")
originPvcData = pvcF.read()
pvcF.close()

pvc_cnt = myDeploy.PVC_CNT

merge_pvcData = ""

for i in range(0, int(pvc_cnt)):
	pvcData = originPvcData
	pvcData = pvcData.replace("#VOL_NAME#", props["VOL_NAME"+str(i)])
	merge_pvcData = merge_pvcData + pvcData

try:

	shm_size = myDeploy.SHM_SIZE
	shmF = open("/workdir/deploy/templates/shm.tmp", "r")
	shmData = shmF.read()
	shmF.close()

	shmData = shmData.replace("#SHM_SIZE#", myDeploy.SHM_SIZE)
	shmData = shmData.replace("#SHM_NAME#", group+"-"+project+"-shm")

	merge_pvcData = merge_pvcData + shmData

except:
	print("no SHM_SIZE option")

################# WRITE CLAIM.YAML #########################################

for i in range(0, int(pvc_cnt)):
	claimF=open("/temp/deploy/claim"+str(i)+".yaml", "w");
	
	pvcF = open("/workdir/deploy/templates/claim.tmp", "r")
	originPvcData = pvcF.read()
	pvcF.close()
	
	pvcData = originPvcData
	pvcData = pvcData.replace("#NAMESPACE#", group)
	
	try:
		pvcData = pvcData.replace("#VOL_NAME#", props["VOL_NAME"+str(i)])
	except:
		pvcData = pvcData.replace("#VOL_NAME#", "")
	
	try:
		pvcData = pvcData.replace("#VOL_SIZE#", props["VOL_SIZE"+str(i)])
	except:
		pvcData = pvcData.replace("#VOL_SIZE#", "")
		
	try:
		pvcData = pvcData.replace("#SC_NAME#", "rnd-"+group)
	except:
		pvcData = pvcData.replace("#SC_NAME#", "")
	
	claimF.write(pvcData);
	claimF.close();

mul_dep = 0;

try:
    mul_dep = int(props["MUL_DEP"])
except:
    print("no multi dep_option")
    mul_dep = 1


for m in range(0, mul_dep):
#################### PREPARE CONTAINER TEMPLATE ###############################
    wf=open("/temp/deploy/deployment.yaml"+str(m), "w");
    conF = open("/workdir/deploy/templates/container.tmp", "r")
    originConData = conF.read()
    conF.close()

    con_cnt = myDeploy.CON_CNT

    merge_conData = ""

    for i in range(0, int(con_cnt)):
        conData = originConData
        conData = conData.replace("#CON_NAME#", props["CON_NAME"+str(i)])
        image_url = "docker.hmc.co.kr/"+group+"/"+project+sub_prj+":"+myBuild.TAG
        conData = conData.replace("#IMAGE#", image_url)
        conData = conData.replace("#CON_PORT#", props["CON_PORT"+str(i)])

        if props["CON_PORT"+str(i)] == "22":
            conData=conData.replace("#EXP_PORT#", str( int(props["EXP_PORT"+str(i)]) + m))
        else:
            conData=conData.replace("hostPort: #EXP_PORT#", "")
        
        con_envs=""        
	try:
            con_envs = props["CON_ENV"+str(i)]
        except:
            print("no container envs")

        if con_envs=="":
            conData=conData.replace("#CON_ENVS#", "")
        else:
            env_list=con_envs.split(" ")
            for env in env_list:
                env = env.split(":")
                str = "- name: " + env[0] +"\n" + "value: "+ env[1]
                env_str = env_str+str
            
            conData=conData.replace("#CON_ENVS#", env_str)	

	merge_conVolData= ""
	try:
        	conVolCnt = props["CON"+str(i)+"_VOL_CNT"]
	        conVolF = open("/workdir/deploy/templates/container_volume.tmp","r")
	        originConVolData = conVolF.read()
	        conVolF.close()
	        #merge_conVolData = ""

	        for j in range(0, int(conVolCnt)):
	            conVolData = originConVolData
	            conVolData = conVolData.replace("#CON_VOL_NAME#", props["CON"+str(i)+"_VOL_NAME"+str(j)])
	            conVolData = conVolData.replace("#CON_VOL_PATH#", props["CON"+str(i)+"_VOL_PATH"+str(j)])
	            merge_conVolData = merge_conVolData + conVolData

	        conVolData = originConVolData
	        conVolData = conVolData.replace("#CON_VOL_NAME#", group+"-"+project+"-shm")
	        conVolData = conVolData.replace("#CON_VOL_PATH#", "/dev/shm")
	        merge_conVolData = merge_conVolData + conVolData
	except:
		print("no container volume")

        con_args = props["CON_ARGS"+str(i)]
        con_arg_list = con_args.split(" ")
        con_arg_str = ""
        for j in con_arg_list:
            con_arg_str += "- "+j+"\n        "

        conData = conData.replace("#CON_ARGS#", con_arg_str)
        conData = conData.replace("#CON_CMD#", "- "+props["CON_CMD"+str(i)])
        conData = conData.replace("#CON_VOLUME#", merge_conVolData) 
	
	
        gpuF = open("/workdir/deploy/templates/gpus.tmp", "r")
        gpuData = gpuF.read()
        gpuF.close()

	try:
	        gpuData = gpuData.replace("#GPUS#", props["CON"+str(i)+"_GPUS"])
	        conData = conData.replace("#GPU#", gpuData)
	except:
		conData = conData.replace("#GPU#", "")

        merge_conData = merge_conData + conData

    #################### WRITE DEPLOYMENET.YAML ###############################

    depF = open("/workdir/deploy/templates/deployment.tmp", "r")
    depData = depF.read()
    depF.close()

    depData = depData.replace("#CONTAINER#", merge_conData)
    depData = depData.replace("#VOLUME#", merge_pvcData)
    #depData = depData.replace("#POD_LABEL#", group+"-"+project+"-"+sub_prj.replace("/",""))
    depData = depData.replace("#POD_LABEL#", group+"-"+project+"-"+str(m))
    depData = depData.replace("#NAMESPACE#", group)
    #depData = depData.replace("#POD_NAME#", group+"-"+project+"-"+sub_prj.replace("/",""))
    depData = depData.replace("#POD_NAME#", group+"-"+project+"-"+str(m))

    try:
            hostName = myDeploy.TARGET_HOST
            depData = depData.replace("group: #GROUP#", "kubernetes.io/hostname: "+hostName)
    except:
            depData = depData.replace("#GROUP#", group)

    #try:
    #       depData = depData.replace("#TARGET_NODE#", myDeploy.TARGET_NODE)
    #except:
    #       depData = depData.replace("nodeSelector:", "");
    #       depData = depData.replace("kubernetes.io/hostname: #TARGET_NODE#", "");


    #try:
    #       depData = depData.replace("#VOL_NAME#", myDeploy.VOL_NAME)
    #except:
    #       depData = depData.replace("volumes:", "")
    #       depData = depData.replace("- name: #VOL_NAME#", "")
    #       depData = depData.replace("persistentVolumeClaim:","")
    #       depData = depData.replace("claimName: #VOL_NAME#","")

    depData = depData.replace("#IMG_SCRT#", group)


    wf.write(depData);
    wf.close();

    #################### WRITE SERVICE.YAML ###############################

    wf=open("/temp/deploy/service.yaml"+str(m), "w");

    svcPortF = open("/workdir/deploy/templates/service_port.tmp", "r")
    originSvcPortData = svcPortF.read()
    svcPortF.close()

    merge_svcData = ""

    for i in range(0, int(con_cnt)):
        if props["CON_PORT"+str(i)] == "22":
            continue

        svcPortData = originSvcPortData
        svcPortData = svcPortData.replace("#CON_PORT#", props["CON_PORT"+str(i)])
        merge_svcData = merge_svcData + svcPortData

    svcF = open("/workdir/deploy/templates/service.tmp", "r")
    svcData = svcF.read()
    svcF.close()

    svcData = svcData.replace("#SERVICE_PORT#", merge_svcData)
    #svcData = svcData.replace("#POD_NAME#", group+"-"+project+"-"+sub_prj.replace("/",""))
    svcData = svcData.replace("#POD_NAME#", group+"-"+project+"-"+str(m))
    svcData = svcData.replace("#NAMESPACE#", group)
    #svcData = svcData.replace("#POD_LABEL#", group+"-"+project+"-"+sub_prj.replace("/",""))
    svcData = svcData.replace("#POD_LABEL#", group+"-"+project+"-"+str(m))


    wf.write(svcData);
    wf.close();

    #################### WRITE INGRESS.YAML ###############################

    for i in range(0, int(con_cnt)):
        if props["CON_PORT"+str(i)] == "22":
            continue

        wf=open("/temp/deploy/ingress"+str(i)+".yaml"+str(m), "w");
        ingressF = open("/workdir/deploy/templates/ingress.tmp", "r")
        ingressData = ingressF.read()
        ingressF.close()

        #ingressData = ingressData.replace("#POD_NAME#", group+"-"+project+"-"+sub_prj.replace("/",""))
        ingressData = ingressData.replace("#POD_NAME#", group+"-"+project+"-"+str(m))
        ingressData = ingressData.replace("#CON_NAME#", props["CON_NAME"+str(i)])
        ingressData = ingressData.replace("#NAMESPACE#", group)
        ingressData = ingressData.replace("#CON_PORT#", props["CON_PORT"+str(i)])

        wf.write(ingressData);
        wf.close();



    ################## WRITE NAMESPACE.YAML ###################################

    wf=open("/temp/deploy/namespace.yaml"+str(m), "w");
    nsF = open("/workdir/deploy/templates/namespace.tmp", "r")
    nsData = nsF.read()
    nsF.close()

    nsData = nsData.replace("#NAMESPACE#", group)
    wf.write(nsData)
    wf.close();




################### GENERATE DEPLOY SCRIPT  #########################

deployf = open("/temp/deploy/k8s_deploy_script", "w")


for i in range(0, int(pvc_cnt)):
        try:
                vol_name = props["VOL_NAME"+str(i)];
                deployf.write("sudo rancher kubectl apply -f /temp/deploy/claim"+str(i)+".yaml\n");
        except:
                print("no volume claim");

for m in range(0, mul_dep):
    deployf.write("sudo rancher kubectl apply --record -f /temp/deploy/deployment.yaml"+str(m)+"\n");
    deployf.write("sudo rancher kubectl apply -f /temp/deploy/service.yaml"+str(m)+"\n")

    for i in range(0, int(con_cnt)):
        if props["CON_PORT"+str(i)] == "22":
            continue
        deployf.write("sudo rancher kubectl apply -f /temp/deploy/ingress"+str(i)+".yaml"+str(m)+"\n")


    #deploymentName = group+"-"+project+"-"+sub_prj.replace("/","")+"-deployment"
    deploymentName = group+"-"+project+"-deployment"+str(m)

    #deployf.write("sudo rancher kubectl get pod $(echo $(sudo rancher kubectl get pod  -n "+group+" -o name|grep " \
    #                        +deploymentName+") | sed 's/pod\///') -n "+group+" -o yaml|grep hostIP\n")
    #deployf.write("sudo rancher kubectl get pod $(echo $(sudo rancher kubectl get pod  -n "+group+" -o name|grep " \
    #                        +deploymentName+") | sed 's/pod\///') -n "+group+" -o yaml|grep hostPort\n")



deployf.write("echo ============PODS==============\n")
deployf.write("sudo rancher kubectl get pod -n "+group+" -o=custom-columns=NAME:.metadata.name,\
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
}'\n")

#deployf.write("sudo rancher kubectl get pods --namespace="+group+"\n")
deployf.write("echo ============SERVICES==============\n")
deployf.write("sudo rancher kubectl get service --namespace="+group+"\n")
deployf.write("echo ============INGRESSES==============\n")
deployf.write("sudo rancher kubectl get ingress --namespace="+group+" | awk '{ printf \"%-30s %-2s %-50s\\n\", $1, \" \", $2}'\n")
#deployf.write("sudo rancher kubectl get ingress --namespace="+group+"\n")
#deployf.write("sudo rancher namespaces associate "+group+" c-sxf4p:p-w58d5\n");
deployf.close()

