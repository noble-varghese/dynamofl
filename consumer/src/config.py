import yaml
from constants import DEFAULT_CONFIG_FILE


class Configuration:
    def __init__(self, configuration):
        self.set_parameters(configuration)

    def set_parameters(self, configuration):
        self.__dict__ = configuration


def load_configurations(path_configuration=DEFAULT_CONFIG_FILE):
    with open(path_configuration, "r") as stream:
        try:
            return yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            print(exc)


# Load the configuration from the YAML file
config_data = load_configurations()

# Convert the loaded configuration to a class object
config_data = Configuration(config_data)
