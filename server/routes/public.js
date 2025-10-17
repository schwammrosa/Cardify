import { Router } from 'express';
import { getFakeStoreProduct, getFakeStoreByCategory, getFakeStoreCategories } from '../services/fakestore.js';

export const publicRouter = Router();

// GET /api/public/card?asin=1 (usar IDs de 1 a 20 ou qualquer ASIN)
publicRouter.get('/card', async (req, res, next) => {
  try {
    const { asin, tag, marketplace = 'us' } = req.query;

    if (!asin) {
      return res.status(400).json({ error: 'ASIN é obrigatório' });
    }

    const associateTag = tag || process.env.DEFAULT_ASSOCIATE_TAG;
    if (!associateTag) {
      return res.status(400).json({ 
        error: 'Associate Tag não configurado' 
      });
    }

    console.log(`🌐 Buscando da API pública: ASIN ${asin}`);
    
    const card = await getFakeStoreProduct(asin, associateTag, marketplace);
    
    res.json({
      ...card,
      fromCache: false
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/public/category/:category - listar produtos por categoria
publicRouter.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 5 } = req.query;
    
    const products = await getFakeStoreByCategory(category, limit);
    
    res.json({
      category,
      count: products.length,
      products: products.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
        rating: p.rating
      })),
      hint: `Use ID como ASIN em /api/public/card?asin=ID`
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/public/categories - listar todas as categorias
publicRouter.get('/categories', async (req, res, next) => {
  try {
    const categories = await getFakeStoreCategories();
    
    res.json({
      categories,
      endpoints: {
        listCategory: '/api/public/category/:category',
        getProduct: '/api/public/card?asin=ID'
      },
      examples: [
        '/api/public/category/electronics',
        '/api/public/card?asin=1',
        '/api/public/card?asin=B08N5WRWNW (usa hash do ASIN)'
      ]
    });

  } catch (error) {
    next(error);
  }
});
