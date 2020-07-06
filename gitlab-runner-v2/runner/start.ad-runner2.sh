docker rm -f -v ad-runner2
docker run -d --name ad-runner2 -v /var/run/docker.sock:/var/run/docker.sock -v /home/kts2597/gitlab-runner2:/workdir docker.hmc.co.kr/shared/ai-platform/gitlab-runner:ubuntu-v11.3.1

