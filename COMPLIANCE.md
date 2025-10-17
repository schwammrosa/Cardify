# ⚖️ Guia de Compliance - Amazon Associates

Este guia ajuda você a usar o Cardify em conformidade com as regras do Amazon Associates Program.

## 📜 Regras Principais

### 1. Disclosure Obrigatório

**Você DEVE informar aos visitantes que ganha comissões.**

#### ✅ Exemplos Corretos:

```html
<!-- Disclosure padrão (já incluído nos cards) -->
<p>As an Amazon Associate I earn from qualifying purchases.</p>

<!-- Variações aceitas -->
<p>Como Associado da Amazon, ganho com compras qualificadas.</p>
<p>Esse post contém links de afiliado.</p>
<p>Posso receber comissão por compras através desses links.</p>
```

#### ❌ O que NÃO fazer:

- Esconder o disclosure em rodapé minúsculo
- Usar termos vagos como "pode conter links patrocinados"
- Não incluir disclosure algum

### Onde Colocar o Disclosure:

1. **Visível SEM scroll** - deve aparecer antes ou junto dos links
2. **Clara e conspícua** - não use fonte microscópica
3. **Em cada página** com links de afiliado

O Cardify já inclui o disclosure em cada card automaticamente! ✅

---

## 🔗 Links e Tags

### Associate Tag DEVE Estar Presente

```javascript
// ✅ Correto
https://www.amazon.com/dp/B08N5WRWNW?tag=seu-tag-20

// ❌ Errado
https://www.amazon.com/dp/B08N5WRWNW
```

O Cardify garante que todos os links incluem sua tag! ✅

### Não Esconda os Links

❌ **Proibido:**
- Usar encurtadores (bit.ly, tinyurl, etc.)
- Fazer redirect através do seu servidor
- Usar técnicas de cloaking

✅ **Permitido:**
- Link direto da Amazon com sua tag
- Plugin ThirstyAffiliates (com configuração correta)
- Pretty links mantendo a estrutura amazon.com

---

## 🚫 Conteúdo Proibido

### Você NÃO pode usar links de afiliado em:

1. **E-mails** (newsletters, marketing, etc.)
2. **E-books** (PDF, Kindle, EPUB)
3. **Apps offline**
4. **Conteúdo gerado por IA** sem revisão humana substancial
5. **Pop-ups** (alguns tipos)
6. **Preços fixos** (nunca diga "este produto custa $X" sem "verificar na Amazon")

### ⚠️ Atenção com IA:

Se você usar IA (como ChatGPT) para gerar conteúdo:
- ✅ Revise e edite substancialmente
- ✅ Adicione experiência pessoal
- ✅ Verifique informações
- ❌ Não publique conteúdo 100% gerado por IA

---

## 💰 Preços e Disponibilidade

### Regras de Exibição de Preços

Amazon permite mostrar preços **SE:**
1. Você usa a PA-API (✅ Cardify usa!)
2. Os preços são atualizados no máximo a cada 24h (✅ cache configurável)
3. Você mostra data/hora da última atualização
4. Você deixa claro onde verificar o preço atual

#### ✅ Exemplos Corretos:

```html
<!-- Cardify já faz isso -->
<p>Preço: $49.99 (verifique na Amazon)</p>
<p>Preço atualizado em: 15/01/2024 10:30</p>
```

#### ❌ O que NÃO fazer:

```html
<!-- Nunca faça isso -->
<p>Este produto custa $49.99</p>  <!-- Sem contexto -->
<p>Preço fixo: $49.99</p>  <!-- "Fixo" é proibido -->
```

### Disponibilidade

Sempre indique que deve verificar disponibilidade:
```html
<p>Disponível na Amazon (sujeito a alterações)</p>
```

O Cardify inclui status de disponibilidade automaticamente! ✅

---

## 🖼️ Imagens e Marca

### Uso de Imagens de Produtos

✅ **Permitido:**
- Imagens obtidas via PA-API (Cardify usa!)
- Suas próprias fotos de produtos que você comprou
- Fotos de press kits oficiais

❌ **Proibido:**
- Baixar imagens diretamente do site Amazon
- Hospedar imagens da Amazon no seu servidor
- Modificar excessivamente as imagens

### Marca Amazon

✅ **Permitido:**
- Mencionar "Amazon"
- Usar termo "Amazon Associates"
- Links para Amazon.com

❌ **Proibido:**
- Usar logo da Amazon sem permissão
- Sugerir parceria oficial com Amazon
- "Patrocinado por Amazon" (você não é patrocinado, é afiliado)

---

## 📊 Performance e Vendas

### Para Manter Acesso à PA-API

A Amazon pode **revogar** seu acesso se:
- Você não gerar vendas referidas em 180 dias
- Violar as regras do programa
- Tiver baixa taxa de conversão sem justificativa

### Dicas para Manter Conta Ativa:

1. **Gere vendas regularmente** - mesmo pequenas
2. **Crie conteúdo de qualidade** - reviews honestos
3. **Divulgue seu conteúdo** - SEO, redes sociais
4. **Monitore seu painel** - https://affiliate-program.amazon.com

---

## 🔒 Rate Limits e Uso da API

### Limites Iniciais (PA-API)

- **1 requisição/segundo** (1 TPS)
- **8.640 requisições/dia** (8640 TPD)

O Cardify implementa rate limiting automático! ✅

### Como Aumentar Limites

Os limites aumentam baseado em:
1. **Receita referida** (vendas geradas)
2. **Consistência** (gerar vendas todo mês)
3. **Tempo de conta** (contas antigas têm prioridade)

### Dicas de Otimização:

1. **Use cache agressivamente**
   ```env
   # .env - Configurar TTLs adequados
   CACHE_TTL_PRODUCTS=21600  # 6 horas para produtos
   CACHE_TTL_PRICES=300      # 5 minutos para preços
   ```

2. **Busque múltiplos produtos de uma vez**
   ```javascript
   // Usar endpoint /api/card/batch
   POST /api/card/batch
   { "asins": ["B08N5WRWNW", "B09B93ZDG4"] }
   ```

3. **Não consulte a API para cada pageview**
   - Use cache no navegador
   - Pré-gere cards em build time se possível

---

## ⚠️ Ações Proibidas que Levam a Banimento

### 🔴 Violações Graves:

1. **Cookie stuffing** - forçar cookies de afiliado
2. **Typosquatting** - domínios parecidos com Amazon
3. **Fraude de cliques** - bots, auto-clicks
4. **Incentivos** - "clique no meu link e ganhe X"
5. **Usar links de terceiros** - usar tag de outra pessoa
6. **Toolbar/Extension não autorizada**

### 🟡 Violações Moderadas (warnings):

1. Disclosure inadequado
2. Links em e-mails
3. Preços sem contexto
4. Conteúdo pobre/spam

---

## ✅ Checklist de Compliance

Use esta checklist antes de publicar:

- [ ] Disclosure visível em todas as páginas com links
- [ ] Associate Tag presente em todos os links
- [ ] Preços com contexto ("verifique na Amazon")
- [ ] Data de atualização de preços (se mostrar preços)
- [ ] Imagens vindas da PA-API (não baixadas diretamente)
- [ ] Conteúdo com valor (não apenas links)
- [ ] Nenhum link em e-mails ou e-books
- [ ] Cache configurado (respeitar rate limits)
- [ ] Reviews honestos (não apenas positivos)
- [ ] Links não encurtados/cloaked

---

## 📚 Recursos Oficiais

### Documentação Essencial:

1. **Operating Agreement** (LEIA!)
   https://affiliate-program.amazon.com/help/operating/agreement

2. **Program Policies**
   https://affiliate-program.amazon.com/help/operating/policies

3. **PA-API Documentation**
   https://webservices.amazon.com/paapi5/documentation/

4. **FAQ Oficial**
   https://affiliate-program.amazon.com/help/

### Suporte:

- **E-mail:** affiliates-support@amazon.com
- **Painel:** https://affiliate-program.amazon.com/home

---

## 🔄 Mudanças Recentes (2024)

⚠️ As regras mudam periodicamente. Fique atento a:

1. **IA e Conteúdo Gerado:** Amazon está restringindo conteúdo 100% IA
2. **Novos mercados:** Regras podem variar por país
3. **Requisitos de vendas:** Podem aumentar com o tempo

**Recomendação:** Revise o Operating Agreement a cada 6 meses!

---

## 💡 Dicas de Boas Práticas

### SEO e Conteúdo

1. **Escreva reviews detalhados** - não apenas "compre aqui"
2. **Seja honesto** - mencione prós E contras
3. **Adicione valor** - comparações, tutoriais, guias
4. **Use experiência pessoal** - "eu testei e..."
5. **Otimize para long-tail** - "melhor notebook para programação 2024"

### Técnicas Avançadas

1. **Tabelas comparativas** - vários produtos lado a lado
2. **Guias de compra** - "como escolher X"
3. **Atualização regular** - mantenha conteúdo atual
4. **Call-to-action claro** - "ver preço na Amazon"

### O Que Funciona:

- 📝 Reviews longos e detalhados (1500+ palavras)
- 📊 Comparações de produtos
- 🎥 Vídeos com links na descrição
- 📱 Conteúdo mobile-friendly
- ⭐ Produtos populares + nicho específico

---

## ⚖️ Disclaimer Legal

Este guia é baseado nas regras públicas do Amazon Associates Program (Janeiro 2024). 

**NÃO é aconselhamento jurídico.**

Sempre consulte:
1. O Operating Agreement oficial
2. Um advogado, se tiver dúvidas
3. O suporte da Amazon para casos específicos

---

**Última atualização:** Janeiro 2024  
**Fonte oficial:** https://affiliate-program.amazon.com

🎯 **Lembre-se:** Compliance não é opcional - é essencial para manter sua conta ativa e seu negócio funcionando!
