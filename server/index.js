import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { cardRouter } from './routes/card.js';
import { healthRouter } from './routes/health.js';
import { testRouter } from './routes/test.js';
import { demoRouter } from './routes/demo.js';
import { publicRouter } from './routes/public.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares
app.use(cors());
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/api/health', healthRouter);
app.use('/api/test', testRouter);
app.use('/api/demo', demoRouter);
app.use('/api/public', publicRouter);
app.use('/api/card', cardRouter);

// Handler de erros global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Associate Tag: ${process.env.DEFAULT_ASSOCIATE_TAG || 'não configurado'}`);
});
