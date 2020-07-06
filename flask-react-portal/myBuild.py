CUSTOM="FALSE"
ENABLE_CD="TRUE"

BASE="docker.hmc.co.kr/shared/registry/ubuntu:xenial-node8"
MAINTAINER="kim.taeseong@hyundai-autoever.com"

APT_PKGS="zip unzip python3-pip git iputils-ping curl"

EXPOSE_PORTS="8000 3000 5000" 

JUP_ACT="jupyter:password kts2597:Darkstar"
JUP_HUB="TRUE"

PIP_PKGS="python-gitlab GitPython setuptools wheel numpy jupyterlab==0.34.12 jupyterhub==0.9.4 jupyterhub-ldapauthenticator sqlalchemy psycopg2-binary flask marshmallow flask-cors kubernetes tensorflow==1.8.0"
PY_VER="3.6.4"

VIM="TRUE"

SUB_PRJ="flask"
TAG="v0.1"
