# DynamoFL

This README provides instructions on how to set up and run an application built using Node.js and Python. It includes commands for script startup by modifying the `application/dynamofl.yml` file.

## Prerequisites

- Node.js installed on your system.
- Python installed on your system.
- A YAML parser installed for Python, such as PyYAML.
- virtualenv setup to initiallise a virtual env
- Postgres db

## Installation

1. Clone the repository to your local machine.
2. Navigate to the application directory.
3. Install the required Node.js dependencies by running:

```Node
npm install
```


## Configuration

Modify the `dynamofl.yml` file to configure your application settings.


## Running the Application

1. Start the Node.js server by running: 
```bash
make run-application-server
```



2. Start the Python server (Consumer) by running:
```bash
make run-consumer
```

