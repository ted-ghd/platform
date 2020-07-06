#KKK

RUN apt-get update
RUN apt-get update && apt-get install -y \
        software-properties-common \
        wget curl git cmake

RUN apt-get update && apt-get install -y \
        libnlopt-dev freeglut3-dev qtbase5-dev \
        libqt5opengl5-dev libssh2-1-dev libarmadillo-dev libpcap-dev gksu \
	libglew-dev

# Develop
RUN apt-get install -y \
        libboost-all-dev \
        libflann-dev \
        libgsl0-dev \
        libgoogle-perftools-dev \
        libeigen3-dev

# Additional PKG
RUN apt-get install -y \
	python3-tk \ 
	tk-dev \
	nano

# python Packages
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install Cython Pillow easydict graphviz numpy numba opencv-python scikit-learn scikit-image scipy sklearn shapely tqdm lxml
RUN python3 -m pip install Keras

ENV PKG_CONFIG_PATH $PKG_CONFIG_PATH:/usr/local/lib/pkgconfig

CMD ["/usr/sbin/sshd", "-D"]
