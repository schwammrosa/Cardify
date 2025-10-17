import NodeCache from 'node-cache';

// TTL em segundos
const PRODUCT_CACHE_TTL = parseInt(process.env.CACHE_TTL_PRODUCTS) || 21600; // 6 horas
const PRICE_CACHE_TTL = parseInt(process.env.CACHE_TTL_PRICES) || 300; // 5 minutos

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: PRODUCT_CACHE_TTL,
      checkperiod: 600, // Verificar itens expirados a cada 10 minutos
      useClones: false
    });

    // Estatísticas
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }

  get(key) {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.stats.hits++;
      return value;
    }
    this.stats.misses++;
    return null;
  }

  set(key, value, ttl = PRODUCT_CACHE_TTL) {
    this.stats.sets++;
    return this.cache.set(key, value, ttl);
  }

  delete(key) {
    return this.cache.del(key);
  }

  flush() {
    this.cache.flushAll();
    console.log('🗑️  Cache limpo');
  }

  getStats() {
    const keys = this.cache.keys();
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
      : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      totalKeys: keys.length,
      keys
    };
  }
}

export const cacheService = new CacheService();
