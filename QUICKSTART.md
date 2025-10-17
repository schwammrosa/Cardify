# 🚀 Guia de Início Rápido - Cardify

## Passo 1: Obter Credenciais Amazon PA-API

### 1.1 Criar Conta Amazon Associates
1. Acesse: https://affiliate-program.amazon.com
2. Crie uma conta ou faça login
3. Complete o processo de cadastro

### 1.2 Obter Credenciais PA-API
1. Acesse: https://affiliate-program.amazon.com/assoc_credentials/home
2. Clique em "Add credentials" (se for primeira vez)
3. Anote suas credenciais:
   - **Access Key ID** (ex: AKIAIOSFODNN7EXAMPLE)
   - **Secret Access Key** (ex: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY)
   - **Associate Tag** (ex: seutag-20)

⚠️ **IMPORTANTE:** Nunca compartilhe suas credenciais ou as coloque em repositórios públicos!

## Passo 2: Configurar o Projeto

### 2.1 Instalar Dependências do Backend
```bash
# Na raiz do projeto
npm install
```

### 2.2 Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:
```env
PA_ACCESS_KEY=sua_access_key_aqui
PA_SECRET_KEY=sua_secret_key_aqui
DEFAULT_ASSOCIATE_TAG=seu-tag-20
PORT=3333
NODE_ENV=development
```

### 2.3 Instalar Dependências do Frontend
```bash
cd client
npm install
cd ..
```

## Passo 3: Executar o Projeto

### Opção A: Executar Tudo de Uma Vez (Recomendado)
```bash
npm run dev
```

### Opção B: Executar Separadamente

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Passo 4: Testar

1. Abra o navegador em: http://localhost:5173
2. Digite um ASIN de produto (ex: **B08N5WRWNW**)
3. Clique em "Gerar Card"
4. Veja o card gerado!

## 🔍 Como Encontrar o ASIN de um Produto

### Método 1: Na URL do Produto
```
https://www.amazon.com/dp/B08N5WRWNW
                         ^^^^^^^^^^
                         Este é o ASIN
```

### Método 2: Na Página do Produto
1. Role até "Product Information" ou "Detalhes do produto"
2. Procure por "ASIN" ou "ISBN"

### Exemplos de ASINs para Testar:
- **B08N5WRWNW** - Amazon Echo Dot (4th Gen)
- **B0BSHF7WHW** - Kindle Scribe
- **B09B93ZDG4** - Echo Show 8 (3rd Gen)

## ⚠️ Troubleshooting

### Erro: "Credenciais PA-API não configuradas"
- Verifique se o arquivo `.env` existe na raiz
- Confirme que `PA_ACCESS_KEY` e `PA_SECRET_KEY` estão preenchidos
- Reinicie o servidor após editar o `.env`

### Erro: "Rate limit excedido"
- Amazon limita inicialmente a 1 requisição/segundo
- Aguarde alguns segundos e tente novamente
- O sistema tem cache - produtos já buscados retornam instantaneamente

### Erro: "Produto não encontrado"
- Verifique se o ASIN está correto (10 caracteres)
- Confirme se o marketplace selecionado está correto
- Alguns produtos podem não estar disponíveis na PA-API

### Porta 3333 ou 5173 já em uso
Edite as portas:
- Backend: mude `PORT` no `.env`
- Frontend: mude `port` em `client/vite.config.js`

## 📊 Verificar Status da API

Acesse: http://localhost:3333/api/health

Retorno esperado:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

## 🎯 Próximos Passos

1. **Teste com seus produtos:** Experimente com ASINs da sua área
2. **Customize os cards:** Edite `client/src/components/ProductCard.jsx`
3. **Ajuste o cache:** Modifique TTLs em `.env` conforme necessário
4. **Implante em produção:** Veja o README para opções de deploy

## 💡 Dicas de Uso

### Para Blogs e Sites
```html
<!-- Copie o código HTML gerado e cole no seu post -->
<div><!-- Card gerado pelo Cardify --></div>
```

### Para Projetos React
```jsx
// Importe o JSON e use o componente ProductCard
import ProductCard from './components/ProductCard'
// ...
```

### API Direta
```bash
# Buscar produto via API
curl "http://localhost:3333/api/card?asin=B08N5WRWNW&marketplace=us"
```

## 📚 Recursos Úteis

- [Amazon PA-API Documentation](https://webservices.amazon.com/paapi5/documentation/)
- [Amazon Associates Program](https://affiliate-program.amazon.com)
- [Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement)

---

**Precisa de ajuda?** Abra uma issue no repositório!
