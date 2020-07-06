ENABLE_CD="FALSE"
UPT="FALSE"

IMAGE_PATH="docker.hmc.co.kr/group/build/test:v0.1"
POD_NAME="kts-6400256"

TARGET_HOST="ai001"
MUL_DEP="1"

CON_CNT="1"

CON_NAME0="sshd"
CON_CMD0="/usr/sbin/sshd"
CON_ARGS0="-D"
CON_PORT0="22"
EXP_PORT0="30050"

CON0_GPUS="0"
