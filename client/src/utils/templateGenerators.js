// Gera código HTML para o template horizontal
export function generateHorizontalTemplate(product) {
  const featuresHTML = product.features && product.features.length > 0 
    ? `<ul class="features">
${product.features.slice(0, 3).map(f => `      <li>• ${f}</li>`).join('\n')}
    </ul>`
    : '';

  return `<!-- Card Horizontal - Amazon Afiliados -->
<div class="produto-bloco">
  <!-- Imagem -->
  <div class="produto-imagem">
    <img src="${product.image?.large || ''}" alt="${product.title}">
  </div>
  
  <!-- Conteúdo -->
  <div class="produto-conteudo">
    <h3>${product.title}</h3>
    ${product.author ? `<p class="autor">por <strong>${product.author}</strong></p>` : ''}
    ${featuresHTML}
    ${product.price?.display ? `<p class="preco">${product.price.display}</p>` : ''}
    <a href="${product.affiliateUrl}" target="_blank" rel="nofollow sponsored">Comprar na Amazon</a>
  </div>
</div>

<!-- CSS -->
<style>
.produto-bloco {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  max-width: 700px;
  margin-bottom: 30px;
}

.produto-imagem {
  flex: 1;
  min-width: 200px;
  text-align: center;
}

.produto-imagem img {
  width: 100%;
  max-width: 250px;
  border-radius: 8px;
}

.produto-conteudo {
  flex: 2;
  min-width: 250px;
}

.produto-conteudo h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.produto-conteudo .autor {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.produto-conteudo .features {
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
  padding-left: 0;
  list-style: none;
}

.produto-conteudo .features li {
  margin-bottom: 4px;
}

.produto-conteudo .preco {
  font-size: 24px;
  font-weight: bold;
  color: #B12704;
  margin-bottom: 12px;
}

.produto-conteudo a {
  display: block;
  background: #1976d2;
  color: #fff;
  text-decoration: none;
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 600;
  transition: background 0.3s;
}

.produto-conteudo a:hover {
  background: #125a9c;
}

/* Responsivo */
@media (max-width: 600px) {
  .produto-bloco {
    flex-direction: column;
    text-align: center;
  }
  
  .produto-imagem img {
    margin-bottom: 12px;
  }
}
</style>

<!-- Disclosure Amazon Associates -->
<p style="font-size: 11px; color: #666; text-align: center; font-style: italic;">
  As an Amazon Associate I earn from qualifying purchases.
</p>`
}

// Gera código HTML para o template vertical
export function generateVerticalTemplate(product) {
  const featuresHTML = product.features && product.features.length > 0 
    ? `<ul class="features">
${product.features.slice(0, 3).map(f => `      <li>• ${f}</li>`).join('\n')}
    </ul>`
    : '';

  return `<!-- Card Vertical - Produto Único -->
<div class="produto-card">
  <h3>${product.title}</h3>
  <img src="${product.image?.large || ''}" alt="${product.title}">
  ${product.author ? `<p class="autor">por <strong>${product.author}</strong></p>` : ''}
  ${featuresHTML}
  ${product.price?.display ? `<p class="preco">${product.price.display}</p>` : ''}
  <a href="${product.affiliateUrl}" target="_blank" rel="nofollow sponsored" class="btn-amazon">Comprar na Amazon</a>
</div>

<style>
.produto-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  transition: transform 0.2s;
  max-width: 280px;
  margin: 0 auto 30px;
}

.produto-card:hover {
  transform: translateY(-4px);
}

.produto-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  min-height: 44px;
}

.produto-card img {
  max-width: 100%;
  margin-bottom: 12px;
  border-radius: 8px;
}

.produto-card .autor {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.produto-card .features {
  font-size: 12px;
  color: #555;
  margin-bottom: 12px;
  padding-left: 0;
  list-style: none;
  text-align: left;
}

.produto-card .features li {
  margin-bottom: 4px;
}

.produto-card .preco {
  font-size: 24px;
  font-weight: bold;
  color: #B12704;
  margin-bottom: 12px;
}

.produto-card a {
  display: block;
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  transition: background 0.3s;
}

.btn-amazon {
  background: #1976d2;
}

.btn-amazon:hover {
  background: #125a9c;
}
</style>

<!-- Disclosure Amazon Associates -->
<p style="font-size: 11px; color: #666; text-align: center; font-style: italic; margin-top: 8px;">
  As an Amazon Associate I earn from qualifying purchases.
</p>`
}

