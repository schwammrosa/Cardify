import fetch from 'node-fetch';

/**
 * FakeStore API - API pública para testes
 * Docs: https://fakestoreapi.com/
 */

const FAKESTORE_BASE_URL = 'https://fakestoreapi.com';

// Mapeamento de categorias para ASINs fictícios
const CATEGORY_MAP = {
  electronics: [1, 2, 3, 4, 5, 6],
  jewelery: [7, 8],
  "men's clothing": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  "women's clothing": [19, 20]
};

/**
 * Busca produto da FakeStore API
 */
export async function getFakeStoreProduct(asin, associateTag, marketplace = 'us') {
  try {
    // Se ASIN é numérico, buscar direto
    let productId;
    
    if (/^\d+$/.test(asin)) {
      // ASIN é um número (ID FakeStore)
      productId = parseInt(asin);
    } else {
      // ASIN não é numérico, usar hash para gerar ID consistente
      productId = Math.abs(hashCode(asin) % 20) + 1;
    }

    console.log(`🧪 Buscando produto FakeStore ID: ${productId}`);

    const response = await fetch(`${FAKESTORE_BASE_URL}/products/${productId}`);
    
    if (!response.ok) {
      throw new Error(`FakeStore API error: ${response.status}`);
    }

    const product = await response.json();
    
    // Transformar para formato Cardify
    return transformFakeStoreToCard(product, asin, associateTag, marketplace);

  } catch (error) {
    console.error('Erro ao buscar da FakeStore API:', error);
    throw error;
  }
}

/**
 * Lista produtos por categoria
 */
export async function getFakeStoreByCategory(category = 'electronics', limit = 5) {
  try {
    const response = await fetch(
      `${FAKESTORE_BASE_URL}/products/category/${category}?limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`FakeStore API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    throw error;
  }
}

/**
 * Lista todas as categorias disponíveis
 */
export async function getFakeStoreCategories() {
  try {
    const response = await fetch(`${FAKESTORE_BASE_URL}/products/categories`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return Object.keys(CATEGORY_MAP);
  }
}

/**
 * Transforma produto FakeStore em formato Cardify
 */
function transformFakeStoreToCard(product, originalAsin, associateTag, marketplace) {
  // Converter preço para moeda do marketplace
  const priceMultiplier = marketplace === 'br' ? 5.0 : 1.0;
  const currency = marketplace === 'br' ? 'BRL' : 'USD';
  const currencySymbol = marketplace === 'br' ? 'R$' : '$';
  
  const price = (product.price * priceMultiplier).toFixed(2);

  return {
    asin: originalAsin,
    title: product.title,
    author: product.category || 'Generic Brand',
    
    image: {
      large: product.image,
      medium: product.image
    },
    
    price: {
      amount: parseFloat(price),
      display: `${currencySymbol} ${price}`,
      currency: currency,
      savingsAmount: (parseFloat(price) * 0.15).toFixed(2) // 15% desconto fictício
    },
    
    availability: {
      message: 'Em estoque',
      type: 'Now'
    },
    
    features: [
      product.description,
      `Categoria: ${product.category}`,
      'Frete grátis disponível',
      'Garantia do fabricante',
      'Entrega rápida'
    ],
    
    rating: {
      stars: product.rating?.rate || 4.5,
      count: product.rating?.count || 100
    },
    
    url: `https://www.amazon.com/dp/${originalAsin}?tag=${associateTag}`,
    affiliateUrl: `https://www.amazon.com/dp/${originalAsin}?tag=${associateTag}`,
    
    marketplace,
    timestamp: new Date().toISOString(),
    
    // Metadados
    isPublicAPI: true,
    apiSource: 'FakeStore API',
    note: '⚠️ Dados de API pública para testes. Use com marketplace real para produção.'
  };
}

/**
 * Gera hash de string (para converter ASIN em ID numérico)
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Busca múltiplos produtos
 */
export async function getFakeStoreProductsBatch(asins, associateTag, marketplace = 'us') {
  const promises = asins.map(asin => 
    getFakeStoreProduct(asin, associateTag, marketplace)
      .catch(error => ({ asin, error: error.message, success: false }))
  );
  
  return await Promise.all(promises);
}
