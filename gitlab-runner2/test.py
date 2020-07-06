

pod_name = 'ai007-kts-test-0-deployment'


prefix = pod_name[0:len(pod_name)-10]
service_name = prefix + "service"

print(service_name)