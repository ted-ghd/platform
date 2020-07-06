docker rm -f -v adas2-runner
docker run -d --name adas2-runner --rm -v /var/run/docker.sock:/var/run/docker.sock -v /home/kts2597/gitlab-runner:/workdir docker.hmc.co.kr/shared/ai-platform/gitlab-runner:ubuntu-v11.3.1

