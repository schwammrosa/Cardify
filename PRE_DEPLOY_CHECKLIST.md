# ✅ Checklist Pré-Deploy

Use esta checklist antes de fazer deploy no Vercel:

## 📋 Verificações Obrigatórias

### 1. Git e Repositório
- [ ] Repositório Git inicializado (`git init`)
- [ ] Código commitado (`git add . && git commit -m "..."`)
- [ ] Repositório remoto configurado (GitHub/GitLab/Bitbucket)
- [ ] Push realizado (`git push origin main`)

### 2. Arquivos de Configuração
- [ ] `vercel.json` presente na raiz
- [ ] `.gitignore` inclui `.env` e `node_modules`
- [ ] `package.json` na raiz com scripts corretos
- [ ] `client/package.json` com script `vercel-build`

### 3. Credenciais Amazon PA-API
- [ ] Access Key obtida
- [ ] Secret Key obtida
- [ ] Associate Tag configurado
- [ ] Credenciais testadas localmente

### 4. Variáveis de Ambiente (.env local)
- [ ] `PA_ACCESS_KEY` configurado
- [ ] `PA_SECRET_KEY` configurado
- [ ] `DEFAULT_ASSOCIATE_TAG` configurado
- [ ] Arquivo `.env` **NÃO** está no repositório Git

### 5. Testes Locais
- [ ] `npm install` executado sem erros
- [ ] `npm run dev` funciona corretamente
- [ ] Frontend carrega em `localhost:5173`
- [ ] Backend responde em `localhost:3333/api/health`
- [ ] Geração de cards funciona

### 6. Build de Produção
- [ ] `cd client && npm run build` executa sem erros
- [ ] Pasta `client/dist` foi criada
- [ ] Sem erros de TypeScript ou ESLint críticos

## 🚀 Pronto para Deploy?

Se todos os itens acima estão marcados ✅, você pode:

```bash
vercel
```

Ou importar no dashboard do Vercel: https://vercel.com/new

## 📝 Após o Deploy

Não se esqueça de:

1. ✅ Adicionar variáveis de ambiente no Vercel
2. ✅ Fazer Redeploy após adicionar as variáveis
3. ✅ Testar o site em produção
4. ✅ Verificar os logs se houver erros

## 🆘 Problemas?

Consulte:
- [DEPLOY_RAPIDO.md](./DEPLOY_RAPIDO.md) - Guia rápido
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Documentação completa
- Logs do Vercel: `vercel logs` ou no dashboard

---

**Boa sorte com o deploy! 🎉**
