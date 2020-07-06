docker rm -f -v test-runner
docker run -d --name test-runner --rm -v /var/run/docker.sock:/var/run/docker.sock -v /home/kts2597/tst:/workdir docker.hmc.co.kr/shared/ai-platform/gitlab-runner:ubuntu-v11.3.1

