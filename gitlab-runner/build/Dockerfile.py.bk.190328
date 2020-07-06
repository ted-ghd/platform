import os

import sys
sys.path.insert(0, '.')
import myBuild

def load_template(template_name, val, targetFile):

        name = template_name
        value = val

        if value == "TRUE":
            tempF = open("/workdir/build/templates/"+name, "r")
            tempData = tempF.read()
            targetFile.write(tempData+"\n")
            tempF.close()
        
################ START PRINT DOCKERFILE ####################

wf=open("/temp/build/Dockerfile.tmp", "w");

wf.write("FROM "+myBuild.BASE+"\n")
    
try: 
	wf.write("MAINTAINER "+myBuild.MAINTAINER+"\n")
except:
	print("no MAINTAINER in myBuild.py")
    	
############## HAE APT / PIP REPO SETTING ##################

load_template("haehpc_repo", "TRUE", wf)

try: 
	customYn = myBuild.CUSTOM
except:
	customYn = "FALSE"
	

if customYn == "TRUE" :
    tempF = open("Dockerfile", "r")
    tempData = tempF.read()
    wf.write(tempData+"\n")
    tempF = open("/workdir/build/templates/extras", "r") 
    tempData = tempF.read()
    wf.write(tempData+"\n")
    tempF.close()


else:
    
    
    	
    ############## EXPT PACKAGE INSTALL ########################
    
    try:
        ext_pkgs = myBuild.EXT_PKGS
    
        if len(ext_pkgs) > 0:
            ext_pkgs_list =ext_pkgs.split(" ")
    
            for i in ext_pkgs_list:
                if i != "python3.6":
                    print(i+" is not supported yet")
                    sys.exit(-1)
            
            for ext_pkg in ext_pkgs_list:
                extF = open("/workdir/build/templates/"+ext_pkg,"r")
                extData = extF.read()
                wf.write(extData+"\n")
                extF.close()
    except:
        print("no expt pkgs in myBuild.py")
    
    ############## INSTALL APT PKGS ############################
    try:
        apt_pkgs = myBuild.APT_PKGS
    
        if len(apt_pkgs) > 0:
            wf.write("RUN  apt-get -y install "+myBuild.APT_PKGS+"\n")
    except:
        print("no APT_PKGS in myBuild.py")
    
    ############### INSTALL PYTHON #############################
    
    
    py_ver = myBuild.PY_VER
    py_ver_spec = py_ver.split(".")
    py_major = py_ver_spec[0]
    py_minor1 = py_ver_spec[1]
    py_minor2 = py_ver_spec[2]
    pip_ver = ""
    
    if py_major == "2":
        wf.write("RUN apt-get -y install python\n")
        pip_ver=""
    elif py_major+py_minor1 < "36":
        wf.write("RUN apt-get -y install python3\n")
        pip_ver="3"
    else:
        pyF = open("/workdir/build/templates/python.tmp","r")
        pyData = pyF.read()
        wf.write(pyData.replace("#PY_VER#", py_ver)+"\n")
        pyF.close()
        pip_ver=py_ver_spec[0]+"."+py_ver_spec[1]
        
    
   # print("no PY_VER in myBuild.py")
        
        
    ################ PIP INSTALL ###############################
    
    wf.write("RUN python"+pip_ver+" -m pip install --no-cache-dir --timeout 6000 --trusted-host pypi.hmc.co.kr --upgrade pip\n")
    
    try:
        pip_pkgs = myBuild.PIP_PKGS
    
        if len(pip_pkgs) > 0:
            wf.write("RUN python"+pip_ver+" -m pip install --no-cache-dir --timeout 6000 --trusted-host pypi.hmc.co.kr --upgrade "+myBuild.PIP_PKGS+"\n")
    except:
        print("no pip pkgs in myBuild.py")
    
    ################## CUDNN VERSION #############################
    try:
    	cudnn_ver = myBuild.CUDNN
    
    	if cudnn_ver != "7" : 
    	    print("only cudnn 7 is supported")
    	    sys.exit(-1)
    	else:
    	    cudnnF = open("/workdir/build/templates/CUDNN", "r")
    	    cudnnData = cudnnF.read()
    	    wf.write(cudnnData+"\n")
    except:
        print("no CUDNN in myBuild.py")
        
    ################## NODE INSTALL ##############################
    
    try:
    	node_ver = myBuild.NODE_VER
    
    	if node_ver != "6" and node_ver != "8":
    	    print("only node 6 or 8 is supported")
    	    sys.exit(-1)
    	else:
    	    nodeF = open("/workdir/build/templates/NODE", "r")
    	    nodeData = nodeF.read()
    	    res=nodeData.replace("#NODE_VER#", node_ver)
    	    wf.write(res+"\n")
    except:
        print("no NODE_VER in myBuild.py")
    
    ################## NPM INSTALL ##############################
    
    try:
        npm_pkgs = myBuild.NPM_PKGS
        wf.write("RUN npm install -g "+npm_pkgs+"\n")
    
    except:
        print("no NPM_PKGS in myBuild.py")
    
    ################## JUPYTER HUB INSTALL########################
    
    try:
    	jup_acts = myBuild.JUP_ACT
    	jup_act_list =jup_acts.split(" ")
    	
    	for acts in jup_act_list:
    		infos = acts.split(":")
    		wf.write("RUN useradd "+infos[0]+"\n")
    		wf.write("RUN mkdir /home/"+infos[0]+"\n")
    		wf.write("RUN chown "+infos[0]+": /home/"+infos[0]+"\n")
    		wf.write("RUN echo "+acts+"|chpasswd\n")
    except:
    	print("no JUP_ACT in myBuild.py")
    
    ############# LOAD TEMPLATE #########################
    	
    try:
    	load_template("JUP_HUB", myBuild.JUP_HUB, wf)	
    except:
    	print("no JUP_HUB option in myBuild.py")
    try:
        load_template("SSHD", myBuild.SSHD, wf)
    except:  
        print("no SSHD option in myBuild.py")
    try:
        load_template("VIM", myBuild.VIM, wf) 
    except:
        print("no VIM option in myBuild.py")
    try:
        load_template("UTF8", myBuild.UTF8, wf) 
    except:
        print("no UTF8 option in myBuild.py")
    try:
        load_template("SET_LD_PATH", myBuild.SET_LD_PATH, wf) 
    except:
        print("no LD_PATH option in myBuild.py")
    
    
    load_template("extras", "TRUE", wf) 
    
        
    
    ############## PORT EXPORT #############################
        
    try:
        ports = myBuild.EXPOSE_PORTS
        port_list =ports.split(" ")
    
        for i in port_list:
            wf.write("EXPOSE "+i+"\n")
    except:
        print("no export ports option in myBuild.py")
    
    ################# SUPD SETTING ##########################
    
    try:
        supd = myBuild.SUPD
        supd_progs = myBuild.SUPD_PROGRAM
        
        prog_list = supd_progs.split(";")
        
        wf.write("RUN echo \"[supervisord]\" > /etc/supervisord.conf \n")
        wf.write("RUN echo \"nodaemon=true\" >> /etc/supervisord.conf \n")
        wf.write("RUN echo \"logfile=/var/log/supervisord.log\" >> /etc/supervisord.conf \n")
        wf.write("RUN echo \"pidfile=/run/supervisord.pid\" >> /etc/supervisord.conf \n")
        
        for i in prog_list:
            wf.write("RUN echo \"[program:"+i+"]\" >> /etc/supervisord.conf \n")
            wf.write("RUN echo \"command="+i+"\" >> /etc/supervisord.conf  \n")
            wf.write("RUN echo \"autorestart=true\" >> /etc/supervisord.conf \n")
    except:
        print("no supd option in myBuild.py")
    
    ################### CMD ########################################
        
    try:
        cmd = myBuild.CMD
        wf.write("CMD "+cmd+"\n")
    except:
        print("no CMD option in myBuild.py")
    
    tempF = open("/workdir/build/templates/extras", "r")
    tempData = tempF.read()
    wf.write(tempData+"\n")
    wf.close()        
    ################### GENERATE BUILD SCRIPT  #########################


docker_work_dir = os.path.abspath('.')
docker_work_dir_list = docker_work_dir.split("/")
group = docker_work_dir_list[-2].lower()
project = docker_work_dir_list[-1].lower() 

try:
	sub_prj = "/"+myBuild.SUB_PRJ
	sub_prj = sub_prj.lower()
except:
	sub_prj = ""

docker_tag = "docker.hmc.co.kr/"+group+"/"+project+sub_prj+":"+myBuild.TAG
	
buildf = open("/temp/build/docker_build_script", "w")

buildf.write("sudo docker pull "+docker_tag+"\n")
buildf.write("cp /workdir/source/* "+docker_work_dir+"/source/\n")
buildf.write("cp /temp/build/Dockerfile.tmp "+docker_work_dir+"/Dockerfile.tmp\n")
buildf.write("sudo docker build -t "+docker_tag+" -f "+docker_work_dir+"/Dockerfile.tmp "+docker_work_dir+" \n")
buildf.write("sudo docker push "+docker_tag+"\n")
buildf.close()

