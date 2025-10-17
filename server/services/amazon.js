import fetch from 'node-fetch';
import aws4 from 'aws4';
import { rateLimiter } from './rateLimiter.js';

// Configuração de marketplaces
const MARKETPLACES = {
  us: {
    host: 'webservices.amazon.com',
    region: 'us-east-1',
    domain: 'www.amazon.com'
  },
  br: {
    host: 'webservices.amazon.com.br',
    region: 'us-east-1',
    domain: 'www.amazon.com.br'
  },
  uk: {
    host: 'webservices.amazon.co.uk',
    region: 'eu-west-1',
    domain: 'www.amazon.co.uk'
  },
  ca: {
    host: 'webservices.amazon.ca',
    region: 'us-east-1',
    domain: 'www.amazon.ca'
  },
  de: {
    host: 'webservices.amazon.de',
    region: 'eu-west-1',
    domain: 'www.amazon.de'
  },
  es: {
    host: 'webservices.amazon.es',
    region: 'eu-west-1',
    domain: 'www.amazon.es'
  },
  fr: {
    host: 'webservices.amazon.fr',
    region: 'eu-west-1',
    domain: 'www.amazon.fr'
  },
  it: {
    host: 'webservices.amazon.it',
    region: 'eu-west-1',
    domain: 'www.amazon.it'
  },
  jp: {
    host: 'webservices.amazon.co.jp',
    region: 'us-west-2',
    domain: 'www.amazon.co.jp'
  }
};

const PA_PATH = '/paapi5/getitems';

/**
 * Assina requisição com AWS Signature V4
 */
function signPaapiRequest(body, marketplace) {
  const config = MARKETPLACES[marketplace];
  const bodyStr = JSON.stringify(body);
  
  const opts = {
    host: config.host,
    method: 'POST',
    path: PA_PATH,
    service: 'ProductAdvertisingAPI',
    region: config.region,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Host': config.host,
      'Content-Length': Buffer.byteLength(bodyStr),
      'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems',
      'Content-Encoding': 'amz-1.0'
    },
    body: bodyStr
  };

  // Assinar com credenciais AWS
  aws4.sign(opts, {
    accessKeyId: process.env.PA_ACCESS_KEY,
    secretAccessKey: process.env.PA_SECRET_KEY
  });

  return { opts, bodyStr };
}

/**
 * Busca informações de um produto na Amazon PA-API
 */
export async function getProductCard(asin, associateTag, marketplace = 'us') {
  // Validar marketplace
  const config = MARKETPLACES[marketplace];
  if (!config) {
    throw new Error(`Marketplace inválido: ${marketplace}. Suportados: ${Object.keys(MARKETPLACES).join(', ')}`);
  }

  // Validar credenciais
  if (!process.env.PA_ACCESS_KEY || !process.env.PA_SECRET_KEY) {
    throw new Error('Credenciais PA-API não configuradas. Configure PA_ACCESS_KEY e PA_SECRET_KEY no .env');
  }

  // Construir requisição com recursos básicos compatíveis
  const requestBody = {
    ItemIds: [asin],
    Resources: [
      'ItemInfo.Title',
      'ItemInfo.ByLineInfo',
      'ItemInfo.Features',
      'Images.Primary.Large',
      'Images.Primary.Medium',
      'Offers.Listings.Price'
    ],
    PartnerTag: associateTag,
    PartnerType: 'Associates',
    Marketplace: config.domain
  };

  const { opts, bodyStr } = signPaapiRequest(requestBody, marketplace);

  // Aplicar rate limiting - a requisição deve estar DENTRO do schedule
  try {
    const data = await rateLimiter.schedule(async () => {
      const response = await fetch(`https://${config.host}${PA_PATH}`, {
        method: 'POST',
        headers: opts.headers,
        body: bodyStr
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro PA-API:', errorText);
        console.error('📊 Status:', response.status);
        console.error('🔗 URL:', `https://${config.host}${PA_PATH}`);
        console.error('🏷️  Marketplace:', marketplace);
        console.error('🎯 ASIN:', asin);
        
        if (response.status === 429) {
          throw new Error('Rate limit excedido. Aguarde 2 minutos e tente novamente.');
        }
        
        if (response.status === 401 || response.status === 403) {
          throw new Error('Credenciais inválidas ou sem acesso à PA-API. Verifique: https://associados.amazon.com.br/assoc_credentials/home');
        }
        
        throw new Error(`Erro PA-API (${response.status}): ${errorText}`);
      }

      return await response.json();
    });
    
    // Verificar se o item foi encontrado
    const item = data.ItemsResult?.Items?.[0];
    if (!item) {
      const errors = data.Errors || [];
      const errorMsg = errors.length > 0 
        ? errors[0].Message 
        : 'Produto não encontrado';
      throw new Error(errorMsg);
    }

    // Transformar resposta em card
    return transformToCard(item, associateTag, config.domain, marketplace);

  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    throw error;
  }
}

/**
 * Transforma resposta da PA-API em formato de card
 */
function transformToCard(item, associateTag, domain, marketplace) {
  const itemInfo = item.ItemInfo || {};
  const images = item.Images?.Primary || {};
  
  // Buscar TODOS os offers disponíveis e pegar o menor preço
  const allListings = item.Offers?.Listings || [];
  let lowestPrice = null;
  
  if (allListings.length > 0) {
    // Mapear todos os preços disponíveis
    const prices = allListings
      .map(listing => listing.Price)
      .filter(price => price && price.Amount)
      .sort((a, b) => a.Amount - b.Amount);
    
    // Pegar o menor preço (à vista, PIX, etc)
    lowestPrice = prices[0] || null;
  }

  return {
    asin: item.ASIN,
    title: itemInfo.Title?.DisplayValue || 'Título não disponível',
    
    // Informações do autor/marca
    author: itemInfo.ByLineInfo?.Brand?.DisplayValue || 
            itemInfo.ByLineInfo?.Manufacturer?.DisplayValue || 
            null,
    
    // Imagens
    image: {
      large: images.Large?.URL || null,
      medium: images.Medium?.URL || null
    },
    
    // Preço (menor valor disponível)
    price: {
      amount: lowestPrice?.Amount || null,
      display: lowestPrice?.DisplayAmount || 'Ver preço na Amazon',
      currency: lowestPrice?.Currency || 'BRL',
      savingsAmount: allListings[0]?.SavingBasis ? 
        (allListings[0].SavingBasis.Amount - (lowestPrice?.Amount || 0)) : null
    },
    
    // Disponibilidade (não solicitada na API, valor padrão)
    availability: {
      message: 'Disponível na Amazon',
      type: 'Available'
    },
    
    // Features e descrição
    features: itemInfo.Features?.DisplayValues || [],
    
    // Avaliações (não disponível sem acesso ao recurso)
    rating: {
      stars: null,
      count: null
    },
    
    // Links
    url: item.DetailPageURL || `https://${domain}/dp/${item.ASIN}?tag=${associateTag}`,
    affiliateUrl: `https://${domain}/dp/${item.ASIN}?tag=${associateTag}`,
    
    // Metadata
    marketplace,
    timestamp: new Date().toISOString()
  };
}
