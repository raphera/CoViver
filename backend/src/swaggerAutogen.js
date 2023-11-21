const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CoViver API',
        version: '1.0.0',
        description: 'Documentação da API do CoViver',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './dist/swaggerOutput.json';
const endpointsFiles = ['./app.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Documentação do Swagger gerada com sucesso.');
    process.exit(0);
});