# coding=utf-8
import urllib.request
import base64
from sqlalchemy.schema import Sequence
from subprocess import Popen, PIPE
from flask import  Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime  
from datetime import timedelta  
from .entities.entity import Session, engine, Base
from .entities.exam import Exam, ExamSchema
from .entities.Integration import Integration, IntegrationSchema
from .entities.build import Build, BuildSchema
from .entities.user_session import UserSession, UserSessionSchema
from .entities.deploy import Deploy, DeploySchema
from .entities.container import Container, ContainerSchema
from .entities.container_volume import ContainerVolume, ContainerVolumeSchema
from .entities.volume import Volume, VolumeSchema
from git.cmd import Git
from sqlalchemy import func
import gitlab
import os
import uuid
import git, json
from kubernetes import client, config
import ldap3
from ldap3 import Server, Connection, ALL, NTLM

# creating the Flask application
app = Flask(__name__)

CORS(app)

SESSION_TYPE='redis'

# if needed, generate database schema
Base.metadata.create_all(engine)

@app.route('/autoLogin', methods=['POST'])
def autoLogin():
    requestData = request.get_json()
    _sessionId = requestData.get("sessionId")

    print(_sessionId)
    session = Session()
    session_objects = session.query(UserSession) \
        .filter_by(session_id=_sessionId)
    print(session_objects)
    # transforming into JSON-serializable objects
    schema = UserSessionSchema(many=True)
    sessions = schema.dump(session_objects)

    print(sessions)
    # serializing as JSON
    session.close()
    return jsonify(sessions.data)

    

###################### LDAP API #############################
@app.route('/login', methods=['POST'])
def getLogin():
    requestData = request.get_json()


    input_id = requestData.get("id")
    passwd = requestData.get("pwd")
    server = Server('hkmc.hkmg.global', get_info=ALL)

    conn = Connection(server, user="HKMC\\"+input_id, password=passwd, authentication=NTLM, auto_bind=True)
    conn.start_tls()

    conn.search('OU=HKMC_USER,DC=HKMC,DC=hkmg,DC=global', '(&(sAMAccountName='+input_id+')(objectClass=person))'
            , attributes=['cn',
                            'distinguishedName'
                            ,'displayName'
                            , 'description'  
                            ])

    entry = conn.entries[0]
     
    dnStr = '{\"'+ str(entry.distinguishedName).replace('=', '\":\"').replace(',', '\",\"')+ '\"}'

    #print(dnStr.find("OU"))
    idx = dnStr.find("OU")
    dnStr = dnStr[:idx] + 'TEAM' + dnStr[idx+2:]
    idx = dnStr.find("OU")
    dnStr = dnStr[:idx] + 'SIL' + dnStr[idx+2:]
    idx = dnStr.find("OU")
    dnStr = dnStr[:idx] + 'SAUPBU' + dnStr[idx+2:]
    idx = dnStr.find("OU")
    dnStr = dnStr[:idx] + 'COMPA' + dnStr[idx+2:]

    d = json.loads(dnStr)

    adStr = entry.cn
    nameStr = entry.displayName
    gradeStr = str(entry.description).split("/")[2]

    teamStr = d.get("TEAM")
    sIdx = teamStr.find("(")
    eIdx = teamStr.find(")")
    teamName = teamStr[:sIdx]
    teamCode = teamStr[sIdx+1:eIdx]

    silStr = d.get("SIL")
    sIdx = silStr.find("(")
    eIdx = silStr.find(")")
    silName = silStr[:sIdx]
    silCode = silStr[sIdx+1:eIdx]

    saStr = d.get("SAUPBU")
    sIdx = saStr.find("(")
    eIdx = saStr.find(")")
    saName = saStr[:sIdx]
    saCode = saStr[sIdx+1:eIdx]

    comStr = d.get("COMPA")
    sIdx = comStr.find("(")
    eIdx = comStr.find(")")
    comName = comStr[:sIdx]
    comCode = comStr[sIdx+1:eIdx]

    
    userSession = UserSession(uid = input_id)

    sessionId = uuid.uuid4().hex
    userSession.session_id = sessionId
    userSession.expired_at = datetime.now() + timedelta(minutes=10)
    userSession.grade = gradeStr
    userSession.team_name = teamName
    userSession.team_id = teamCode
    userSession.sil_name = silName
    userSession.sil_id = silCode
    userSession.sa_name = saName
    userSession.sa_id = saCode
    userSession.com_name = comName
    userSession.com_id = comCode

    # persist exam
    session = Session()
    session.add(userSession)
    session.commit()
    session.close()

    my_json_string = {'id':str(adStr),'name':str(nameStr), 'grade': gradeStr , 
                  'teamname': teamName, 'teamid': teamCode,
                  'silname': silName, 'silid': silCode,
                 'saname': saName, 'said': saCode,
                 'comname': comName, 'comid': comCode, 'sessionId': sessionId}    

    return json.dumps(my_json_string)

###################### RANCHER API #########################
@app.route('/generate_k8s', methods=['POST'])
def make_k8s():
    
    requestData = request.get_json()
    _sessionId = requestData.get('sessionId')
    _uid = getIdFromSession(_sessionId)

    project_home = '/data'
    _k8s_home = project_home + '/k8s'
    _user_home = _k8s_home + '/'+_uid

    
    _rancher_url = requestData.get('endPoint')
    _access_key=requestData.get('accessKey')
    _secret_key=requestData.get('secretKey')
    _project_number = requestData.get('projectId')
    
    echoPs =Popen(('echo', _project_number) , stdout=PIPE)

    print(_rancher_url)
    print(_access_key)
    print(_secret_key)
    print(_project_number)
    rancherPs = Popen(['/data/rancher', 'login', str(_rancher_url), '-t', str(_access_key)+':'+str(_secret_key)], \
                stderr=PIPE, stdout=PIPE , stdin=echoPs.stdout)
    
    #rancherPs.wait()
    loginResult = rancherPs.communicate()[0]
    #print(rancherPs.stdout.readlines())

    rancherPs = Popen(['/data/rancher', 'kubectl', 'config', 'view', '--raw'], stdout=PIPE,
               stderr=PIPE, stdin=PIPE, universal_newlines=True)

    #rancherPs.wait()
    print(PIPE)
    
    k8sConfigStr = rancherPs.communicate()[0]

    if not os.access(_k8s_home, os.F_OK) :
        os.makedirs(_k8s_home)
    
    if not os.access(_user_home, os.F_OK) :
        os.makedirs(_user_home)

    #print(str(k8sConfigStr))
    wf = open(_user_home+"/k8s_config", "w")
    wf.write(str(k8sConfigStr))
    wf.close()

    return '', 201    

###################### K8s API #############################
@app.route('/createPvc', methods=['POST'])
def create_pvc():
    requestData = request.get_json()
    _sessionId = requestData.get('sessionId')


    _namespace = requestData.get('group')
    _namespace = _namespace.lower()
    _uid = getIdFromSession(_sessionId)
    _new_vol_name = requestData.get('new_vol_name')
    _new_vol_size = requestData.get('new_vol_size')
    _storageClass = requestData.get('new_vol_sc')
    _storageClass = _storageClass.lower()

    k8s_config_home = '/data/k8s/'+ _uid
    config.load_kube_config(k8s_config_home+'/k8s_config')
    
    v1 = client.CoreV1Api()
    body = client.V1PersistentVolumeClaim()
    body.spec = client.V1PersistentVolumeClaimSpec()
    spec = body.spec
    body.metadata = client.V1ObjectMeta()
    metadata = body.metadata
    
    metadata.name = _new_vol_name

    access_mode_list = ["ReadWriteOnce",]
    spec.access_modes = access_mode_list

    spec.storage_class_name = _storageClass

    spec.resources = client.V1ResourceRequirements()
    resources = spec.resources

    dicts = {}
    dicts["storage"] = ''
    dicts["storage"]= _new_vol_size

    spec.resources.requests = dicts

    api_response = v1.create_namespaced_persistent_volume_claim(_namespace, body)

    return jsonify(str(api_response)), 201

@app.route('/deletePod', methods=['POST'])
def delete_pod():
    requestData = request.get_json()
    _sessionId = requestData.get('sessionId')
    _pod_name = requestData.get('pod_name')
    _replica_name = requestData.get('replica_name')
    _deploy_name = requestData.get('deploy_name')
    _namespace = requestData.get('namespace')
    _uid = getIdFromSession(_sessionId)

    _namespace = _namespace.lower()
    k8s_config_home = '/data/k8s/'+ _uid
    config.load_kube_config(k8s_config_home+'/k8s_config')
    
    v1 = client.AppsV1beta2Api()
    body = client.V1DeleteOptions()

    ret = v1.delete_namespaced_replica_set(_replica_name,_namespace, body)
    ret = v1.delete_namespaced_deployment(_deploy_name,_namespace, body)

    v1 = client.CoreV1Api()

    ret = v1.delete_namespaced_pod(_pod_name,_namespace, body)
    
    
    return jsonify(""), 200


@app.route('/quotas', methods=['POST'])
def get_quotas():
    requestData = request.get_json()
    _sessionId = requestData.get('sessionId')

    _uid = getIdFromSession(_sessionId) #requestData.get('uid')

    _namespace = requestData.get('namespace')
    _namespace = _namespace.lower()
    k8s_config_home = '/data/k8s/'+ _uid
    config.load_kube_config(k8s_config_home+'/k8s_config')


    lists = []
    v1 = client.CoreV1Api()

    res_quota_namespaced = v1.list_namespaced_resource_quota(_namespace)
    
    for item in res_quota_namespaced.items:
        for data in item.status.hard:
            json_string = { 'namespace' : item.metadata.namespace , 'name' : item.metadata.name , \
                        'type': data, \
                        'used': item.status.used[data], 'hard': item.status.hard[data] }
            lists.append(json_string)     
    
    return json.dumps(lists)

@app.route('/images', methods=['POST'])
def get_imgs():
    requestData = request.get_json()
    _sessionId = requestData.get('sessionId')

    _uid = getIdFromSession(_sessionId) #requestData.get('uid')

    _namespace = requestData.get('namespace')
    _group = requestData.get('group')
    _project = requestData.get('project')

    _group = _group.lower()
    _project = _project.lower()
    _namespace = _namespace.lower()

    _target = 'gitlab'
    
    # fetching from the database
    session = Session()
    integration_objects = session.query(Integration).order_by(Integration.id.desc()) \
    .filter_by(uid=_uid).filter_by(target=_target)
    
    git_token =integration_objects[0].accessKey

    session.close()

    print("https://gitlab.hmc.co.kr/"+_group+"/"+_project+"/container_registry.json" \
    
    + "?format=json&private_token="+git_token)

    contents = urllib.request.urlopen("https://gitlab.hmc.co.kr/"+_group+"/"+_project+"/container_registry.json" \
    
    + "?format=json&private_token="+git_token).read()

    lists = []
    dicts = {}

    images = json.loads(contents.decode("utf-8"))

    for image in images:
        #if("nvidia" not in str(image.get('path')) and \
        #        "tensorflow" not in str(image.get('path')) \
        #        ): 
        #    continue
        
        print("https://gitlab.hmc.co.kr"+image.get('tags_path') \
                   +"&private_token="+git_token)
        
        tag_json = urllib.request.urlopen("https://gitlab.hmc.co.kr"+image.get('tags_path') \
                   +"&private_token="+git_token).read()
        tags = json.loads(tag_json.decode("utf-8"))
            
        for tag in tags:
            try:
                dicts[image.get('path')] 
            except:
                dicts[image.get('path')] = []
            dicts[image.get('path')].append(tag.get('name'))
        
        json_string = {'image': str(image.get('path')), 'tags': dicts[image.get('path')]}
        lists.append(json_string)
        
    #print(lists)

    return json.dumps(lists), 200

@app.route('/ingresses', methods=['POST'])
def get_ings():
    requestData = request.get_json()
    _sessionId = requestData.get('sessionId')

    _uid = getIdFromSession(_sessionId) #requestData.get('uid')

    _namespace = requestData.get('namespace')
    _namespace = _namespace.lower()
    k8s_config_home = '/data/k8s/'+ _uid
    config.load_kube_config(k8s_config_home+'/k8s_config')


    ingList = []
    v1 = client.ExtensionsV1beta1Api()

    ret = v1.list_namespaced_ingress(_namespace)
    
    for i in ret.items:
        #if(i.metadata.namespace == "autoever"):
        my_json_string = {'uid':i.metadata.uid,'name':i.metadata.name, 'namespace': i.metadata.namespace , 'host': i.spec.rules[0].host, 'service': i.spec.rules[0].http.paths[0].backend.service_name}
        ingList.append(my_json_string)        
    
    return json.dumps(ingList)

@app.route('/volumes', methods=['POST'])
def get_vols():
    requestData = request.get_json()
    _sessionId = requestData.get('sessionId')

    _uid = getIdFromSession(_sessionId) #requestData.get('uid')

    _namespace = requestData.get('namespace')
    _namespace = _namespace.lower()
    k8s_config_home = '/data/k8s/'+ _uid
    config.load_kube_config(k8s_config_home+'/k8s_config')


    volList = []
    v1 = client.CoreV1Api()

    ret = v1.list_namespaced_persistent_volume_claim(_namespace)
    
    for i in ret.items:
        #if(i.metadata.namespace == "autoever"):
        my_json_string = {'name':i.metadata.name,'storage':i.spec.resources.requests.get('storage')}
        volList.append(my_json_string)        
    
    return json.dumps(volList)

@app.route('/deploys' , methods=['POST'])
def get_dep():
    requestData = request.get_json()
    _sessionId = requestData.get('sessionId')
    #print(request)
    #print(requestData)
    _namespace = requestData.get('namespace')
    _namespace = _namespace.lower()
    
    
    _uid = getIdFromSession(_sessionId)  


    k8s_config_home = '/data/k8s/'+ _uid
    config.load_kube_config(k8s_config_home+'/k8s_config')


    depList = []
    #v1 = client.ExtensionsV1beta1Api()
    v1 = client.CoreV1Api()

    #ret = v1.list_deployment_for_all_namespaces(watch=False)
    #ret = v1.list_pod_for_all_namespaces(watch=False)
    ret = v1.list_namespaced_pod(_namespace)

    sshd_port = ""
    host_ip = ""

    for i in ret.items:

        for container in i.spec.containers:
            for port in container.ports:
                if port.container_port == 22:
                    sshd_port = port.host_port
                    
        host_ip = i.status.host_ip

        #if(i.metadata.namespace == "autoever"):
        my_json_string = {'host_ip': host_ip, 'sshd_port': sshd_port, 'uid':i.metadata.uid,'name':i.metadata.name, 'namespace': i.metadata.namespace , 'image': i.status.phase }
        depList.append(my_json_string)   


    return json.dumps(depList)


@app.route('/getBaseImageList')
def get_baseImageList():
    contents = urllib.request.urlopen("https://gitlab.hmc.co.kr/shared/base/container_registry.json").read()

    lists = []
    dicts = {}

    images = json.loads(contents.decode("utf-8"))

    for image in images:
        #if("nvidia" not in str(image.get('path')) and \
        #        "tensorflow" not in str(image.get('path')) \
        #        ): 
        #    continue
        
        tag_json = urllib.request.urlopen("https://gitlab.hmc.co.kr"+image.get('tags_path')).read()
        tags = json.loads(tag_json.decode("utf-8"))
            
        for tag in tags:
            try:
                dicts[image.get('path')] 
            except:
                dicts[image.get('path')] = []
            dicts[image.get('path')].append(tag.get('name'))
        
        json_string = {'image': str(image.get('path')), 'tags': dicts[image.get('path')]}
        lists.append(json_string)
        
    #print(lists)

    return json.dumps(lists), 200
###################### GitLab API ##########################

@app.route('/getGitLabList', methods=['POST'])
def get_gitList():
    requestData = request.get_json()

    _sessionId = requestData.get('sessionId')


    _uid = getIdFromSession(_sessionId)
    _target = 'gitlab'

    # fetching from the database
    session = Session()
    integration_objects = session.query(Integration).order_by(Integration.id.desc()) \
    .filter_by(uid=_uid).filter_by(target=_target)

    schema = IntegrationSchema(many=True)
    Integrations = schema.dump(integration_objects)

    access_key = Integrations.data[0].get('accessKey')
    # serializing as JSON
    session.close()

    g1 = gitlab.Gitlab('https://gitlab.hmc.co.kr', \
                        private_token=access_key, \
                        ssl_verify=False)
    g1.auth()
    
    lists = []
    dicts = {}

    # find porject of group name and prj name
    projects = g1.projects.list()
    for project in projects:
        try:
            dicts[project.namespace.get("name")]
        except:
            dicts[project.namespace.get("name")] = []
        dicts[project.namespace.get("name")].append(project.name)
        

    for data in dicts:
        json_string = {'group' : str(data), 'projects': dicts[data]}
        lists.append(json_string)

    #print(lists)
    
    return json.dumps(lists), 200

@app.route('/submitCi', methods=['POST'])
def post_ci():

    requestData = request.get_json()
    _sessionId = requestData.get('sessionId')
    _uid = getIdFromSession(_sessionId)
    _target = 'gitlab'
    
    # fetching from the database
    session = Session()
    integration_objects = session.query(Integration).order_by(Integration.id.desc()) \
    .filter_by(uid=_uid).filter_by(target=_target)
    
    git_token =integration_objects[0].accessKey

    resCode = 201
    git_home = '/data'
    group = requestData.get("group")
    project = requestData.get("project")
    git_group_home = git_home + '/' + group
    git_project_home = git_group_home + '/' + project

    # 폴더가 존재하지 않는 경우
    if not os.access(git_group_home, os.F_OK) :
        #폴더를 만든다
        os.makedirs(git_group_home)
        #print("group folder generated")
        #print(git_project_home)    
        
    if not os.access(git_project_home, os.F_OK) :
        #clone 한다
        os.chdir(git_group_home)
        g = Git()
        #print("git init")
        g.clone('https://x-access-token:'+git_token+'@gitlab.hmc.co.kr/'+group+'/'+project)
        #print("clone done")


    remote_url = "https://x-access-token:"+git_token+"@gitlab.hmc.co.kr/" + group +"/"+ project;

    #print(remote_url)
    
    g = Git(git_project_home)
    g.config('user.email',_uid+'@hmc.co.kr')
    g.config('user.name',_uid)
    g.config('remote.origin.url', remote_url)

    g.pull()

    wf = open(git_project_home+"/myBuild.py", "w")

    for data in requestData:
        if str(data) not in ["sessionId","uid", "sort", "script","group", "project", \
                                "last_updated_by", "updated_at", \
                                "created_at", "id", \
                                "image_path", "image_tag"] : 
        
            dataStr = str(requestData.get(data))
            if dataStr != "empty" and len(dataStr) > 0 :
                wf.write(""+str(data).upper()+"=\""+str(requestData.get(data))+"\"\n")

    wf.close()
    
    
    customYn = requestData.get("custom")

    if customYn == "TRUE":
        wf=open(git_project_home+"/Dockerfile", "w")
        wf.write(requestData.get("script"))
        wf.close()
        g.add(git_project_home+'/Dockerfile')

    
    g.add(git_project_home+'/myBuild.py')

    try:
        g.commit('-m gitpython by flask app')
        resCode = 201
        res = g.push() 
    except git.exc.GitCommandError as err:
        #print(err)
        res = str(err)
        resCode = 270
            

    return jsonify(res), resCode

@app.route('/submitCd', methods=['POST'])
def post_cd():

    requestData = request.get_json()
    _sessionId = requestData.get('sessionId')
    _uid = getIdFromSession(_sessionId)

    group = requestData.get("group")
    project = requestData.get("project")

    _target = 'gitlab'
    
    # fetching from the database
    session = Session()
    integration_objects = session.query(Integration).order_by(Integration.id.desc()) \
    .filter_by(uid=_uid).filter_by(target=_target)

    git_token =integration_objects[0].accessKey

    resCode = 201
    
    # git_token을 이용한 docker registry config를 k8s에 제출한다

    
    k8s_config_home = '/data/k8s/'+ _uid
    config.load_kube_config(k8s_config_home+'/k8s_config')

    v1 = client.CoreV1Api()

    ret = v1.list_namespaced_secret(group.lower())
    secret_name = group+"-"+_uid

    secret_name = secret_name.lower()

    exist = False

    for item in ret.items:
        #print(item.metadata.name)
        
        if item.metadata.name  == secret_name:
            #print("exist!!!")
            exist = True

    docker_server = "https://docker.hmc.co.kr"
    docker_user = _uid
    docker_pass = git_token
    docker_auth = docker_user+':'+docker_pass
    docker_auth = base64.b64encode(docker_auth.encode("utf-8"))
    
    tmp_str = "{\"auths\":{\""+docker_server+"\":{\"username\":\""+docker_user+"\",\"password\":\""+docker_pass+"\",\
            \"auth\":\""+docker_auth.decode("utf-8")+"\"}}}"
    
    metadata= {'name':secret_name, 'namespace':group.lower()}

    data = {'.dockerconfigjson':base64.b64encode(tmp_str.encode("utf-8")).decode("utf-8")}


    if not exist:
        #print("Not exist!!!")
        body = client.V1Secret('v1', data, 'Secret', metadata , type='kubernetes.io/dockerconfigjson')
        api_response = v1.create_namespaced_secret(group.lower(), body)
        #pprint(api_response)
    #else:
        #print("alreay exist")

    git_home = '/data'

    
    git_group_home = git_home + '/' + group
    git_project_home = git_group_home + '/' + project

    # 폴더가 존재하지 않는 경우
    if not os.access(git_group_home, os.F_OK) :
        #폴더를 만든다
        os.makedirs(git_group_home)
        #print("group folder generated")
        #print(git_project_home)    
        
    if not os.access(git_project_home, os.F_OK) :
        #clone 한다
        os.chdir(git_group_home)
        g = Git()
        #print("git init")
        g.clone('https://x-access-token:'+git_token+'@gitlab.hmc.co.kr/'+group+'/'+project)
        #print("clone done")


    remote_url = "https://x-access-token:"+git_token+"@gitlab.hmc.co.kr/" + group +"/"+ project;

    #print(remote_url)

    g = Git(git_project_home)
    g.config('user.email',_uid+'@hmc.co.kr')
    g.config('user.name',_uid)
    g.config('remote.origin.url', remote_url)

    
    g.pull()

    #print(requestData) 

    wf = open(git_project_home+"/myDeploy.py", "w")

    #for data in requestData:
    #    if str(data) not in ["sessionId", "group", "project", "last_updated_by", \
    #                "updated_at", "created_at", "id", "volumes" \
    #                , "containers", "pod_label", "pod_name", "sc_name"] :  # != "group" and data != "project":
    #        dataStr = str(requestData.get(data))

    wf.write( "ENABLE_CD=\""+str(requestData.get("enable_cd"))+"\"\n\n")
    wf.write( "SHM_SIZE=\""+str(requestData.get("shm_size"))+"\"\n\n")
    wf.write( "PVC_CNT=\""+str(requestData.get("vol_cnt"))+"\"\n\n")
    wf.write( "TARGET_HOST=\""+str(requestData.get("target_node"))+"\"\n\n")
    wf.write( "MUL_DEP=\""+str(requestData.get("mul_dep"))+"\"\n\n")
            

            #if str(data) == "vol_cnt" :
            #    wf.write("PVC_CNT=\""+str(requestData.get(data))+"\"\n")
            #elif dataStr != "empty" and len(dataStr) > 0 :
            #    wf.write(""+str(data).upper()+"=\""+str(requestData.get(data))+"\"\n")
    
    i = 0
    for volume in requestData.get("volumes"):
        #for data in volume:
        wf.write( "VOL_NAME"+str(i)+"=\""+str(volume.get("vol_name"))+"\"\n")
        wf.write( "VOL_SIZE"+str(i)+"=\""+str(volume.get("vol_size")).replace("i", "")+"\"\n")
            #if str(data) in ["vol_name", "vol_size"] : 
            #    dataStr = str(volume.get(data))
            #    if dataStr != "empty" and len(dataStr) > 0 and str(data) != "con_vols" :
            #        wf.write(""+str(data).upper()+str(i)+"=\""+str(volume.get(data))+"\"\n")
        i = i+1
    
    wf.write("\n")
    wf.write( "CON_CNT=\""+str(requestData.get("con_cnt"))+"\"\n\n")

    i = 0
    for container in requestData.get("containers"):
        
        wf.write( "CON_NAME"+str(i)+"=\""+str(container.get("con_name"))+"\"\n")
        wf.write( "CON_CMD"+str(i)+"=\""+str(container.get("con_cmd"))+"\"\n")
        wf.write( "CON_ARGS"+str(i)+"=\""+str(container.get("con_args"))+"\"\n")
        wf.write( "CON_PORT"+str(i)+"=\""+str(container.get("con_port"))+"\"\n")
        wf.write( "EXP_PORT"+str(i)+"=\""+str(container.get("con_exp_port"))+"\"\n")
        wf.write("\n")
        wf.write( "CON"+str(i)+"_GPUS=\""+str(container.get("con_gpu"))+"\"\n")
        wf.write("\n")
        wf.write( "CON"+str(i)+"_VOL_CNT=\""+str(container.get("con_vol_cnt"))+"\"\n")
        wf.write("\n")
        con_vols = container.get("con_vols")
        j = 0
        for con_vol in con_vols:
            wf.write( "CON" + str(i) +"_VOL_NAME" + str(j) + "=\""+con_vol.get("con_vol_name")+"\"\n")
            wf.write( "CON" + str(i) +"_VOL_PATH" + str(j) + "=\""+con_vol.get("con_vol_path")+"\"\n")
            j = j+1

       # for data in container:
        #    if str(data) not in ["con_id", "dep_id", "last_updated_by", "updated_at", "created_at", "id"] : 
       #         dataStr = str(container.get(data))
#
     #           if(str(data) == "con_vols"):
       #             con_vols = container.get("con_vols")
       #             j = 0
    #                for con_vol in con_vols:
     #                   wf.write( "CON" + str(i) +"_VOL_NAME" + str(j) + "=\""+con_vol.get("con_vol_name")+"\"\n")
     #                   wf.write( "CON" + str(i) +"_VOL_PATH" + str(j) + "=\""+con_vol.get("con_vol_path")+"\"\n")
     #                   j = j+1
#
     #           if str(data) == "con_vol_cnt" :
      #              wf.write("CON" + str(i) +"_VOL_CNT" +"=\""+str(container.get(data))+"\"\n")
      #          elif dataStr != "empty" and len(dataStr) > 0 and str(data) != "con_vols" :
      #              wf.write(""+str(data).upper()+str(i)+"=\""+str(container.get(data))+"\"\n")
        i = i+1
    

    
    
    #wf.write("IMG_SCRT=\""+secret_name+"\"\n")
    wf.close()
    
    g.add(git_project_home+'/myDeploy.py')

    try:
        g.commit('-m gitpython by flask app')
        resCode = 201
        res = g.push() 
    except git.exc.GitCommandError as err:
        #print(err)
        res = str(err)
        resCode = 270
            

    return jsonify(res), resCode

#################### DB API ################################
@app.route('/exams')
def get_exams():
    # fetching from the database
    session = Session()
    exam_objects = session.query(Exam).all()

    # transforming into JSON-serializable objects
    schema = ExamSchema(many=True)
    exams = schema.dump(exam_objects)

    # serializing as JSON
    session.close()
    return jsonify(exams.data)

@app.route('/getInteg', methods=['POST'])
def get_integs():
    
    requestData = request.get_json();
    _sessionId = requestData.get('sessionId')
    _uid = getIdFromSession(_sessionId) 

    _target = requestData.get('target')
    
    session = Session()

    integration_objects = session.query(Integration).order_by(Integration.id.desc()) \
    .filter_by(uid=_uid).filter_by(target=_target)

    #print(_uid)
    #print(_target)
    #print(integration_objects)
    # transforming into JSON-serializable objects
    schema = IntegrationSchema(many=True)
    Integrations = schema.dump(integration_objects)

    # serializing as JSON
    session.close()
    return jsonify(Integrations.data)

@app.route('/buildList', methods=['POST'])
def get_builds():
    
    requestData = request.get_json();
    _sessionId = requestData.get('sessionId')
    _uid = getIdFromSession(_sessionId) 

    # fetching from the database
    session = Session()
    build_objects = session.query(Build).order_by(Build.id.desc()) \
        .filter_by(last_updated_by=_uid)

    #print(build_objects)
    # transforming into JSON-serializable objects
    schema = BuildSchema(many=True)
    builds = schema.dump(build_objects)

    # serializing as JSON
    session.close()
    return jsonify(builds.data)

@app.route('/depList', methods=['POST']) 
def get_deps():
    
    requestData = request.get_json();
    _sessionId = requestData.get('sessionId')
    _uid = getIdFromSession(_sessionId) 

    # fetching from the database

    session = Session()
    
    deploy_objects = session.query(Deploy).join(Container) \
    .filter(Deploy.id == Container.dep_id).filter(Deploy.last_updated_by == _uid).all()
    
    #for object in deploy_objects:
    #    print(object.containers)
    

    schema = DeploySchema(many=True)
    
    deploys = schema.dump(deploy_objects)
    #return ''

    session.close()

    return jsonify(deploys.data)

@app.route('/build/<_id>')
def get_build(_id):
    input_id = _id
    # fetching from the database
    session = Session()
    build_object = session.query(Build).filter_by(id=input_id)

    # transforming into JSON-serializable objects
    schema = BuildSchema(many=True)
    builds = schema.dump(build_object)

    # serializing as JSON
    session.close()
    return jsonify(builds.data)

@app.route('/exams', methods=['POST'])
def add_exam():
    # mount exam object 
    posted_exam = ExamSchema(only=('title', 'description'))\
        .load(request.get_json())

    exam = Exam(**posted_exam.data, created_by="HTTP post request")

    # persist exam
    session = Session()
    session.add(exam)
    session.commit()

    # return created exam
    new_exam = ExamSchema().dump(exam).data
    session.close()
    return jsonify(new_exam), 201

def getIdFromSession(sessionId):
    session = Session()
    
    session_object = session.query(UserSession).order_by(UserSession.created_at.desc()) \
    .filter_by(session_id=sessionId)

    #print("sessionObject: " +str(session_object))

    session_schema = UserSessionSchema(many=True)
    Sessions = session_schema.dump(session_object)
    #print("Sessions: " +str(Sessions))

    #print("Sessions.data: " +str(Sessions.data[0].get("uid")))

    res = str(Sessions.data[0].get("uid"))
    session.close()

    return res


@app.route('/integrations', methods=['POST'])
def add_integ():

    requestData = request.get_json();
    _sessionId = requestData.get('sessionId')

    _uid =getIdFromSession(_sessionId)
    
    # mount exam object 
    posted_integration = IntegrationSchema(only=('id', 'target','uid', 'secretKey', 'accessKey','projectId', 'endPoint'))\
        .load(request.get_json())

    integration = Integration(**posted_integration.data)
    
    origin_integration_id = posted_integration.data.get('id');

    #print( int(origin_integration_id))
    

    if int(origin_integration_id) != 0 :
        integration.id = origin_integration_id
    else:
        integration.id = None

    integration.uid = _uid
    
    session = Session()
    #print(integration)
    # persist exam
    session.merge(integration)
    session.commit()

    # return created exam
    new_integration = IntegrationSchema().dump(integration).data
    session.close()
    return jsonify(new_integration), 201

@app.route('/buildSeq')
def build_seq():
    session = Session()

    seq = Sequence('build_seq')
    nextid = session.execute(seq)

    return jsonify(nextid)

@app.route('/deps', methods=['POST'])
def add_deps():
    reqStr = request.get_json()
    #print(reqStr)
    _sessionId = reqStr.get("sessionId")
    print(_sessionId);
    _uid = getIdFromSession(_sessionId)

    posted_deploy = DeploySchema(only=(
    'enable_cd',    
    'id',
    'created_at',
    'group',
    'shm_size',
    'project',
    'pod_name',
    'pod_label',
    'vol_name',
    'vol_size',
    'sc_name',
    'target_node',
    'con_cnt',
    'vol_cnt',
    'tag',
    'sub_prj',
    'mul_dep')).load(reqStr)

    deploy = Deploy(**posted_deploy.data, created_by=_uid)
    
    session = Session()
    seq = Sequence('deploy_id_seq')
    dep_id = session.execute(seq)
    deploy.id = dep_id
    # persist exam
    session.add(deploy)
    session.commit()

    #max = session.query(func.max(Deploy.id)).scalar()
    #deploy.id = max

    for con in reqStr.get("cons"):
        posted_container = ContainerSchema(only=(
        'id',
        'con_name' ,
        'con_port',
        'con_args' ,
        'con_cmd' ,
        'con_vol_name' ,
        'con_vol_path',
        'con_vol_cnt',
        'con_gpu',
        'con_exp_port')).load(con)

        container = Container(**posted_container.data, created_by=_uid)
        container.dep_id = dep_id
        container.con_id = container.id
        
        seq = Sequence('container_id_seq')
        con_id = session.execute(seq)
        
        container.id = con_id
        session.add(container)
        session.commit()


        for con_vol in con.get("con_vols"):
            posted_container_volume = ContainerVolumeSchema(only=(

                'id',
                'vol_id',
                'con_vol_name',
                'con_vol_path')).load(con_vol)

            print(posted_container_volume)
            container_volume = ContainerVolume(**posted_container_volume.data, created_by=_uid)
            container_volume.con_id = con_id
            container_volume.vol_id = container_volume.id
            container_volume.id = None
            session.add(container_volume)
            session.commit()

    for vol in reqStr.get("volumes"):
        posted_vol = VolumeSchema(only=(
            'id',
            'vol_name',
            'vol_size'
        )).load(vol)

        volume = Volume(**posted_vol.data, created_by=_uid)
        volume.dep_id = dep_id
        volume.vol_id = volume.id
        volume.id = None
        session.add(volume)
        session.commit()


    # return created exam
    new_deploy = DeploySchema().dump(deploy).data
    session.close()
    
    return jsonify(new_deploy), 201

    
@app.route('/builds', methods=['POST'])
def add_build():
    requestData = request.get_json()
    
    _sessionId = requestData.get('sessionId')
    _uid = getIdFromSession(_sessionId)
    # mount exam object
    posted_build = BuildSchema(only=(
    'id',
    'created_at',
    'sort',
    'script',
    'cudnn',
    'group',
    'project',
    'base',
    'maintainer',
    'py_ver',
    'apt_pkgs',
    'pip_pkgs',
    'npm_pkgs',
    'sshd',
    'utf8',
    'vim',
    'set_ld_path',
    'supd',
    'supd_programs',
    'expose_ports',
    'node_ver',
    'jup_hub',
    'jup_act',
    'cmd',
    'sub_prj',
    'tag',
    'enable_cd',
    'custom',
    'image_path',
    'image_tag'

    ))\
        .load(request.get_json())

    #print(request.get_json())
    build = Build(**posted_build.data, created_by=_uid)

    #print(_uid)
    # persist exam
    session = Session()
    session.add(build)
    session.commit()

    # return created exam
    new_build = BuildSchema().dump(build).data
    session.close()
    return jsonify(new_build), 201



@app.route('/updateBuild', methods=['POST'])
def update_build():
    requestData = request.get_json()
    _sessionId = requestData.get("sessionId")
    _uid = getIdFromSession(_sessionId)

     # mount exam object
    posted_build = BuildSchema(only=(
        'id',  'group', 'created_at','project' , 'base'  ,'maintainer'  ,'py_ver','apt_pkgs','pip_pkgs',
        'npm_pkgs', 'sshd','utf8','vim','set_ld_path','supd'  
        ,'supd_programs','expose_ports','node_ver','jup_hub','jup_act','cmd','sub_prj','tag', 'created_by',
        'sort', 'cudnn', 'script', 'enable_cd', 'custom',
        'image_path', 'image_tag'
    )).load(request.get_json())

    origin_build_id = posted_build.data.get('id');
    build = Build(**posted_build.data, created_by=_uid)

    build.id = origin_build_id
    build.base = 'docker.hmc.co.kr/' + build.image_path + ':' +build.image_tag

    # persist exam
    session = Session()
    session.merge(build)
    session.commit()

    # return created exam
    new_build = BuildSchema().dump(build).data
    session.close()

    return jsonify(new_build), 201

@app.route('/updateDeploy', methods=['POST'])
def update_deploy():
    reqStr = request.get_json()

    _sessionId = reqStr.get('sessionId')

    _uid =getIdFromSession(_sessionId)

    
    posted_deploy = DeploySchema(only=(
    'enable_cd',    
    'id',
    'group',
    'project',
    'pod_name',
    'shm_size',
    'pod_label',
    'vol_name',
    'vol_size',
    'sc_name',
    'vol_cnt',
    'target_node',
    'con_cnt',
    'tag',
    'sub_prj',
    'mul_dep'
    )).load(reqStr)

    origin_deploy_id = posted_deploy.data.get('id');
    
    deploy = Deploy(**posted_deploy.data, created_by=_uid)

    deploy.id = origin_deploy_id
    
    session = Session()
    session.merge(deploy)
    session.commit()

    #max = session.query(func.max(Deploy.id)).scalar()
    #deploy.id = max

    for con in reqStr.get("containers"):
        posted_container = ContainerSchema(only=(
        'id',
        'con_name' ,
        'con_port',
        'con_args' ,
        'con_cmd' ,
        'con_vol_name' ,
        'con_vol_path',
        'con_vol_cnt',
        'con_gpu',
        'con_exp_port')).load(con)

        origin_con_id = posted_container.data.get('id');

        if origin_con_id == None:
            origin_con_id = 0
            posted_container.data['id'] = origin_con_id


        container = Container(**posted_container.data, created_by=_uid)
        container.id = origin_con_id

        if origin_con_id == 0:
            container.id = None
            container.dep_id = origin_deploy_id

        session = Session()
        session.merge(container)
        session.commit()

        # origin_con_id를 con_id로 하는 containerVolume를 싹 날려버리자


        for con_vol in con.get("con_vols"):
            posted_container_volume = ContainerVolumeSchema(only=(

                'id',
                'vol_id',
                'con_vol_name',
                'con_vol_path')).load(con_vol)

            origin_con_vol_id = posted_container_volume.data.get('id');
            
            if origin_con_vol_id == None:
                print("none")
                origin_con_vol_id = 0
                print(posted_container_volume.data)
                posted_container_volume.data['id'] = origin_con_vol_id

            container_volume = ContainerVolume(**posted_container_volume.data, created_by=_uid)
            container_volume.id = origin_con_vol_id
            
            if origin_con_vol_id == 0:
                container_volume.id = None
                container_volume.con_id = origin_con_id

            session.merge(container_volume)
            session.commit()


    for vol in reqStr.get("volumes"):
        posted_vol = VolumeSchema(only=(
            'id',
            'vol_name',
            'vol_size'
        )).load(vol)

        origin_vol_id = posted_vol.data.get('id')
        volume = Volume(**posted_vol.data, created_by=_uid)
        volume.id = origin_vol_id;
        session.merge(volume)
        session.commit()

    # return created exam
    #new_deploy = DeploySchema().dump(deploy).data
    session.close()
    
    return '', 201