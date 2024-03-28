import docker
from docker import DockerClient
client = DockerClient.from_env()


def create_container_b():
    container = client.containers.run("your_image_name", detach=True)
    print(f"Container B created with ID: {container.id}")


# Example condition check
if condition_met:
    create_container_b()
