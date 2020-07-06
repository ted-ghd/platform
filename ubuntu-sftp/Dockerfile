FROM ubuntu:bionic

########### BASIC REPO SETTING ########################################################################

RUN rm -f /etc/apt/sources.list.d/* && \
    echo "Acquire::https::Verify-Peer \"false\";"        > /etc/apt/apt.conf.d/80-ssl-exceptions && \
    echo "Acquire::https::Verify-Host \"false\";"       >> /etc/apt/apt.conf.d/80-ssl-exceptions && \
    echo "deb http://nexus.hae-hpc.com/repository/xenial-proxy/ xenial main restricted multiverse universe" > /etc/apt/sources.list && \
    echo "deb http://nexus.hae-hpc.com/repository/xenial-proxy/ xenial-updates main restricted multiverse universe" >> /etc/apt/sources.list && \
    echo "deb http://nexus.hae-hpc.com/repository/xenial-proxy/ xenial-security main restricted multiverse universe" >> /etc/apt/sources.list && \
    echo "deb http://nexus.hae-hpc.com/repository/xenial-proxy/ xenial-backports main restricted multiverse universe" >> /etc/apt/sources.list && \
    echo "deb http://nexus.hae-hpc.com/repository/bionic-proxy/ bionic main restricted multiverse universe"       >> /etc/apt/sources.list && \
    echo "deb http://nexus.hae-hpc.com/repository/bionic-proxy/ bionic-updates main restricted multiverse universe" >> /etc/apt/sources.list && \
    echo "deb http://nexus.hae-hpc.com/repository/bionic-proxy/ bionic-security main restricted multiverse universe" >> /etc/apt/sources.list && \
    echo "deb http://nexus.hae-hpc.com/repository/bionic-proxy/ bionic-backports main restricted multiverse universe"  >> /etc/apt/sources.list && \
    apt-get update  && \
    apt-get -y install apt-utils && \
    apt-get -y install openssh-server && \
    echo "session required        pam_mkhomedir.so skel=/etc/skel umask=007" >> /etc/pam.d/common-session  && \
    sed -i "s/^passwd:.*/passwd: compat ldap/g" /etc/nsswitch.conf  && \
    sed -i "s/^group:.*/group: compat ldap/g" /etc/nsswitch.conf  && \
    sed -i "s/^shadow:.*/shadow: compat ldap/g" /etc/nsswitch.conf  && \
    echo "base dc=hpc,dc=com" > /etc/ldap.conf  && \
    echo "uri ldap://ldap.hmc.co.kr:30389" >> /etc/ldap.conf  && \
    echo "ldap_version 3" >> /etc/ldap.conf && \
    echo "binddn cn=Manager,dc=hpc,dc=com" >> /etc/ldap.conf && \
    echo "bindpw secret" >> /etc/ldap.conf && \
    echo "pam_password md5" >> /etc/ldap.conf && \
    mkdir -p /var/run/sshd
#######################################################################################################
