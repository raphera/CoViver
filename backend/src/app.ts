require('dotenv').config();
import express from 'express';
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerOutput.json');
const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
