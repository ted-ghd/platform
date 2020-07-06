docker rm -f -v ai-portal-runner
docker run -d --name ai-portal-runner -v /var/run/docker.sock:/var/run/docker.sock -v /home/kts2597/gitlab-runner:/workdir gitlab-runner:web-portal

