# 🔌 Documentação da API - Cardify

Documentação completa dos endpoints da API do Cardify.

## 📍 Base URL

```
Development: http://localhost:3333
Production: https://seu-dominio.com
```

---

## 🔍 Endpoints

### 1. Health Check

Verifica status do servidor.

**Endpoint:** `GET /api/health`

**Parâmetros:** Nenhum

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

**Códigos de Status:**
- `200` - OK
- `500` - Erro interno

**Exemplo:**
```bash
curl http://localhost:3333/api/health
```

---

### 2. Gerar Card de Produto

Busca informações de um produto e gera um card.

**Endpoint:** `GET /api/card`

**Parâmetros Query:**

| Parâmetro | Tipo | Obrigatório | Descrição | Exemplo |
|-----------|------|-------------|-----------|---------|
| `asin` | string | ✅ Sim | ASIN do produto | `B08N5WRWNW` |
| `tag` | string | ❌ Não | Associate Tag (usa padrão se omitido) | `seutag-20` |
| `marketplace` | string | ❌ Não | Marketplace (padrão: `us`) | `br`, `uk`, `ca` |

**Marketplaces Suportados:**
- `us` - Estados Unidos 🇺🇸
- `br` - Brasil 🇧🇷
- `uk` - Reino Unido 🇬🇧
- `ca` - Canadá 🇨🇦
- `de` - Alemanha 🇩🇪
- `es` - Espanha 🇪🇸
- `fr` - França 🇫🇷
- `it` - Itália 🇮🇹
- `jp` - Japão 🇯🇵

**Resposta Sucesso (200):**
```json
{
  "asin": "B08N5WRWNW",
  "title": "Echo Dot (4th Gen) | Smart speaker with Alexa",
  "author": "Amazon",
  "image": {
    "large": "https://m.media-amazon.com/images/I/71...",
    "medium": "https://m.media-amazon.com/images/I/71..."
  },
  "price": {
    "amount": 49.99,
    "display": "$49.99",
    "currency": "USD",
    "savingsAmount": 10.00
  },
  "availability": {
    "message": "In Stock",
    "type": "Now"
  },
  "features": [
    "Meet Echo Dot - Our most popular smart speaker",
    "Ready to help - Ask Alexa to play music...",
    "Voice control your smart home - ..."
  ],
  "rating": {
    "stars": 4.7,
    "count": 123456
  },
  "url": "https://www.amazon.com/dp/B08N5WRWNW?tag=seutag-20",
  "affiliateUrl": "https://www.amazon.com/dp/B08N5WRWNW?tag=seutag-20",
  "marketplace": "us",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "fromCache": false
}
```

**Resposta Erro (400):**
```json
{
  "error": "ASIN é obrigatório"
}
```

**Resposta Erro (404):**
```json
{
  "error": "Produto não encontrado"
}
```

**Resposta Erro (429):**
```json
{
  "error": "Rate limit excedido. Aguarde antes de fazer novas requisições."
}
```

**Resposta Erro (500):**
```json
{
  "error": "Erro interno do servidor",
  "details": "..."
}
```

**Exemplos:**

```bash
# Buscar produto no marketplace US
curl "http://localhost:3333/api/card?asin=B08N5WRWNW"

# Buscar produto no marketplace BR com tag customizada
curl "http://localhost:3333/api/card?asin=B08N5WRWNW&marketplace=br&tag=meutag-20"

# Com jq para formatar JSON
curl "http://localhost:3333/api/card?asin=B08N5WRWNW" | jq
```

**JavaScript/Fetch:**
```javascript
async function getProductCard(asin, marketplace = 'us') {
  const params = new URLSearchParams({ asin, marketplace });
  const response = await fetch(`/api/card?${params}`);
  
  if (!response.ok) {
    throw new Error(`Erro: ${response.status}`);
  }
  
  return await response.json();
}

// Uso
const card = await getProductCard('B08N5WRWNW', 'us');
console.log(card.title, card.price.display);
```

**Python:**
```python
import requests

def get_product_card(asin, marketplace='us', tag=None):
    params = {'asin': asin, 'marketplace': marketplace}
    if tag:
        params['tag'] = tag
    
    response = requests.get(
        'http://localhost:3333/api/card',
        params=params
    )
    response.raise_for_status()
    return response.json()

# Uso
card = get_product_card('B08N5WRWNW')
print(card['title'], card['price']['display'])
```

---

### 3. Buscar Múltiplos Produtos (Batch)

Busca informações de vários produtos de uma vez (até 10).

**Endpoint:** `POST /api/card/batch`

**Content-Type:** `application/json`

**Body:**
```json
{
  "asins": ["B08N5WRWNW", "B09B93ZDG4", "B0BSHF7WHW"],
  "tag": "seutag-20",
  "marketplace": "us"
}
```

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `asins` | array | ✅ Sim | Array de ASINs (max 10) |
| `tag` | string | ❌ Não | Associate Tag |
| `marketplace` | string | ❌ Não | Marketplace (padrão: `us`) |

**Resposta Sucesso (200):**
```json
{
  "cards": [
    {
      "asin": "B08N5WRWNW",
      "success": true,
      "data": {
        "asin": "B08N5WRWNW",
        "title": "Echo Dot...",
        "price": {...},
        ...
      },
      "error": null
    },
    {
      "asin": "B09B93ZDG4",
      "success": true,
      "data": {...},
      "error": null
    },
    {
      "asin": "INVALIDO",
      "success": false,
      "data": null,
      "error": "Produto não encontrado"
    }
  ]
}
```

**Exemplo:**

```bash
curl -X POST http://localhost:3333/api/card/batch \
  -H "Content-Type: application/json" \
  -d '{
    "asins": ["B08N5WRWNW", "B09B93ZDG4"],
    "marketplace": "us"
  }'
```

**JavaScript:**
```javascript
async function getBatchCards(asins, marketplace = 'us') {
  const response = await fetch('/api/card/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ asins, marketplace })
  });
  
  return await response.json();
}

// Uso
const { cards } = await getBatchCards([
  'B08N5WRWNW',
  'B09B93ZDG4',
  'B0BSHF7WHW'
]);

cards.forEach(card => {
  if (card.success) {
    console.log(card.data.title);
  } else {
    console.error(`Erro para ${card.asin}:`, card.error);
  }
});
```

---

## 🔐 Autenticação

A API atualmente **não requer autenticação** para uso.

Para ambientes de produção, considere adicionar:
- API Keys
- Rate limiting por IP
- JWT tokens

---

## 📊 Rate Limiting

### Limites Atuais

- **Backend:** Limitado pela Amazon PA-API (1 req/s inicialmente)
- **Cache:** 6 horas para produtos, 5 minutos para preços
- **Retry automático:** Em caso de 429 (Rate Limit)

### Headers de Rate Limit (futuro)

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1610000000
```

---

## 💾 Cache

### Como Funciona

1. Ao buscar um produto, verifica cache primeiro
2. Se encontrado e válido, retorna imediatamente
3. Se não encontrado, busca da PA-API e cachea

### TTL (Time To Live)

- **Produtos:** 6 horas (configurável em `.env`)
- **Preços:** 5 minutos (mais volátil)

### Indicador de Cache

A resposta inclui `fromCache: true/false`:

```json
{
  "asin": "B08N5WRWNW",
  "title": "...",
  "fromCache": true  // ← Veio do cache
}
```

---

## 🚨 Códigos de Erro

| Código | Significado | Descrição |
|--------|-------------|-----------|
| `200` | OK | Requisição bem-sucedida |
| `400` | Bad Request | Parâmetros inválidos |
| `404` | Not Found | Produto não encontrado |
| `429` | Too Many Requests | Rate limit excedido |
| `500` | Internal Server Error | Erro no servidor |
| `502` | Bad Gateway | Erro na PA-API |

---

## 📝 Exemplos Completos

### Exemplo 1: Site de Reviews

```html
<!DOCTYPE html>
<html>
<head>
  <title>Meu Review</title>
  <style>
    .product-card {
      max-width: 400px;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin: 20px auto;
    }
    .product-image { width: 100%; }
    .price { font-size: 24px; font-weight: bold; }
    .buy-button {
      display: block;
      width: 100%;
      padding: 12px;
      background: #FF9900;
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <h1>Review: Echo Dot 4ª Geração</h1>
  
  <div id="product-card" class="product-card">
    Carregando...
  </div>

  <script>
    async function loadProduct() {
      const response = await fetch(
        '/api/card?asin=B08N5WRWNW&marketplace=us'
      );
      const product = await response.json();
      
      document.getElementById('product-card').innerHTML = `
        <img src="${product.image.large}" alt="${product.title}" class="product-image">
        <h2>${product.title}</h2>
        <p class="price">${product.price.display}</p>
        <a href="${product.affiliateUrl}" class="buy-button" target="_blank">
          Comprar na Amazon
        </a>
        <p style="font-size: 12px; color: #666; margin-top: 10px;">
          As an Amazon Associate I earn from qualifying purchases.
        </p>
      `;
    }
    
    loadProduct();
  </script>
</body>
</html>
```

### Exemplo 2: Comparação de Produtos

```javascript
async function compareProducts(asins) {
  const { cards } = await fetch('/api/card/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ asins })
  }).then(r => r.json());
  
  // Filtrar apenas sucessos
  const products = cards
    .filter(c => c.success)
    .map(c => c.data);
  
  // Comparar preços
  console.log('Comparação de Preços:');
  products.forEach(p => {
    console.log(`${p.title}: ${p.price.display}`);
  });
  
  // Encontrar mais barato
  const cheapest = products.reduce((min, p) => 
    p.price.amount < min.price.amount ? p : min
  );
  
  console.log(`\nMais barato: ${cheapest.title}`);
  return cheapest;
}

// Uso
compareProducts([
  'B08N5WRWNW',  // Echo Dot
  'B09B93ZDG4',  // Echo Show
  'B0BSHF7WHW'   // Kindle
]);
```

### Exemplo 3: Blog Post com Produtos

```python
from flask import Flask, render_template
import requests

app = Flask(__name__)
CARDIFY_API = 'http://localhost:3333/api/card'

@app.route('/review/<asin>')
def review(asin):
    # Buscar produto
    response = requests.get(CARDIFY_API, params={
        'asin': asin,
        'marketplace': 'us'
    })
    product = response.json()
    
    return render_template('review.html', product=product)

if __name__ == '__main__':
    app.run(debug=True)
```

```html
<!-- templates/review.html -->
<div class="product-card">
  <img src="{{ product.image.large }}" alt="{{ product.title }}">
  <h2>{{ product.title }}</h2>
  
  {% if product.rating.stars %}
    <div class="rating">
      ⭐ {{ product.rating.stars }} ({{ product.rating.count }} reviews)
    </div>
  {% endif %}
  
  <p class="price">{{ product.price.display }}</p>
  
  <a href="{{ product.affiliateUrl }}" class="btn">
    Ver na Amazon
  </a>
</div>
```

---

## 🔧 Testando a API

### Com cURL

```bash
# GET simples
curl "http://localhost:3333/api/card?asin=B08N5WRWNW"

# GET com todos os parâmetros
curl "http://localhost:3333/api/card?asin=B08N5WRWNW&marketplace=br&tag=meutag-20"

# POST batch
curl -X POST http://localhost:3333/api/card/batch \
  -H "Content-Type: application/json" \
  -d '{"asins":["B08N5WRWNW","B09B93ZDG4"]}'

# Salvar resposta em arquivo
curl "http://localhost:3333/api/card?asin=B08N5WRWNW" > produto.json
```

### Com HTTPie

```bash
# GET
http GET localhost:3333/api/card asin==B08N5WRWNW

# POST
http POST localhost:3333/api/card/batch \
  asins:='["B08N5WRWNW"]' \
  marketplace=us
```

### Com Postman

1. Criar nova requisição GET
2. URL: `http://localhost:3333/api/card`
3. Params:
   - `asin`: `B08N5WRWNW`
   - `marketplace`: `us`
4. Send

---

## 📚 Referências

- [Amazon PA-API Docs](https://webservices.amazon.com/paapi5/documentation/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

---

## 💡 Dicas

### Performance

1. **Use cache sempre que possível**
   - Produtos não mudam frequentemente
   - Preços mudam mais, mas cache de 5min é aceitável

2. **Batch requests quando possível**
   - Mais eficiente que múltiplas requisições
   - Respeita rate limits melhor

3. **Implemente retry logic**
   ```javascript
   async function fetchWithRetry(url, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         const response = await fetch(url);
         if (response.ok) return response;
         if (response.status === 429) {
           await new Promise(r => setTimeout(r, 2000 * (i + 1)));
           continue;
         }
         throw new Error(`HTTP ${response.status}`);
       } catch (error) {
         if (i === retries - 1) throw error;
       }
     }
   }
   ```

### Segurança

1. **Nunca exponha credenciais** no frontend
2. **Valide inputs** (ASIN format, marketplace válido)
3. **Rate limit por IP** (futuro) em produção

### Compliance

1. **Sempre inclua disclosure** ao exibir produtos
2. **Não esconda affiliate tags**
3. **Mostre contexto de preço** (verifique na Amazon)

---

**Precisa de ajuda?** Abra uma issue no repositório!
