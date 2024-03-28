export default {
    server: {
        jwtTokenSecret: {
            doc: 'The JWT token signing algorithm secret',
            format: String,
            default: 'just-a-default-secret',
        },
        port: {
            doc: 'The API listening port. By default is 0 (ephemeral) which serves as a dynamic port for testing purposes. For production use, a specific port must be assigned',
            format: 'port',
            default: 8080,
        },
        host: {
            doc: 'The server hostname. By default is "localhost". For production use, specific host_url can be assigned if needed.',
            format: String,
            default: 'localhost',
        },
    },
    logger: {
        level: {
            doc: 'Which type of logger entries should actually be written to the target medium (e.g., stdout)',
            format: ['debug', 'info', 'warn', 'error', 'critical'],
            default: 'info',
        },
        prettyPrint: {
            doc: 'Weather the logger should be configured to pretty print the output',
            format: Boolean,
            default: true,
        },
        destination: {
            doc: 'destination in which the logger should be written, empty value will be considered as stdout',
            format: '*',
            default: null,
        },
    },
    DB: {
        connectionURI: {
            doc: 'The DB connection user name',
            format: String,
            default: 'mongodb+srv://rapiddocs-admin:<password>@rapiddocs.wa7vlet.mongodb.net/?retryWrites=true&w=majority',
        },
        dbName: {
            doc: 'The default database name. Default is empty and must be a string value.',
            format: String,
            default: 'shop',
        },
    },
};