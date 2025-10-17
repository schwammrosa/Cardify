# 🎴 Cardify - Gerador de Cards de Afiliados Amazon

Sistema moderno para gerar cards de produtos da Amazon com links de afiliados integrados.

## 🚀 Características

- ✅ Integração completa com Amazon Product Advertising API v5
- ✅ Interface visual moderna para gerar cards
- ✅ Sistema de cache inteligente para otimizar requisições
- ✅ Rate limiting automático
- ✅ Suporte a múltiplos marketplaces (US, BR, UK, etc.)
- ✅ Cards responsivos e customizáveis
- ✅ Exportação de código HTML/React

## 📋 Pré-requisitos

1. **Conta Amazon Associates**
   - Crie em: https://affiliate-program.amazon.com
   
2. **Credenciais PA-API**
   - Acesse: https://affiliate-program.amazon.com/assoc_credentials/home
   - Gere Access Key, Secret Key e Associate Tag

## 🛠️ Instalação

### 1. Clone e instale dependências do backend

```bash
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais da Amazon.

### 3. Instale dependências do frontend

```bash
cd client
npm install
```

### 4. Inicie o projeto

```bash
# Na raiz do projeto
npm run dev
```

O backend estará em `http://localhost:3333`  
O frontend estará em `http://localhost:5173`

## 📖 Como Usar

1. Acesse a interface web
2. Digite o ASIN do produto Amazon (ex: B08N5WRWNW)
3. (Opcional) Insira sua tag de afiliado ou use a padrão
4. Clique em "Gerar Card"
5. Copie o código gerado ou use a pré-visualização

## 🏗️ Estrutura do Projeto

```
cardify/
├── server/              # Backend Node.js
│   ├── index.js         # Servidor Express
│   ├── services/        # Serviços (PA-API, Cache)
│   └── utils/           # Utilitários
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── App.jsx      # Componente principal
│   │   └── main.jsx     # Entry point
│   └── index.html
└── package.json
```

## 🔐 Segurança

- ⚠️ **NUNCA** exponha suas credenciais PA-API no frontend
- ✅ Sempre use variáveis de ambiente
- ✅ Adicione `.env` ao `.gitignore`
- ✅ Rotacione suas keys periodicamente

## 📝 Conformidade Amazon Associates

Este projeto inclui automaticamente:
- Disclosure obrigatório em todos os cards
- Links com Associate Tag adequadamente formatados
- Respeito aos rate limits da API

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra issues e PRs.

## 📄 Licença

MIT License - use livremente!

## ⚠️ Avisos Importantes

1. A Amazon pode revogar acesso à PA-API se não houver vendas referidas
2. Respeite os limites de requisições (inicial: 1 TPS / 8640 TPD)
3. Cache é essencial - não consulte a API desnecessariamente
4. Siga as regras do Operating Agreement da Amazon Associates
