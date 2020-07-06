docker rm -f -v ad-runner
docker run -d --name ad-runner --rm -v /var/run/docker.sock:/var/run/docker.sock -v /home/kts2597/gitlab-runner:/workdir docker.hmc.co.kr/shared/ai-platform/gitlab-runner:ubuntu-v11.3.1

