import { Router } from 'express';

export const demoRouter = Router();

// Dados de demonstração (produtos fictícios mas realistas)
const DEMO_PRODUCTS = {
  'B0CYV3SPH7': {
    asin: 'B0CYV3SPH7',
    title: 'Black Skull Creatine Pure Monohydrate - 300g',
    author: 'Black Skull',
    image: {
      large: 'https://m.media-amazon.com/images/I/61P0FUY8GPL._AC_SL1000_.jpg',
      medium: 'https://m.media-amazon.com/images/I/61P0FUY8GPL._AC_SL500_.jpg'
    },
    price: {
      amount: 29.99,
      display: 'R$ 29,99',
      currency: 'BRL',
      savingsAmount: 10.00
    },
    availability: {
      message: 'Em estoque',
      type: 'Now'
    },
    features: [
      'Creatina monohidratada pura de alta qualidade',
      'Aumenta força e performance nos treinos',
      '100% pura - Sem sabor',
      'Embalagem com 300g (100 doses)',
      'Ideal para ganho de massa muscular'
    ],
    rating: {
      stars: 4.7,
      count: 13328
    },
    url: `https://www.amazon.com.br/dp/B0CYV3SPH7?tag=${process.env.DEFAULT_ASSOCIATE_TAG}`,
    affiliateUrl: `https://www.amazon.com.br/dp/B0CYV3SPH7?tag=${process.env.DEFAULT_ASSOCIATE_TAG}`,
    marketplace: 'br',
    timestamp: new Date().toISOString()
  },
  'B08N5WRWNW': {
    asin: 'B08N5WRWNW',
    title: 'Echo Dot (4ª Geração): Smart Speaker com Alexa',
    author: 'Amazon',
    image: {
      large: 'https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SL1000_.jpg',
      medium: 'https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SL500_.jpg'
    },
    price: {
      amount: 349.00,
      display: 'R$ 349,00',
      currency: 'BRL',
      savingsAmount: 50.00
    },
    availability: {
      message: 'Em estoque',
      type: 'Now'
    },
    features: [
      'Novo design esférico com som potente',
      'Controle dispositivos de casa inteligente com a voz',
      'A Alexa está sempre aprendendo',
      'Projetado para proteger sua privacidade',
      'Som de alta qualidade'
    ],
    rating: {
      stars: 4.8,
      count: 98765
    },
    url: `https://www.amazon.com.br/dp/B08N5WRWNW?tag=${process.env.DEFAULT_ASSOCIATE_TAG}`,
    affiliateUrl: `https://www.amazon.com.br/dp/B08N5WRWNW?tag=${process.env.DEFAULT_ASSOCIATE_TAG}`,
    marketplace: 'br',
    timestamp: new Date().toISOString()
  },
  'B0BSHF7WHW': {
    asin: 'B0BSHF7WHW',
    title: 'Kindle Scribe (16 GB) - Primeiro Kindle para ler e escrever',
    author: 'Amazon',
    image: {
      large: 'https://m.media-amazon.com/images/I/61np6N5I0KL._AC_SL1000_.jpg',
      medium: 'https://m.media-amazon.com/images/I/61np6N5I0KL._AC_SL500_.jpg'
    },
    price: {
      amount: 1899.00,
      display: 'R$ 1.899,00',
      currency: 'BRL',
      savingsAmount: 300.00
    },
    availability: {
      message: 'Em estoque',
      type: 'Now'
    },
    features: [
      'Tela de 10.2" (300 ppi) antirreflexo',
      'O primeiro Kindle para ler E escrever',
      'Caneta Premium inclusa - nunca precisa carregar',
      'Bateria de meses, não horas',
      'Ajustável para suas necessidades de leitura'
    ],
    rating: {
      stars: 4.6,
      count: 5432
    },
    url: `https://www.amazon.com.br/dp/B0BSHF7WHW?tag=${process.env.DEFAULT_ASSOCIATE_TAG}`,
    affiliateUrl: `https://www.amazon.com.br/dp/B0BSHF7WHW?tag=${process.env.DEFAULT_ASSOCIATE_TAG}`,
    marketplace: 'br',
    timestamp: new Date().toISOString()
  },
  'DEMO001': {
    asin: 'DEMO001',
    title: 'Notebook Gamer Acer Nitro 5 - Intel Core i5, 16GB, SSD 512GB',
    author: 'Acer',
    image: {
      large: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
      medium: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400'
    },
    price: {
      amount: 4299.00,
      display: 'R$ 4.299,00',
      currency: 'BRL',
      savingsAmount: 700.00
    },
    availability: {
      message: 'Em estoque',
      type: 'Now'
    },
    features: [
      'Processador Intel Core i5 11ª Geração',
      'Placa de vídeo NVIDIA GeForce GTX 1650',
      'Memória RAM 16GB DDR4',
      'Armazenamento SSD 512GB NVMe',
      'Tela Full HD 15.6" 144Hz'
    ],
    rating: {
      stars: 4.5,
      count: 2843
    },
    url: `https://www.amazon.com.br/dp/DEMO001?tag=${process.env.DEFAULT_ASSOCIATE_TAG}`,
    affiliateUrl: `https://www.amazon.com.br/dp/DEMO001?tag=${process.env.DEFAULT_ASSOCIATE_TAG}`,
    marketplace: 'br',
    timestamp: new Date().toISOString()
  }
};

// GET /api/demo/card?asin=XXX
demoRouter.get('/card', (req, res) => {
  const { asin } = req.query;
  
  if (!asin) {
    return res.status(400).json({ error: 'ASIN é obrigatório' });
  }
  
  const product = DEMO_PRODUCTS[asin];
  
  if (!product) {
    return res.status(404).json({ 
      error: 'Produto não encontrado no modo demo',
      availableAsins: Object.keys(DEMO_PRODUCTS),
      hint: 'Use um dos ASINs disponíveis acima ou use /api/card para buscar produtos reais'
    });
  }
  
  // Simular delay da API real
  setTimeout(() => {
    res.json({
      ...product,
      fromCache: false,
      isDemo: true,
      note: '⚠️ MODO DEMONSTRAÇÃO - Dados fictícios. Use /api/card para dados reais da Amazon PA-API.'
    });
  }, 500);
});

// GET /api/demo/list - listar produtos disponíveis
demoRouter.get('/list', (req, res) => {
  res.json({
    message: 'Produtos disponíveis no modo demonstração',
    products: Object.values(DEMO_PRODUCTS).map(p => ({
      asin: p.asin,
      title: p.title,
      price: p.price.display
    })),
    usage: {
      endpoint: '/api/demo/card?asin=XXX',
      example: '/api/demo/card?asin=B0CYV3SPH7'
    }
  });
});
