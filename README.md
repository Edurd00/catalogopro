# 📦 Catálogo Digital & Delivery Multi-Nicho

Uma plataforma moderna e de alta performance de catálogo digital e checkout para delivery. O projeto é totalmente desenvolvido em Vanilla JavaScript no frontend com estilização via TailwindCSS, e integrado ao Supabase (PostgreSQL, Auth e Storage) no backend. A finalização do pedido é direcionada de forma limpa e automática para o WhatsApp do lojista.

---

## 🚀 Principais Funcionalidades

### 🌟 Vitrine de Vendas (Storefront)
- **Filtros e Busca em Tempo Real:** Pesquisa dinâmica de produtos e navegação por categorias em uma barra fixa (*sticky*).
- **Detalhes Completos:** Modal de visualização rápida com carrossel de fotos, seleção interativa de cores, tamanhos e especificações do produto.
- **Carrinho de Compras Interativo:** Drawer lateral para controlar quantidades, cálculo dinâmico de frete (baseado nas configurações da loja ou taxas específicas de produtos).
- **Checkout Integrado:** Formulário de entrega e pagamento, integrando os dados e redirecionando a mensagem estruturada diretamente para o WhatsApp do estabelecimento.
- **Visual Responsivo & Premium:** Adaptado para dispositivos móveis e desktops com design moderno, micro-transições e suporte nativo ao **Modo Escuro (Dark Mode)**.

### 🛡️ Painel Administrativo (Dashboard)
- **Painel de Controle Unificado:** Organizado em abas modernas para fácil operação diária do lojista.
- **Estatísticas em Tempo Real (KPIs):** Visualização de faturamento acumulado, pedidos totais, ticket médio e contagem de produtos ativos.
- **Fluxo de Preparo Kanban:** Acompanhamento de novos pedidos, pedidos em preparação e controle de envio/entrega com apenas um clique.
- **Gerenciador de Catálogo:** Criação, edição, clonagem rápida e exclusão de produtos com upload automático de imagens.
- **Gerenciador de Categorias:** Controle completo sobre as categorias do catálogo.
- **Configurações da Loja:** Customização do nome, logo, banner, WhatsApp, endereço, redes sociais e alteração das cores do tema primária e secundária.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, Vanilla JavaScript (ES Modules)
- **Estilização:** [TailwindCSS v3](https://tailwindcss.com/) & CSS Custom Variables
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Backend-as-a-Service:** [Supabase](https://supabase.com/)
  - PostgreSQL (Database)
  - Supabase Auth (Autenticação do Painel)
  - Supabase Storage (Upload de logotipos e fotos de produtos)

---

## 📁 Estrutura de Pastas

```text
Catalogopro/
├── src/
│   ├── components/      # Componentes UI reutilizáveis (Cart, Product, Toast)
│   ├── config/          # Instância do Supabase e injeção do tema dinâmico
│   ├── context/         # Gerenciamento de estado (AppState / Carrinho)
│   ├── pages/           # Visualizações principais (Admin Dashboard, Login, Storefront)
│   ├── services/        # Consumo das APIs e queries do Supabase
│   ├── styles/          # Folha de estilo global e configurações de animação
│   └── main.js          # Roteador simples e inicialização da aplicação
├── index.html           # Arquivo principal HTML
├── database.sql         # Esquema de criação de tabelas e políticas RLS
├── tailwind.config.js   # Configurações do compilador Tailwind
└── package.json         # Dependências do ecossistema Node
```

---

## ⚙️ Instalação e Execução Local

1. **Instale as dependências do projeto:**
   ```bash
   npm install
   ```

2. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto contendo as credenciais da sua instância do Supabase:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-publica
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Compilar para Produção:**
   ```bash
   npm run build
   ```

---

## 🗄️ Estrutura do Banco de Dados (Supabase DDL)

Para inicializar a estrutura no seu projeto Supabase, acesse o painel **SQL Editor** e execute o conteúdo presente no arquivo `database.sql`. A estrutura inclui as seguintes tabelas:

* `tenant_settings`: Configurações de tema, identidade e dados de contato da loja.
* `categories`: Categorias para segmentação dos produtos.
* `products`: Informações sobre os produtos (preço, descrição, imagens, cores e tamanhos).
* `orders` & `order_items`: Cabeçalhos e itens dos pedidos gerados na finalização de compra.

---

## 🪣 Configurando o Storage no Supabase

Para habilitar o upload de imagens de produtos e logotipos pelo Painel Administrativo, você deve configurar o Storage do seu projeto Supabase:

1. Acesse **Storage** no painel lateral do Supabase.
2. Crie um novo bucket chamado **`loja`** (mantenha a opção **Public** marcada).
3. Crie as seguintes políticas de segurança (Policies) para o bucket `loja`:
   - **Permitir Leitura Pública (SELECT):** Qualquer usuário (anon) pode visualizar imagens.
   - **Permitir Escrita Autenticada (INSERT/UPDATE/DELETE):** Apenas usuários autenticados (Admin) podem enviar imagens para a pasta `uploads/`.
