require('dotenv').config();
import express from 'express';
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerOutput.json');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');

const app = express();

app.use(express.json());

app.use('/api', userRoutes
  // #swagger.tags = ['Users']
);

app.use('/api', authRoutes
  // #swagger.tags = ['Auth']
);

app.use('/api', accountRoutes
  // #swagger.tags = ['Account']
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (process.env.NODE_ENV === 'production') {
  const staticFilesPath = path.join(__dirname, './public');
  app.use(express.static(staticFilesPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(staticFilesPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'production') {
  const cors = require('cors');
  app.use(cors());
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
