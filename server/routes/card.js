import { Router } from 'express';
import { getProductCard } from '../services/amazon.js';
import { cacheService } from '../services/cache.js';
import { getFakeStoreProduct } from '../services/fakestore.js';

export const cardRouter = Router();

// GET /api/card?asin=B08N5WRWNW&tag=seu-tag-20&marketplace=us
cardRouter.get('/', async (req, res, next) => {
  try {
    const { asin, tag, marketplace = 'us' } = req.query;

    // Validações
    if (!asin) {
      return res.status(400).json({ error: 'ASIN é obrigatório' });
    }

    const associateTag = tag || process.env.DEFAULT_ASSOCIATE_TAG;
    if (!associateTag) {
      return res.status(400).json({ 
        error: 'Associate Tag não configurado. Forneça via query param "tag" ou configure DEFAULT_ASSOCIATE_TAG no .env' 
      });
    }

    // Verificar cache
    const cacheKey = `card:${marketplace}:${asin}:${associateTag}`;
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      console.log(`✅ Cache hit: ${cacheKey}`);
      return res.json({ ...cached, fromCache: true });
    }

    // Buscar da Amazon PA-API
    console.log(`🔍 Buscando produto: ${asin} no marketplace ${marketplace}`);
    
    try {
      const card = await getProductCard(asin, associateTag, marketplace);

      // Salvar no cache
      cacheService.set(cacheKey, card);

      res.json({ ...card, fromCache: false });
      
    } catch (amazonError) {
      // Fallback automático para API pública se Amazon falhar
      if (amazonError.message.includes('Rate limit') || amazonError.message.includes('429')) {
        console.log('⚠️  Amazon rate limit - usando API pública como fallback');
        
        const publicCard = await getFakeStoreProduct(asin, associateTag, marketplace);
        
        res.json({
          ...publicCard,
          fromCache: false,
          fallbackReason: 'Amazon PA-API rate limit excedido - usando API pública temporariamente'
        });
      } else {
        throw amazonError;
      }
    }

  } catch (error) {
    next(error);
  }
});

// POST /api/card/batch - buscar múltiplos produtos
cardRouter.post('/batch', async (req, res, next) => {
  try {
    const { asins, tag, marketplace = 'us' } = req.body;

    if (!asins || !Array.isArray(asins) || asins.length === 0) {
      return res.status(400).json({ error: 'Array de ASINs é obrigatório' });
    }

    if (asins.length > 10) {
      return res.status(400).json({ error: 'Máximo de 10 ASINs por requisição' });
    }

    const associateTag = tag || process.env.DEFAULT_ASSOCIATE_TAG;
    if (!associateTag) {
      return res.status(400).json({ 
        error: 'Associate Tag não configurado' 
      });
    }

    const results = await Promise.allSettled(
      asins.map(asin => getProductCard(asin, associateTag, marketplace))
    );

    const cards = results.map((result, index) => ({
      asin: asins[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }));

    res.json({ cards });

  } catch (error) {
    next(error);
  }
});
