FROM docker.hmc.co.kr/shared/registry/ubuntu:xenial-node8
MAINTAINER kim.taeseong@hyundai-autoever.com


################  OLD VERSION ###################################

COPY source/star.hmc.co.kr.crt /usr/local/share/ca-certificates/
COPY source/hae-hpc.com.crt /usr/local/share/ca-certificates/
#COPY source/python-keystoneclient-3.17.0.tgz /python-keystoneclient-3.17.0.tgz
#COPY source/python-swiftclient-3.6.0.tgz /python-swiftclient-3.6.0.tgz

RUN rm -f /etc/apt/sources.list.d/*

RUN echo "Acquire::https::Verify-Peer \"false\";"        > /etc/apt/apt.conf.d/80-ssl-exceptions && \
    echo "Acquire::https::Verify-Host \"false\";"       >> /etc/apt/apt.conf.d/80-ssl-exceptions && \
    echo "deb http://ubuntu.hmc.co.kr xenial main restricted"                                > /etc/apt/sources.list && \
    echo "deb http://ubuntu.hmc.co.kr xenial-updates main restricted"                       >> /etc/apt/sources.list && \
    echo "deb http://ubuntu.hmc.co.kr xenial universe"                                      >> /etc/apt/sources.list && \
    echo "deb http://ubuntu.hmc.co.kr xenial-updates universe"                              >> /etc/apt/sources.list && \
    echo "deb http://ubuntu.hmc.co.kr xenial multiverse"                                    >> /etc/apt/sources.list && \
    echo "deb http://ubuntu.hmc.co.kr xenial-updates multiverse"                            >> /etc/apt/sources.list && \
    echo "deb http://ubuntu.hmc.co.kr xenial-backports main restricted universe multiverse" >> /etc/apt/sources.list && \
    echo "deb http://ubuntu.hmc.co.kr xenial-security main restricted"                      >> /etc/apt/sources.list && \
    echo "deb http://ubuntu.hmc.co.kr xenial-security universe"                             >> /etc/apt/sources.list && \
    echo "deb http://ubuntu.hmc.co.kr xenial-security multiverse"                           >> /etc/apt/sources.list && \
    echo "[global]"                                                  > /etc/pip.conf && \
   echo "trusted-host = devpi.hae-hpc.com"                         >> /etc/pip.conf && \
   echo "timeout = 6000"                                           >> /etc/pip.conf && \
    echo ""                                                         >> /etc/pip.conf && \
    echo "[install]"                                                >> /etc/pip.conf && \
    echo "index-url = https://devpi.hae-hpc.com/root/pypi/+simple/" >> /etc/pip.conf && \
   #echo "index-url = https://pypi.hmc.co.kr/root/pypi/+simple/" >> /etc/pip.conf && \
    echo ""                                                         >> /etc/pip.conf && \
    echo "[search]"                                                 >> /etc/pip.conf && \
    echo "index-url = https://devpi.hae-hpc.com/root/pypi"         >> /etc/pip.conf
   # echo "index-url = https://pypi.hmc.co.kr/root/pypi"         >> /etc/pip.conf

RUN apt-get update
RUN apt-get -y install apt-utils ca-certificates
RUN update-ca-certificates
RUN apt-get update

#############################################################

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -yq install libnss-ldap libpam-ldap ldap-utils nscd openssh-server

RUN echo "session required        pam_mkhomedir.so skel=/etc/skel umask=007" >> /etc/pam.d/common-session

RUN sed -i "s/^passwd:.*/passwd: compat ldap/g" /etc/nsswitch.conf
RUN sed -i "s/^group:.*/group: compat ldap/g" /etc/nsswitch.conf
RUN sed -i "s/^shadow:.*/shadow: compat ldap/g" /etc/nsswitch.conf

RUN echo "base dc=hpc,dc=com" > /etc/ldap.conf

RUN echo "uri ldap://10.12.6.145:389" >> /etc/ldap.conf
RUN echo "ldap_version 3" >> /etc/ldap.conf
RUN echo "binddn cn=Manager,dc=hpc,dc=com" >> /etc/ldap.conf
RUN echo "bindpw secret" >> /etc/ldap.conf
RUN echo "pam_password md5" >> /etc/ldap.conf

RUN mkdir -p /var/run/sshd




RUN  apt-get -y install zip unzip python3-pip git iputils-ping curl
############# PYTHON 3.6.x or 3.7.x INSTALL TEMPLATE ######

############# INSTALL DEPENDENCY ###############

RUN apt-get install -y wget build-essential tk-dev libncurses5-dev libncursesw5-dev libreadline6-dev libdb5.3-dev libgdbm-dev libsqlite3-dev libssl-dev libbz2-dev libexpat1-dev liblzma-dev zlib1g-dev libreadline-dev

############# PREPARE SOURCE ###################
RUN mkdir /home/Python
WORKDIR /home/Python
RUN wget http://www.hae-hpc.com/etc/src/Python-3.6.4.tgz
RUN tar xvf Python-3.6.4.tgz
############# BUILD INSTALL ####################
WORKDIR /home/Python/Python-3.6.4
RUN ./configure
RUN make
RUN make altinstall
################################################

#RUN make clean
RUN python3.6 -m pip install --no-cache-dir --timeout 6000 --trusted-host pypi.hmc.co.kr --upgrade pip
RUN python3.6 -m pip install --no-cache-dir --timeout 6000 --trusted-host pypi.hmc.co.kr --upgrade python-gitlab GitPython setuptools wheel numpy jupyterlab==0.34.12 jupyterhub==0.9.4 jupyterhub-ldapauthenticator sqlalchemy psycopg2-binary flask marshmallow flask-cors kubernetes tensorflow==1.8.0
RUN useradd jupyter
RUN mkdir /home/jupyter
RUN chown jupyter: /home/jupyter
RUN echo jupyter:password|chpasswd
RUN useradd kts2597
RUN mkdir /home/kts2597
RUN chown kts2597: /home/kts2597
RUN echo kts2597:Darkstar|chpasswd
################# JUPYTER HUB SETTING TEMPLATE ###############

RUN npm config set registry "https://npm.hae-hpc.com"
RUN npm config set strict-ssl false
RUN npm install -g configurable-http-proxy
RUN npm install -g yarn
RUN yarn config set "strict-ssl" false
RUN yarn config set registry https://npm.hae-hpc.com

######################## JUPYTER HUB EXTENSTION ###################

RUN jupyter labextension install @jupyterlab/hub-extension
RUN jupyter lab build

########################################################################

RUN mkdir -p /etc/jupyterhub
RUN echo "c.JupyterHub.authenticator_class = 'jupyterhub.auth.PAMAuthenticator'" > /etc/jupyterhub/jupyterhub_config.py && \
    echo "c.Spawner.cmd = ['jupyter-labhub']"                                   >> /etc/jupyterhub/jupyterhub_config.py && \
    echo "c.PAMAuthenticator.open_sessions = False"                             >> /etc/jupyterhub/jupyterhub_config.py

########### VIM SETTING TEMPLATE ##################

RUN apt-get -y install vim && \
    echo "export TERM=linux" >> /etc/profile

WORKDIR /

COPY source/python-keystoneclient-3.17.0.tgz /python-keystoneclient-3.17.0.tgz
COPY source/python-swiftclient-3.6.0.tgz /python-swiftclient-3.6.0.tgz

RUN tar xvfz /python-swiftclient-3.6.0.tgz
RUN tar xvfz /python-keystoneclient-3.17.0.tgz

RUN pip install msgpack netifaces pbr

WORKDIR /python-keystoneclient-3.17.0
RUN pip install python_keystoneclient-3.17.0-py2.py3-none-any.whl -f ./ --no-index

WORKDIR /python-swiftclient-3.6.0
RUN pip install python_swiftclient-3.6.0-py2.py3-none-any.whl -f ./ --no-index


EXPOSE 8000
EXPOSE 3000
EXPOSE 5000

WORKDIR /

COPY source/python-keystoneclient-3.17.0.tgz /python-keystoneclient-3.17.0.tgz
COPY source/python-swiftclient-3.6.0.tgz /python-swiftclient-3.6.0.tgz

RUN tar xvfz /python-swiftclient-3.6.0.tgz
RUN tar xvfz /python-keystoneclient-3.17.0.tgz

RUN pip install msgpack netifaces pbr

WORKDIR /python-keystoneclient-3.17.0
RUN pip install python_keystoneclient-3.17.0-py2.py3-none-any.whl -f ./ --no-index

WORKDIR /python-swiftclient-3.6.0
RUN pip install python_swiftclient-3.6.0-py2.py3-none-any.whl -f ./ --no-index

########################## monaco extension ###########################
WORKDIR /
#RUN git clone https://gitlab.hae-hpc.com/autoever/jupyterlab-monaco.git
RUN git clone https://github.com/jupyterlab/jupyterlab-monaco.git

WORKDIR /jupyterlab-monaco

RUN yarn install
RUN yarn run build


RUN jupyter labextension link .
CMD ["jupyterhub", "-f" ,"/etc/jupyterhub/jupyterhub_config.py"]
