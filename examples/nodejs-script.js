/**
 * Script Node.js de exemplo para usar a API Cardify
 * 
 * Uso: node nodejs-script.js B08N5WRWNW
 */

import fetch from 'node-fetch';

const CARDIFY_API = process.env.CARDIFY_API_URL || 'http://localhost:3333';

/**
 * Buscar um produto
 */
async function getProduct(asin, marketplace = 'us') {
  const url = `${CARDIFY_API}/api/card?asin=${asin}&marketplace=${marketplace}`;
  
  console.log(`🔍 Buscando produto ${asin} no marketplace ${marketplace}...`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    const product = await response.json();
    return product;
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

/**
 * Buscar múltiplos produtos
 */
async function getBatchProducts(asins, marketplace = 'us') {
  const url = `${CARDIFY_API}/api/card/batch`;
  
  console.log(`🔍 Buscando ${asins.length} produtos...`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asins, marketplace })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const { cards } = await response.json();
    return cards;
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

/**
 * Exibir produto no terminal
 */
function displayProduct(product) {
  console.log('\n' + '='.repeat(60));
  console.log(`📦 ${product.title}`);
  console.log('='.repeat(60));
  
  if (product.author) {
    console.log(`👤 Por: ${product.author}`);
  }
  
  if (product.rating?.stars) {
    console.log(`⭐ Rating: ${product.rating.stars} (${product.rating.count || 0} reviews)`);
  }
  
  if (product.price?.display) {
    console.log(`💰 Preço: ${product.price.display}`);
  }
  
  if (product.availability?.message) {
    console.log(`📊 Disponibilidade: ${product.availability.message}`);
  }
  
  if (product.features?.length > 0) {
    console.log('\n✨ Features:');
    product.features.slice(0, 5).forEach(f => {
      console.log(`  • ${f}`);
    });
  }
  
  console.log(`\n🔗 Link: ${product.affiliateUrl}`);
  console.log(`⚡ Cache: ${product.fromCache ? 'Sim' : 'Não'}`);
  console.log('='.repeat(60) + '\n');
}

/**
 * Gerar tabela comparativa
 */
function compareProducts(cards) {
  console.log('\n📊 COMPARAÇÃO DE PRODUTOS\n');
  console.log('┌─────────────────────────────────────────────────┬──────────┬─────────┐');
  console.log('│ Produto                                         │ Preço    │ Rating  │');
  console.log('├─────────────────────────────────────────────────┼──────────┼─────────┤');
  
  cards.forEach(card => {
    if (!card.success) {
      console.log(`│ ${card.asin.padEnd(47)} │ ERRO     │         │`);
      return;
    }
    
    const product = card.data;
    const title = product.title.substring(0, 45).padEnd(47);
    const price = (product.price?.display || 'N/A').padEnd(8);
    const rating = product.rating?.stars ? `⭐ ${product.rating.stars}` : 'N/A';
    
    console.log(`│ ${title} │ ${price} │ ${rating.padEnd(7)} │`);
  });
  
  console.log('└─────────────────────────────────────────────────┴──────────┴─────────┘\n');
}

/**
 * Gerar HTML de um produto
 */
function generateHTML(product) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${product.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
    img { width: 100%; max-height: 400px; object-fit: contain; }
    h1 { font-size: 24px; margin: 15px 0; }
    .price { font-size: 32px; font-weight: bold; color: #B12704; margin: 15px 0; }
    .button { display: block; padding: 14px; background: #FF9900; color: white; text-align: center; 
              text-decoration: none; border-radius: 8px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <img src="${product.image.large}" alt="${product.title}">
    <h1>${product.title}</h1>
    ${product.author ? `<p>Por: <strong>${product.author}</strong></p>` : ''}
    ${product.price?.display ? `<div class="price">${product.price.display}</div>` : ''}
    <a href="${product.affiliateUrl}" class="button" target="_blank">Comprar na Amazon</a>
    <p style="text-align: center; font-size: 12px; color: #666; margin-top: 15px;">
      As an Amazon Associate I earn from qualifying purchases.
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Uso:');
    console.log('  node nodejs-script.js <ASIN> [marketplace]');
    console.log('  node nodejs-script.js B08N5WRWNW us');
    console.log('\nOu para múltiplos:');
    console.log('  node nodejs-script.js --batch ASIN1 ASIN2 ASIN3');
    console.log('\nOu para gerar HTML:');
    console.log('  node nodejs-script.js --html B08N5WRWNW > produto.html');
    process.exit(1);
  }
  
  // Modo batch
  if (args[0] === '--batch') {
    const asins = args.slice(1);
    const cards = await getBatchProducts(asins);
    compareProducts(cards);
    return;
  }
  
  // Modo HTML
  if (args[0] === '--html') {
    const asin = args[1];
    const product = await getProduct(asin);
    console.log(generateHTML(product));
    return;
  }
  
  // Modo normal
  const [asin, marketplace = 'us'] = args;
  const product = await getProduct(asin, marketplace);
  displayProduct(product);
}

main().catch(console.error);
