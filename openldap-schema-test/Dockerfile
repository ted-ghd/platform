FROM docker.hmc.co.kr/shared/registry/ubuntu:xenial

ARG LDAP_SERVERS=ldap://hkmc.hkmg.global:389/
ARG LDAP_SEARCH_BASE=DC=hkmc,DC=hkmg,DC=global
ARG LDAP_TIMEOUT=10
ARG LDAP_FILTER=(sAMAccountName=%U)
ARG LDAP_PASSWORD=HaeHpc!1

ARG LDAP_DN_BASE=dc=hpc,dc=com
ARG LDAP_ORGANIZATION=Example
ARG LDAP_ROOT_DN=cn=Manager,dc=hpc,dc=com
ARG LDAP_DATABASE=hdb
ARG LDAP_ROOT_PW=secret

ENV OPENLDAP_VERSION 2.4.44


################  OLD VERSION ###################################

COPY source/star.hmc.co.kr.crt /usr/local/share/ca-certificates/
COPY source/hae-hpc.com.crt /usr/local/share/ca-certificates/
COPY AD.schema /AD.schema
COPY ad_custom_add.ldif /ad_custom_add.ldif

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

RUN apt-get update && apt-get install -y \
  curl \
  build-essential \
  groff-base \
  libdb-dev \
  libssl1.0.0 libssl-dev libiodbc2 libiodbc2-dev libsasl2-2 libsasl2-dev \
  sasl2-bin

RUN sed -i 's/MECHANISMS="pam"/MECHANISMS="ldap"/' /etc/default/saslauthd \
  && sed -i 's/START=no/START=yes/' /etc/default/saslauthd \
  && touch /etc/saslauthd.conf \
  && echo "mech_list: plain" >> /usr/lib/sasl2/slapd.conf \
  && echo "pwcheck_method: saslauthd" >> /usr/lib/sasl2/slapd.conf \
  && echo "saslauthd_path: /var/run/saslauthd/mux" >> /usr/lib/sasl2/slapd.conf

COPY saslauthd.conf /etc/saslauthd.conf

RUN sed -i 's|ldap:\/\/ad.example.com:389\/|'"$LDAP_SERVERS"'|' /etc/saslauthd.conf \
  && sed -i 's/CN=DomainUsers,DC=example,DC=com/'"$LDAP_SEARCH_BASE"'/' /etc/saslauthd.conf \
  && sed -i 's/ldap_timeout: 10/ldap_timeout: '"$LDAP_TIMEOUT"'/' /etc/saslauthd.conf \
  && sed -i 's/(sAMAccountName=%U)/'"$LDAP_FILTER"'/' /etc/saslauthd.conf \
  && sed -i 's/ADpassword/'"$LDAP_PASSWORD"'/' /etc/saslauthd.conf

RUN service saslauthd start
COPY openldap-2.4.44.tgz openldap-2.4.44.tgz

#RUN curl -LJO http://mirror.eu.oneandone.net/software/openldap/openldap-release/openldap-${OPENLDAP_VERSION}.tgz \
RUN gunzip -c openldap-${OPENLDAP_VERSION}.tgz | tar xf - \
  && rm openldap-${OPENLDAP_VERSION}.tgz

WORKDIR openldap-${OPENLDAP_VERSION}

RUN ./configure --enable-spasswd --with-cyrus-sasl --enable-memberof \
  && make depend \
  && make \
  && make install \
  && make clean

RUN touch /usr/local/etc/openldap/create.ldif \
  cp /usr/local/var/openldap-data/DB_CONFIG.example /usr/local/var/openldap-data/DB_CONFIG

COPY slapd.conf /usr/local/etc/openldap/slapd.conf
RUN sed -i 's/suffix\s\+"dc=my-domain,dc=com"/suffix          \"'"$LDAP_DN_BASE"'\"/' /usr/local/etc/openldap/slapd.conf \
  && sed -i 's/cn=Manager,dc=my-domain,dc=com/'"$LDAP_ROOT_DN"'/' /usr/local/etc/openldap/slapd.conf \
  && sed -i 's/database\s\+mdb/database        '"$LDAP_DATABASE"'/' /usr/local/etc/openldap/slapd.conf \
  && sed -i 's/rootpw\s\+secret/rootpw          '"$LDAP_ROOT_PW"'/' /usr/local/etc/openldap/slapd.conf

COPY create.ldif /usr/local/etc/openldap/create.ldif

RUN sed -i 's/dn: dc=my-domain,dc=com/dn: '"$LDAP_DN_BASE"'/' /usr/local/etc/openldap/create.ldif \
  && sed -i 's/o: Example/o: '"$LDAP_ORGANIZATION"'/' /usr/local/etc/openldap/create.ldif

RUN slapadd -l /usr/local/etc/openldap/create.ldif

COPY add.ldif /usr/local/ect/openldap/add.ldif

#RUN ldapadd -f /usr/local/ect/openldap/add.ldif -x -D "cn=Manager,dc=hpc,dc=com" -w secret

WORKDIR /

EXPOSE 389

#VOLUME ["/data/openldap", "/usr/local/var/openldap-data"]

COPY docker-entrypoint.sh /sbin/docker-entrypoint.sh

RUN chmod 755 /sbin/docker-entrypoint.sh

ENTRYPOINT ["/sbin/docker-entrypoint.sh"]
