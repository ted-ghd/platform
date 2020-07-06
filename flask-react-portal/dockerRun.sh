# run on 10.10.48.175

docker rm -f -v flask-playground
docker run --name flask-playground --rm -d -p 8000:8000 -p 4200:4200 -p 5000:5000 -p 3000:3000 -v /home/E640025/workspace/flask/workspace:/data docker.hmc.co.kr/shared/ai
-platform/flask-react-portal:v0.1