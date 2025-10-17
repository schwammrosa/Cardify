# 🚀 Deploy Rápido no Vercel

## ⚡ Método Mais Rápido (3 minutos)

### 1️⃣ Preparar Repositório Git

```bash
# Se ainda não inicializou o Git:
git init
git add .
git commit -m "Initial commit"

# Criar repositório no GitHub e conectar:
git remote add origin https://github.com/SEU_USUARIO/cardify.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy no Vercel

1. Acesse: https://vercel.com
2. Clique em **"Add New Project"**
3. Importe seu repositório GitHub
4. Aceite as configurações (já estão configuradas no `vercel.json`)
5. Clique em **"Deploy"**

### 3️⃣ Adicionar Variáveis de Ambiente

Após o deploy inicial:

1. No dashboard do Vercel, vá em **Settings → Environment Variables**
2. Adicione estas variáveis:

```
PA_ACCESS_KEY=sua_chave_aqui
PA_SECRET_KEY=sua_secret_aqui
DEFAULT_ASSOCIATE_TAG=seu-tag-20
NODE_ENV=production
```

3. Clique em **"Save"**
4. Vá em **Deployments** e clique em **"Redeploy"** no último deployment

### 4️⃣ Testar

Acesse seu site: `https://seu-projeto.vercel.app`

✅ **Pronto!** Seu Cardify está no ar!

---

## 📱 Como Obter as Credenciais da Amazon

1. Acesse: https://affiliate-program.amazon.com
2. Vá em **Tools → Product Advertising API**
3. Clique em **"Get Started"** ou **"Add User"**
4. Copie:
   - **Access Key** → `PA_ACCESS_KEY`
   - **Secret Key** → `PA_SECRET_KEY`
5. Seu **Associate Tag** está no canto superior direito da dashboard (ex: `seu-tag-20`)

---

## 🔄 Atualizações Automáticas

A partir de agora, todo `git push` na branch `main` fará deploy automático!

```bash
# Fazer alterações no código
git add .
git commit -m "Minha alteração"
git push

# Vercel fará deploy automaticamente
```

---

## ⚙️ Comandos Úteis

```bash
# Ver logs em tempo real
npx vercel logs

# Ver todos os deployments
npx vercel ls

# Abrir projeto no dashboard
npx vercel

# Remover projeto
npx vercel remove
```

---

## 🆘 Problemas Comuns

### Deploy falhou?
- Verifique os logs no dashboard do Vercel
- Certifique-se de que as variáveis de ambiente estão configuradas

### API não funciona?
- Adicione as variáveis de ambiente
- Faça um **Redeploy** após adicionar as variáveis

### "Cannot find module"?
- Certifique-se de que `node_modules` não está no repositório
- O Vercel instala as dependências automaticamente

---

## 📚 Documentação Completa

Ver: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

---

**Precisa de ajuda?** Abra uma issue no GitHub!
