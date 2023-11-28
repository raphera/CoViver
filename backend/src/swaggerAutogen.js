const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CoViver API',
        version: '1.0.0',
        description: 'Documentação da API do CoViver',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    securityDefinitions: {
        Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'For accessing the API a valid JWT token must be passed in all the queries in the \'Authorization\' header.\n\nA valid JWT token is generated by the API and retured as answer of a call to the route /login giving a valid user & password. The following syntax must be used in the \'Authorization\' header :\n\nBearer xxxxxx.yyyyyyy.zzzzzz',
        }
    },
};

const outputFile = './dist/swaggerOutput.json';
const endpointsFiles = ['./app.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Documentação do Swagger gerada com sucesso.');
    process.exit(0);
});