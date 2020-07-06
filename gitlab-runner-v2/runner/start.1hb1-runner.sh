docker rm -f -v 1hb1-runner
docker run -d --name 1hb1-runner -v /var/run/docker.sock:/var/run/docker.sock -v /home/kts2597/gitlab-runner2:/workdir docker.hmc.co.kr/shared/ai-platform/gitlab-runner:ubuntu-v11.3.1

