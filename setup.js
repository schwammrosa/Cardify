/**
 * Script de setup inicial do Cardify
 * Executa: node setup.js
 */

import fs from 'fs';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

console.log('\n🎴 Cardify - Setup Inicial\n');
console.log('Este script vai te ajudar a configurar o Cardify.\n');

async function setup() {
  try {
    // 1. Verificar .env
    if (!fs.existsSync('.env')) {
      console.log('📝 Criando arquivo .env...');
      
      console.log('\n⚠️  Você precisa das credenciais da Amazon PA-API');
      console.log('Obtenha em: https://affiliate-program.amazon.com/assoc_credentials/home\n');
      
      const accessKey = await question('Access Key ID: ');
      const secretKey = await question('Secret Access Key: ');
      const tag = await question('Associate Tag (ex: seutag-20): ');
      
      const envContent = `# Amazon Product Advertising API Credentials
PA_ACCESS_KEY=${accessKey}
PA_SECRET_KEY=${secretKey}
DEFAULT_ASSOCIATE_TAG=${tag}

# Configurações
PORT=3333
NODE_ENV=development
CACHE_TTL_PRODUCTS=21600
CACHE_TTL_PRICES=300
MAX_REQUESTS_PER_SECOND=1
`;
      
      fs.writeFileSync('.env', envContent);
      console.log('✅ Arquivo .env criado!\n');
    } else {
      console.log('✅ Arquivo .env já existe\n');
    }
    
    // 2. Instalar dependências backend
    console.log('📦 Instalando dependências do backend...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Dependências do backend instaladas!\n');
    } catch (error) {
      console.error('❌ Erro ao instalar dependências do backend');
      throw error;
    }
    
    // 3. Instalar dependências frontend
    console.log('📦 Instalando dependências do frontend...');
    try {
      execSync('cd client && npm install', { stdio: 'inherit', shell: true });
      console.log('✅ Dependências do frontend instaladas!\n');
    } catch (error) {
      console.error('❌ Erro ao instalar dependências do frontend');
      throw error;
    }
    
    // 4. Teste de conexão
    console.log('🔍 Testando credenciais...');
    const testConnection = await question('\nDeseja testar a conexão com a API agora? (s/n): ');
    
    if (testConnection.toLowerCase() === 's') {
      console.log('\n🚀 Iniciando servidor de teste...');
      console.log('(Pressione Ctrl+C para sair após o teste)\n');
      
      // Iniciar servidor em background para teste
      setTimeout(() => {
        console.log('\n💡 Abra outro terminal e execute:');
        console.log('   curl "http://localhost:3333/api/health"\n');
        console.log('📖 Leia o QUICKSTART.md para próximos passos!\n');
      }, 2000);
      
      execSync('npm run server', { stdio: 'inherit' });
    }
    
    console.log('\n✨ Setup concluído com sucesso!\n');
    console.log('📖 Próximos passos:');
    console.log('   1. Execute: npm run dev');
    console.log('   2. Abra: http://localhost:5173');
    console.log('   3. Leia: QUICKSTART.md\n');
    
  } catch (error) {
    console.error('\n❌ Erro durante o setup:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setup();
