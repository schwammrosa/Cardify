# 🤝 Contribuindo para o Cardify

Obrigado por considerar contribuir para o Cardify! Este documento fornece diretrizes para contribuições.

## 🌟 Como Contribuir

### Reportar Bugs

Encontrou um bug? Abra uma issue com:

1. **Descrição clara** do problema
2. **Passos para reproduzir**
3. **Comportamento esperado** vs **comportamento atual**
4. **Screenshots** (se aplicável)
5. **Ambiente:** SO, versão Node.js, navegador

**Template de Issue:**
```markdown
## Descrição
[Descreva o bug aqui]

## Passos para Reproduzir
1. Vá para...
2. Clique em...
3. Role até...
4. Veja o erro

## Esperado
[O que deveria acontecer]

## Atual
[O que está acontecendo]

## Ambiente
- SO: Windows 11
- Node: v18.17.0
- Browser: Chrome 120

## Screenshots
[Se aplicável]
```

---

### Sugerir Features

Tem uma ideia? Abra uma issue de feature request:

**Template:**
```markdown
## Feature Request

### Problema que Resolve
[Qual problema essa feature resolve?]

### Solução Proposta
[Como funcionaria?]

### Alternativas Consideradas
[Outras abordagens que você pensou?]

### Contexto Adicional
[Screenshots, mockups, exemplos]
```

---

### Pull Requests

1. **Fork** o repositório
2. **Crie um branch** para sua feature:
   ```bash
   git checkout -b feature/nome-da-feature
   ```
3. **Faça suas alterações** seguindo o style guide
4. **Teste localmente**
5. **Commit** com mensagens claras:
   ```bash
   git commit -m "feat: adiciona suporte a marketplace X"
   ```
6. **Push** para seu fork:
   ```bash
   git push origin feature/nome-da-feature
   ```
7. **Abra um Pull Request**

---

## 📝 Convenções de Código

### JavaScript/JSX

- **Estilo:** ESLint com config padrão
- **Formatação:** Prettier
- **Naming:**
  - `camelCase` para variáveis e funções
  - `PascalCase` para componentes React
  - `UPPER_CASE` para constantes

```javascript
// ✅ Bom
const productCard = getProductCard(asin);
const MAX_RETRY_ATTEMPTS = 3;

function ProductCard({ product }) {
  // ...
}

// ❌ Ruim
const product_card = get_product_card(asin);
const maxRetryAttempts = 3;

function product_card({ product }) {
  // ...
}
```

### Commits

Siga [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação, ponto-e-vírgula, etc
refactor: refatoração de código
test: adiciona testes
chore: atualiza dependências, configs
```

**Exemplos:**
```bash
git commit -m "feat: adiciona suporte a marketplace japonês"
git commit -m "fix: corrige cache não invalidando"
git commit -m "docs: atualiza README com novos marketplaces"
```

---

## 🏗️ Estrutura do Projeto

```
cardify/
├── server/              # Backend Node.js
│   ├── index.js         # Servidor Express principal
│   ├── routes/          # Rotas da API
│   │   ├── card.js
│   │   └── health.js
│   └── services/        # Lógica de negócio
│       ├── amazon.js    # Integração PA-API
│       ├── cache.js     # Sistema de cache
│       └── rateLimiter.js
│
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   │   ├── ProductCard.jsx
│   │   │   └── CodeExport.jsx
│   │   ├── App.jsx      # Componente principal
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Estilos globais
│   ├── index.html
│   └── vite.config.js
│
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json
└── README.md
```

---

## 🧪 Testando

### Testes Locais

```bash
# Instalar dependências
npm install
cd client && npm install && cd ..

# Executar testes (quando implementados)
npm test

# Testar build de produção
cd client
npm run build
npm run preview
```

### Checklist Antes de Submeter PR

- [ ] Código passa no linter (se configurado)
- [ ] Build funciona sem erros
- [ ] Testado em navegadores modernos
- [ ] Documentação atualizada (se necessário)
- [ ] Sem credenciais ou secrets no código
- [ ] Commit messages seguem convenção

---

## 📁 Adicionando Novos Marketplaces

Para adicionar suporte a um novo marketplace:

1. **Adicionar em `server/services/amazon.js`:**
```javascript
const MARKETPLACES = {
  // ... existentes
  mx: {
    host: 'webservices.amazon.com.mx',
    region: 'us-east-1',
    domain: 'www.amazon.com.mx'
  }
};
```

2. **Adicionar em `client/src/App.jsx`:**
```javascript
const marketplaces = [
  // ... existentes
  { value: 'mx', label: '🇲🇽 México' }
];
```

3. **Testar:**
```bash
curl "http://localhost:3333/api/card?asin=B08N5WRWNW&marketplace=mx"
```

4. **Documentar** no README.md

---

## 🎨 Adicionando Features de UI

### Novo Componente

1. Criar em `client/src/components/`
2. Seguir padrão de componentes existentes
3. Usar Tailwind para estilização
4. Adicionar PropTypes ou TypeScript (futuro)

**Exemplo:**
```jsx
// client/src/components/StatCard.jsx
import { TrendingUp } from 'lucide-react'

export default function StatCard({ title, value, trend }) {
  return (
    <div className="card">
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span>{trend}%</span>
        </div>
      )}
    </div>
  )
}
```

---

## 🔧 Adicionando Endpoints

### Nova Rota Backend

1. Criar em `server/routes/`
2. Importar em `server/index.js`
3. Documentar no README

**Exemplo:**
```javascript
// server/routes/stats.js
import { Router } from 'express';
import { cacheService } from '../services/cache.js';

export const statsRouter = Router();

statsRouter.get('/', (req, res) => {
  const stats = cacheService.getStats();
  res.json(stats);
});
```

```javascript
// server/index.js
import { statsRouter } from './routes/stats.js';

app.use('/api/stats', statsRouter);
```

---

## 📚 Atualizando Documentação

### Quando Atualizar

- Adicionar nova feature
- Mudar comportamento existente
- Adicionar dependências
- Alterar configurações

### Arquivos de Documentação

- **README.md:** Visão geral e quick start
- **QUICKSTART.md:** Tutorial passo-a-passo
- **DEPLOYMENT.md:** Guias de deploy
- **COMPLIANCE.md:** Regras Amazon Associates
- **CONTRIBUTING.md:** Este arquivo

---

## 🐛 Debugging

### Backend

```javascript
// Adicionar logs detalhados
console.log('[DEBUG]', { asin, marketplace, tag });

// Ver cache
console.log(cacheService.getStats());

// Simular erro
throw new Error('Teste de erro');
```

### Frontend

```javascript
// React DevTools
console.log('Product:', product);

// Network tab do browser
// Ver requisições /api/card
```

---

## 🚀 Release Process (Mantenedores)

1. **Atualizar versão** em `package.json`
2. **Atualizar CHANGELOG.md**
3. **Criar tag:**
   ```bash
   git tag -a v1.2.0 -m "Release 1.2.0"
   git push origin v1.2.0
   ```
4. **Criar release** no GitHub com notas

---

## 💬 Comunicação

- **Issues:** Para bugs e features
- **Discussions:** Para dúvidas e ideias gerais
- **Pull Requests:** Para código

---

## 📜 Código de Conduta

### Nosso Compromisso

Manter um ambiente respeitoso e acolhedor para todos.

### Comportamentos Esperados

- ✅ Usar linguagem acolhedora e inclusiva
- ✅ Respeitar diferentes pontos de vista
- ✅ Aceitar críticas construtivas
- ✅ Focar no que é melhor para a comunidade

### Comportamentos Inaceitáveis

- ❌ Linguagem ou imagens sexualizadas
- ❌ Trolling, insultos ou ataques pessoais
- ❌ Assédio público ou privado
- ❌ Publicar informações privadas de outros

---

## ⚖️ Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).

---

## 🎯 Prioridades Atuais

### Alta Prioridade
- [ ] Adicionar testes unitários
- [ ] Implementar TypeScript
- [ ] Melhorar error handling

### Média Prioridade
- [ ] Dashboard de estatísticas
- [ ] Mais opções de customização de cards
- [ ] Suporte a mais marketplaces

### Baixa Prioridade
- [ ] Tema dark mode
- [ ] Exportar múltiplos formatos
- [ ] Histórico de buscas

---

## 🙏 Agradecimentos

Obrigado a todos os contribuidores! 

Toda ajuda é bem-vinda, seja:
- 🐛 Reportando bugs
- 💡 Sugerindo features
- 📝 Melhorando docs
- 💻 Submetendo código

---

**Dúvidas?** Abra uma issue ou discussion!
