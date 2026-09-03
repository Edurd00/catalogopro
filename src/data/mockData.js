/**
 * Mock Data para Catálogo Pro
 * Alinhado 100% com o schema das tabelas do Neon:
 * - categories (id, name, description, created_at)
 * - products (id, category_id, name, description, price, image_url, stock_quantity, is_active, created_at, updated_at)
 */

export const mockCategories = [
  {
    id: 1,
    name: 'Eletrônicos & Tech',
    description: 'Gadgets de última geração, áudio de alta fidelidade e tecnologia para o dia a dia.'
  },
  {
    id: 2,
    name: 'Moda & Vestuário',
    description: 'Roupas modernas, tecidos premium e peças essenciais para o seu estilo.'
  },
  {
    id: 3,
    name: 'Calçados & Sneakers',
    description: 'Tênis urbanos, casuais e esportivos com design exclusivo e máximo conforto.'
  },
  {
    id: 4,
    name: 'Acessórios & Estilo',
    description: 'Relógios, mochilas e óculos para complementar seu visual em qualquer ocasião.'
  },
  {
    id: 5,
    name: 'Casa & Decoração',
    description: 'Itens minimalistas e funcionais para transformar o seu ambiente de trabalho ou casa.'
  }
];

export const mockProducts = [
  // ─── Categoria 1: Eletrônicos & Tech ───────────────────────────
  {
    id: 1,
    category_id: 1,
    name: 'Headphone Bluetooth Noise Cancelling Pro',
    description: 'Cancelamento ativo de ruído híbrido, drivers de 40mm de titânio e autonomia de até 35 horas de reprodução contínua.',
    price: 489.90,
    promo_price: 399.90,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 18,
    is_active: true
  },
  {
    id: 2,
    category_id: 1,
    name: 'Smartwatch AMOLED Ultra Fit',
    description: 'Tela Always-on AMOLED de 1.43", monitoramento cardíaco contínuo, GPS integrado e resistência à água de 5ATM.',
    price: 359.00,
    promo_price: 299.00,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 25,
    is_active: true
  },
  {
    id: 3,
    category_id: 1,
    name: 'Teclado Mecânico Wireless RGB Compact',
    description: 'Switches táteis hot-swappable, conectividade Tri-Mode (Bluetooth, 2.4GHz e USB-C) e iluminação RGB programável.',
    price: 320.00,
    promo_price: null,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 12,
    is_active: true
  },
  {
    id: 4,
    category_id: 1,
    name: 'Caixa de Som Portátil Waterproof 30W',
    description: 'Som envolvente de 360 graus, graves potentes com radiadores passivos duplos e certificação IPX7 à prova dágua.',
    price: 229.90,
    promo_price: 189.90,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 30,
    is_active: true
  },

  // ─── Categoria 2: Moda & Vestuário ─────────────────────────────
  {
    id: 5,
    category_id: 2,
    name: 'Camiseta Oversized Minimalist Algodão Egípcio',
    description: 'Modelagem boxy moderna, 100% algodão penteado de alta gramatura (240g) com toque super macio e caimento impecável.',
    price: 119.90,
    promo_price: 89.90,
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 45,
    is_active: true
  },
  {
    id: 6,
    category_id: 2,
    name: 'Jaqueta Corta-Vento Urban Techwear',
    description: 'Tecido impermeável e corta-vento com detalhes refletivos, capuz ergonômico ajustável e bolsos selados térmicos.',
    price: 279.00,
    promo_price: 239.00,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 15,
    is_active: true
  },
  {
    id: 7,
    category_id: 2,
    name: 'Moletom Hoodie Heavyweight Essential',
    description: 'Interior felpado ultra quente, costuras reforçadas pespontadas e corte unissex premium para dias mais frios.',
    price: 199.90,
    promo_price: null,
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 20,
    is_active: true
  },

  // ─── Categoria 3: Calçados & Sneakers ──────────────────────────
  {
    id: 8,
    category_id: 3,
    name: 'Sneaker Retro Runner Casual Branco & Vermelho',
    description: 'Inspirado nos clássicos do street style dos anos 90, com entressola em EVA macio e cabedal de couro legítimo camurçado.',
    price: 389.90,
    promo_price: 329.90,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 14,
    is_active: true
  },
  {
    id: 9,
    category_id: 3,
    name: 'Tênis Running Performance CloudFly',
    description: 'Amortecimento responsivo de alta absorção de impacto, cabedal em malha respirável knit sem costuras.',
    price: 449.00,
    promo_price: 379.00,
    image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 22,
    is_active: true
  },
  {
    id: 10,
    category_id: 3,
    name: 'Bota Coturno Couro Legitimo Urban Black',
    description: 'Solado tratorado em borracha antiderrapante com vira costurada Goodyear welted para máxima durabilidade.',
    price: 349.90,
    promo_price: null,
    image_url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 10,
    is_active: true
  },

  // ─── Categoria 4: Acessórios & Estilo ──────────────────────────
  {
    id: 11,
    category_id: 4,
    name: 'Mochila Impermeável SafeRoll 25L',
    description: 'Compartimento acolchoado para notebook de até 16", zíperes anti-furto selados e tecido resistente à abrasão.',
    price: 249.90,
    promo_price: 199.90,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 16,
    is_active: true
  },
  {
    id: 12,
    category_id: 4,
    name: 'Óculos de Sol Acetato Polarizado Classic',
    description: 'Lentes com 100% de proteção UV400, armação artesanal em acetato preto fosco e dobradiças reforçadas de metal.',
    price: 169.90,
    promo_price: 139.90,
    image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 28,
    is_active: true
  },
  {
    id: 13,
    category_id: 4,
    name: 'Relógio Minimalista Cronógrafo All-Black',
    description: 'Mecanismo quartzo japonês de precisão, pulseira de aço inoxidável em malha milanesa e vidro safira resistente a riscos.',
    price: 289.00,
    promo_price: null,
    image_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 15,
    is_active: true
  },

  // ─── Categoria 5: Casa & Decoração ─────────────────────────────
  {
    id: 14,
    category_id: 5,
    name: 'Luminária de Mesa Articulada LED Smart',
    description: 'Controle touch de temperatura de cor (quente, neutra, fria) e dimerização gradual com porta de carregamento USB integrada.',
    price: 159.90,
    promo_price: 129.90,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 20,
    is_active: true
  },
  {
    id: 15,
    category_id: 5,
    name: 'Garrafa Térmica Inox Vacuum 750ml',
    description: 'Isolamento térmico à vácuo de parede dupla que mantém bebidas geladas por 24h e quentes por 12h sem condensação externa.',
    price: 89.90,
    promo_price: 69.90,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 40,
    is_active: true
  }
];
