import Bottleneck from 'bottleneck';

// Amazon PA-API limita a 1 requisição por segundo inicialmente
const MAX_REQUESTS_PER_SECOND = parseInt(process.env.MAX_REQUESTS_PER_SECOND) || 1;

export const rateLimiter = new Bottleneck({
  reservoir: MAX_REQUESTS_PER_SECOND, // Número inicial de "tokens"
  reservoirRefreshAmount: MAX_REQUESTS_PER_SECOND, // Repor tokens
  reservoirRefreshInterval: 1000, // A cada 1 segundo
  maxConcurrent: 1, // 1 requisição por vez
  minTime: 2000 // 2 segundos entre requisições (mais conservador)
});

rateLimiter.on('failed', async (error, jobInfo) => {
  console.warn(`⚠️  Rate limiter: Job ${jobInfo.options.id} falhou`);
  
  // Retry automático em caso de rate limit (429)
  if (error.message.includes('429')) {
    const retryAfter = 2000; // 2 segundos
    console.log(`🔄 Tentando novamente em ${retryAfter}ms...`);
    return retryAfter;
  }
});

rateLimiter.on('retry', (error, jobInfo) => {
  console.log(`🔄 Tentativa ${jobInfo.retryCount} para job ${jobInfo.options.id}`);
});
