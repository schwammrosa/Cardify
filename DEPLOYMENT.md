# 🚀 Guia de Deploy - Cardify

Este guia cobre diferentes opções para colocar o Cardify em produção.

## Opções de Deploy

1. **Vercel** (Frontend) + **Railway** (Backend) - Recomendado
2. **Heroku** - Tudo junto (simples)
3. **VPS** (Digital Ocean, AWS EC2, etc.) - Controle total
4. **Docker** - Containerizado

---

## 1️⃣ Vercel + Railway (Recomendado)

### Backend (Railway)

1. **Criar conta:** https://railway.app
2. **Criar novo projeto:**
   ```bash
   # No seu terminal
   cd d:\Projeto\Cardify
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. **Push para GitHub/GitLab**
4. **No Railway:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório Cardify
   - Railway detectará automaticamente o Node.js
5. **Configurar variáveis de ambiente:**
   ```
   PA_ACCESS_KEY=sua_key
   PA_SECRET_KEY=sua_secret
   DEFAULT_ASSOCIATE_TAG=seu-tag-20
   NODE_ENV=production
   PORT=3333
   ```
6. **Deploy automático!** Railway gera uma URL (ex: `cardify-backend.railway.app`)

### Frontend (Vercel)

1. **Criar conta:** https://vercel.com
2. **No Vercel:**
   - Clique em "Add New" → "Project"
   - Importe o mesmo repositório
   - Configure:
     - **Root Directory:** `client`
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
3. **Configurar variável de ambiente:**
   ```
   VITE_API_URL=https://sua-url-railway.railway.app
   ```
4. **Atualizar frontend para usar a variável:**
   
   Em `client/src/App.jsx`, substitua `/api/card` por:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || '';
   // ...
   fetch(`${API_URL}/api/card?${params}`)
   ```
5. **Deploy automático!**

---

## 2️⃣ Heroku (Tudo Junto)

### Preparar o Projeto

1. **Criar `Procfile` na raiz:**
   ```
   web: node server/index.js
   ```

2. **Atualizar `package.json`:**
   ```json
   {
     "scripts": {
       "start": "node server/index.js",
       "heroku-postbuild": "cd client && npm install && npm run build"
     }
   }
   ```

3. **Servir frontend estático no backend:**
   
   Adicionar em `server/index.js`:
   ```javascript
   import path from 'path';
   import { fileURLToPath } from 'url';
   
   const __dirname = path.dirname(fileURLToPath(import.meta.url));
   
   // Depois das rotas da API
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../client/dist')));
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, '../client/dist/index.html'));
     });
   }
   ```

### Deploy no Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create cardify-seu-nome

# Configurar variáveis
heroku config:set PA_ACCESS_KEY=sua_key
heroku config:set PA_SECRET_KEY=sua_secret
heroku config:set DEFAULT_ASSOCIATE_TAG=seu-tag-20
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Abrir app
heroku open
```

---

## 3️⃣ VPS (Ubuntu/Debian)

### Configuração Inicial

```bash
# Conectar via SSH
ssh root@seu-servidor.com

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PM2 (process manager)
npm install -g pm2

# Instalar Nginx
apt install -y nginx

# Instalar Git
apt install -y git
```

### Deploy da Aplicação

```bash
# Clonar repositório
cd /var/www
git clone https://github.com/seu-usuario/cardify.git
cd cardify

# Instalar dependências backend
npm install

# Instalar dependências frontend
cd client
npm install
npm run build
cd ..

# Configurar .env
nano .env
# (Cole suas credenciais e salve)

# Iniciar com PM2
pm2 start server/index.js --name cardify
pm2 save
pm2 startup
```

### Configurar Nginx

```bash
nano /etc/nginx/sites-available/cardify
```

Cole:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    # Frontend
    location / {
        root /var/www/cardify/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar:
```bash
ln -s /etc/nginx/sites-available/cardify /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### SSL com Let's Encrypt (Recomendado)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d seu-dominio.com
```

---

## 4️⃣ Docker

### Criar `Dockerfile` na raiz:

```dockerfile
# Build frontend
FROM node:18-alpine AS frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server/ ./server/
COPY --from=frontend /app/client/dist ./client/dist

EXPOSE 3333
CMD ["node", "server/index.js"]
```

### Criar `docker-compose.yml`:

```yaml
version: '3.8'
services:
  cardify:
    build: .
    ports:
      - "3333:3333"
    environment:
      - NODE_ENV=production
      - PA_ACCESS_KEY=${PA_ACCESS_KEY}
      - PA_SECRET_KEY=${PA_SECRET_KEY}
      - DEFAULT_ASSOCIATE_TAG=${DEFAULT_ASSOCIATE_TAG}
    restart: unless-stopped
```

### Deploy:

```bash
# Build e executar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## ✅ Checklist Pré-Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Build do frontend testado localmente
- [ ] `.env` no `.gitignore`
- [ ] CORS configurado para domínio de produção
- [ ] Rate limiting adequado
- [ ] Monitoramento de erros configurado (opcional: Sentry)
- [ ] Backup das credenciais em local seguro
- [ ] SSL/HTTPS habilitado

---

## 🔒 Segurança em Produção

### Backend

1. **Nunca exponha credenciais:**
   ```javascript
   // ❌ Ruim
   res.json({ accessKey: process.env.PA_ACCESS_KEY })
   
   // ✅ Bom
   res.json({ status: 'ok' })
   ```

2. **Configure CORS adequadamente:**
   ```javascript
   app.use(cors({
     origin: ['https://seu-dominio.com'],
     credentials: true
   }))
   ```

3. **Use HTTPS sempre:**
   - Let's Encrypt (gratuito)
   - Cloudflare (gratuito)

### Variáveis de Ambiente

**Nunca faça commit de `.env`!**

Crie `.env.production` localmente e use serviços de secrets:
- Railway: Settings → Variables
- Vercel: Settings → Environment Variables
- Heroku: `heroku config:set`

---

## 📊 Monitoramento

### Opções Gratuitas

1. **UptimeRobot** - Monitora uptime
2. **LogRocket** - Session replay
3. **Sentry** - Error tracking
4. **Google Analytics** - Uso

### Implementar Health Check

Já incluído em `/api/health`

Configure monitoramento para alertar se retornar erro.

---

## 💰 Custos Estimados

| Serviço | Custo |
|---------|-------|
| Vercel (Frontend) | Grátis |
| Railway (Backend) | $5-10/mês |
| Heroku | $7-25/mês |
| VPS (DigitalOcean) | $5-10/mês |
| Docker (próprio servidor) | Variável |

---

## 🔄 CI/CD Automático

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: cd client && npm install && npm run build
      # Adicionar steps de deploy específicos
```

---

**Precisa de ajuda com deploy?** Abra uma issue no repositório!
