import { Router } from 'express';

export const testRouter = Router();

// Endpoint de teste - verifica credenciais SEM fazer requisição real
testRouter.get('/', (req, res) => {
  const hasAccessKey = !!process.env.PA_ACCESS_KEY;
  const hasSecretKey = !!process.env.PA_SECRET_KEY;
  const hasTag = !!process.env.DEFAULT_ASSOCIATE_TAG;
  
  // Mostrar apenas primeiros/últimos caracteres por segurança
  const maskCredential = (cred) => {
    if (!cred) return 'NÃO CONFIGURADO';
    if (cred.length < 8) return 'MUITO CURTO';
    return `${cred.substring(0, 4)}...${cred.substring(cred.length - 4)}`;
  };
  
  res.json({
    status: 'ok',
    credentials: {
      PA_ACCESS_KEY: {
        configured: hasAccessKey,
        value: maskCredential(process.env.PA_ACCESS_KEY),
        startsWithAK: process.env.PA_ACCESS_KEY?.startsWith('AK') || false,
        length: process.env.PA_ACCESS_KEY?.length || 0
      },
      PA_SECRET_KEY: {
        configured: hasSecretKey,
        value: maskCredential(process.env.PA_SECRET_KEY),
        length: process.env.PA_SECRET_KEY?.length || 0
      },
      DEFAULT_ASSOCIATE_TAG: {
        configured: hasTag,
        value: process.env.DEFAULT_ASSOCIATE_TAG || 'NÃO CONFIGURADO',
        endsWithDash20: process.env.DEFAULT_ASSOCIATE_TAG?.endsWith('-20') || false
      }
    },
    environment: process.env.NODE_ENV,
    warning: hasAccessKey && hasSecretKey && hasTag 
      ? '✅ Todas as credenciais configuradas'
      : '❌ Faltam credenciais - verifique o arquivo .env'
  });
});
