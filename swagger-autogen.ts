// swagger-autogen.ts
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Swagger Autogen TS App',
    description: 'Demo project for automatic Swagger docs',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
