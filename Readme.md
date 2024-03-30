# DynamoFL

This README provides instructions on how to set up and run an application built using Node.js and Python. It includes commands for script startup by modifying the `application/dynamofl.yml` file.

## Prerequisites

- Node.js installed on your system.
- Python installed on your system.
- A YAML parser installed for Python, such as PyYAML.
- virtualenv setup to initiallise a virtual env

## Installation

1. Clone the repository to your local machine.
2. Navigate to the application directory.
3. Install the required Node.js dependencies by running:

```Node
npm install
```

## Configuration

Modify the `sampleYaml.yml` file to configure your application settings. Here's a template for the YAML file:

pip install -r requirements.txt


## Configuration

Modify the `application/dynamofl.yml` file to configure your application settings. Here's a template for the YAML file:


- `app.name`: The name of your application.
- `app.version`: The version of your application.
- `app.description`: A brief description of your application.
- `app.node_port`: The port on which the Node.js server will run.
- `app.python_port`: The port on which the Python server will run.

## Running the Application

1. Start the Node.js server by running: 
```bash
make run-application-server
```



2. Start the Python server (Consumer) by running:
```bash
make run-consumer
```

