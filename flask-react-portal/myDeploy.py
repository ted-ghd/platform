ENABLE_CD="TRUE"

TARGET_HOST="test14"

SHM_SIZE="16G"

PVC_CNT="2"
VOL_NAME0="autoever-flask-input"
VOL_SIZE0="10G"
VOL_NAME1="autoever-flask-output"
VOL_SIZE1="1G"

CON_CNT="1"

CON_ARGS0="-f /etc/jupyterhub/jupyterhub_config.py"
CON_CMD0="jupyterhub"
CON_NAME0="jupyterhub"
CON_PORT0="8000"

CON0_GPUS="0"

CON0_VOL_CNT="2"
CON0_VOL_NAME0="autoever-flask-input"
CON0_VOL_PATH0="/input"
CON0_VOL_NAME1="autoever-flask-output"
CON0_VOL_PATH1="/output"
