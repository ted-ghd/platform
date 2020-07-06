FROM gitlab/gitlab-runner:ubuntu-v12.4.0
COPY source/certs/Chain_RootCA_Bundle_sectigo_20201016.crt /usr/local/share/ca-certificates/
COPY source/bin/rancher-2.2.0 /usr/bin/rancher
COPY source/bin/kubectl-1.13.5 /usr/bin/kubectl
COPY source/bin/argocd /usr/bin/argocd
COPY source/bin/kubectl-argo-rollouts /usr/bin/kubectl-argo-rollouts

RUN rm -f /etc/apt/sources.list.d/*

RUN echo "Acquire::https::Verify-Peer \"false\";"        > /etc/apt/apt.conf.d/80-ssl-exceptions && \
    echo "Acquire::https::Verify-Host \"false\";"       >> /etc/apt/apt.conf.d/80-ssl-exceptions && \
    echo "deb http://nexus.hae-hpc.com/repository/xenial-proxy/ xenial main restricted multiverse universe" > /etc/apt/sources.list && \
    echo "deb http://nexus.hae-hpc.com/repository/xenial-proxy/ xenial-updates main restricted multiverse universe" >> /etc/apt/sources.list && \
    echo "deb http://nexus.hae-hpc.com/repository/xenial-proxy/ xenial-security main restricted multiverse universe" >> /etc/apt/sources.list && \
    echo "deb http://nexus.hae-hpc.com/repository/xenial-proxy/ xenial-backports main restricted multiverse universe" >> /etc/apt/sources.list && \
    echo "[global]"                                                  > /etc/pip.conf && \
   echo "trusted-host = nexus.hmc.co.kr"                           >> /etc/pip.conf && \
   echo "timeout = 6000"                                           >> /etc/pip.conf && \
    echo ""                                                         >> /etc/pip.conf && \
    echo "[install]"                                                >> /etc/pip.conf && \
    echo "index-url = https://nexus.hmc.co.kr/repository/pypi-proxy/simple/" >> /etc/pip.conf && \
    echo ""                                                         >> /etc/pip.conf && \
    echo "[search]"                                                 >> /etc/pip.conf && \
    echo "index-url = https://nexus.hmc.co.kr/repository/pypi-proxy/pypi"         >> /etc/pip.conf

RUN apt-get update
RUN apt-get -y install ca-certificates python sudo
RUN update-ca-certificates
RUN apt-get update

RUN apt-get install -y docker.io vim

RUN echo "gitlab-runner ALL=NOPASSWD: ALL" >> /etc/sudoers
RUN usermod -a -G docker gitlab-runner

RUN mkdir -p /temp/build
RUN mkdir -p /temp/deploy
RUN mkdir -p /temp/job
RUN chown -R gitlab-runner: /temp
RUN chmod -R 700 /temp
RUN cp /usr/bin/kubectl /usr/sbin/kubectl
RUN cp /usr/bin/rancher /usr/sbin/rancher
RUN chmod 755 /usr/sbin/kubectl
RUN chmod 755 /usr/sbin/rancher
RUN chmod 755 /usr/bin/kubectl
RUN chmod 755 /usr/bin/rancher
RUN chmod 755 /usr/bin/argocd
RUN chmod 755 /usr/bin/kubectl-argo-rollouts

RUN groupmod -g 993 docker

WORKDIR /
RUN wget http://nexus.hae-hpc.com/repository/etc/nodejs/node-v8.11.4-linux-x64.tar.xz
RUN tar xvf node-v8.11.4-linux-x64.tar.xz
WORKDIR /node-v8.11.4-linux-x64
ENV PATH="${PATH}:/node-v8.11.4-linux-x64/bin"

RUN npm config set registry "https://nexus.hmc.co.kr/repository/npm-proxy/"
RUN npm config set strict-ssl false
RUN npm install -g yarn
