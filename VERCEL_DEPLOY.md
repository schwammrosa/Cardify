# 🚀 Deploy no Vercel - Cardify

## Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. [Vercel CLI](https://vercel.com/cli) instalado (opcional)
3. Credenciais da Amazon PA-API v5

## 📋 Passo a Passo

### 1. Preparar o Repositório

Certifique-se de que seu projeto está em um repositório Git (GitHub, GitLab ou Bitbucket).

```bash
git init
git add .
git commit -m "Preparar para deploy no Vercel"
git branch -M main
git remote add origin SEU_REPOSITORIO_URL
git push -u origin main
```

### 2. Importar Projeto no Vercel

#### Opção A: Via Dashboard Web

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Importe seu repositório Git
4. Configure conforme abaixo:

**Framework Preset:** Other  
**Root Directory:** `./`  
**Build Command:** `npm run build`  
**Output Directory:** `client/dist`  
**Install Command:** `npm install`

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Fazer deploy
vercel

# Seguir instruções no terminal
```

### 3. Configurar Variáveis de Ambiente

No dashboard do Vercel, vá em **Settings → Environment Variables** e adicione:

| Nome | Valor | Tipo |
|------|-------|------|
| `PA_ACCESS_KEY` | Sua Access Key da Amazon PA-API | All Environments |
| `PA_SECRET_KEY` | Sua Secret Key da Amazon PA-API | All Environments |
| `DEFAULT_ASSOCIATE_TAG` | Seu Associate Tag (ex: seu-tag-20) | All Environments |
| `NODE_ENV` | production | All Environments |
| `CACHE_TTL_PRODUCTS` | 21600 | Production |
| `CACHE_TTL_PRICES` | 300 | Production |
| `MAX_REQUESTS_PER_SECOND` | 1 | Production |

**IMPORTANTE:** Após adicionar as variáveis, faça um novo deploy clicando em **"Redeploy"**.

### 4. Estrutura de URLs

Após o deploy, seu projeto terá:

- **Frontend:** `https://seu-projeto.vercel.app`
- **API Backend:** `https://seu-projeto.vercel.app/api/*`

Exemplos de endpoints:
- Health check: `https://seu-projeto.vercel.app/api/health`
- Buscar produto: `https://seu-projeto.vercel.app/api/card?asin=B08N5WRWNW&marketplace=us`
- Demo: `https://seu-projeto.vercel.app/api/demo`

### 5. Testar o Deploy

1. Acesse a URL fornecida pelo Vercel
2. Configure suas credenciais no botão "Configurações"
3. Teste gerando um card de produto

### 6. Domínio Customizado (Opcional)

No dashboard do Vercel:
1. Vá em **Settings → Domains**
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções

## 🔧 Comandos Úteis

```bash
# Ver logs em tempo real
vercel logs

# Listar deployments
vercel ls

# Fazer deploy de produção
vercel --prod

# Fazer deploy de preview
vercel

# Ver variáveis de ambiente
vercel env ls

# Adicionar variável de ambiente via CLI
vercel env add PA_ACCESS_KEY
```

## ⚠️ Troubleshooting

### Erro: "Cannot find module"
- Certifique-se de que todas as dependências estão no `package.json`
- Execute `npm install` localmente para verificar

### Erro: API não responde
- Verifique se as variáveis de ambiente foram configuradas
- Veja os logs: `vercel logs` ou no dashboard web

### Erro: Build failed
- Verifique os logs de build no dashboard
- Teste localmente: `npm run build`

### CORS Error
- O backend já está configurado com CORS habilitado
- Verifique se as rotas da API estão corretas

## 📝 Notas Importantes

1. **Cache:** O Vercel tem limitações de cache serverless. O cache in-memory do `node-cache` será reiniciado entre invocações.

2. **Cold Starts:** Funções serverless podem ter "cold start" (primeira execução mais lenta).

3. **Limites do Free Tier:**
   - 100GB de largura de banda/mês
   - Serverless Function Execution: 100GB-Hrs
   - 100 deployments/dia

4. **Rate Limiting:** A Amazon PA-API tem limite de 1 requisição/segundo por padrão.

## 🔐 Segurança

- ✅ Credenciais armazenadas como variáveis de ambiente
- ✅ `.env` e `.env.local` no `.gitignore`
- ✅ CORS configurado
- ✅ Nunca commitar credenciais no repositório

## 📚 Recursos

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Amazon PA-API v5](https://webservices.amazon.com/paapi5/documentation/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)

## 🎉 Pronto!

Seu projeto Cardify está agora rodando no Vercel com deploy automático a cada push no repositório!
