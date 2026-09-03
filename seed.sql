-- ==========================================================
-- SCRIPT DE SEED / DADOS FAKES PARA NEON POSTGRESQL
-- Tabelas: categories e products
-- Execute este script no SQL Editor do seu console no Neon
-- ==========================================================

-- 1. Garante que as tabelas existem (caso ainda não tenham sido criadas)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- 2. Limpa dados anteriores se desejar recriar do zero (opcional)
-- TRUNCATE TABLE products, categories RESTART IDENTITY CASCADE;

-- 3. Inserção de Categorias
INSERT INTO categories (id, name, description) VALUES
(1, 'Eletrônicos & Tech', 'Gadgets de última geração, áudio de alta fidelidade e tecnologia para o dia a dia.'),
(2, 'Moda & Vestuário', 'Roupas modernas, tecidos premium e peças essenciais para o seu estilo.'),
(3, 'Calçados & Sneakers', 'Tênis urbanos, casuais e esportivos com design exclusivo e máximo conforto.'),
(4, 'Acessórios & Estilo', 'Relógios, mochilas e óculos para complementar seu visual em qualquer ocasião.'),
(5, 'Casa & Decoração', 'Itens minimalistas e funcionais para transformar o seu ambiente de trabalho ou casa.')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Atualiza sequência de ID das categorias
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 4. Inserção de Produtos
INSERT INTO products (id, category_id, name, description, price, image_url, stock_quantity, is_active) VALUES
-- Categoria 1: Eletrônicos & Tech
(1, 1, 'Headphone Bluetooth Noise Cancelling Pro', 'Cancelamento ativo de ruído híbrido, drivers de 40mm de titânio e autonomia de até 35 horas de reprodução contínua.', 399.90, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 18, TRUE),
(2, 1, 'Smartwatch AMOLED Ultra Fit', 'Tela Always-on AMOLED de 1.43", monitoramento cardíaco contínuo, GPS integrado e resistência à água de 5ATM.', 299.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', 25, TRUE),
(3, 1, 'Teclado Mecânico Wireless RGB Compact', 'Switches táteis hot-swappable, conectividade Tri-Mode (Bluetooth, 2.4GHz e USB-C) e iluminação RGB programável.', 320.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', 12, TRUE),
(4, 1, 'Caixa de Som Portátil Waterproof 30W', 'Som envolvente de 360 graus, graves potentes com radiadores passivos duplos e certificação IPX7 à prova dágua.', 189.90, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80', 30, TRUE),

-- Categoria 2: Moda & Vestuário
(5, 2, 'Camiseta Oversized Minimalist Algodão Egípcio', 'Modelagem boxy moderna, 100% algodão penteado de alta gramatura (240g) com toque super macio e caimento impecável.', 89.90, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 45, TRUE),
(6, 2, 'Jaqueta Corta-Vento Urban Techwear', 'Tecido impermeável e corta-vento com detalhes refletivos, capuz ergonômico ajustável e bolsos selados térmicos.', 239.00, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', 15, TRUE),
(7, 2, 'Moletom Hoodie Heavyweight Essential', 'Interior felpado ultra quente, costuras reforçadas pespontadas e corte unissex premium para dias mais frios.', 199.90, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', 20, TRUE),

-- Categoria 3: Calçados & Sneakers
(8, 3, 'Sneaker Retro Runner Casual Branco & Vermelho', 'Inspirado nos clássicos do street style dos anos 90, com entressola em EVA macio e cabedal de couro legítimo camurçado.', 329.90, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', 14, TRUE),
(9, 3, 'Tênis Running Performance CloudFly', 'Amortecimento responsivo de alta absorção de impacto, cabedal em malha respirável knit sem costuras.', 379.00, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', 22, TRUE),
(10, 3, 'Bota Coturno Couro Legitimo Urban Black', 'Solado tratorado em borracha antiderrapante com vira costurada Goodyear welted para máxima durabilidade.', 349.90, 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80', 10, TRUE),

-- Categoria 4: Acessórios & Estilo
(11, 4, 'Mochila Impermeável SafeRoll 25L', 'Compartimento acolchoado para notebook de até 16", zíperes anti-furto selados e tecido resistente à abrasão.', 199.90, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 16, TRUE),
(12, 4, 'Óculos de Sol Acetato Polarizado Classic', 'Lentes com 100% de proteção UV400, armação artesanal em acetato preto fosco e dobradiças reforçadas de metal.', 139.90, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', 28, TRUE),
(13, 4, 'Relógio Minimalista Cronógrafo All-Black', 'Mecanismo quartzo japonês de precisão, pulseira de aço inoxidável em malha milanesa e vidro safira resistente a riscos.', 289.00, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', 15, TRUE),

-- Categoria 5: Casa & Decoração
(14, 5, 'Luminária de Mesa Articulada LED Smart', 'Controle touch de temperatura de cor (quente, neutra, fria) e dimerização gradual com porta de carregamento USB integrada.', 129.90, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', 20, TRUE),
(15, 5, 'Garrafa Térmica Inox Vacuum 750ml', 'Isolamento térmico à vácuo de parede dupla que mantém bebidas geladas por 24h e quentes por 12h sem condensação externa.', 69.90, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80', 40, TRUE)
ON CONFLICT (id) DO UPDATE 
SET category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    image_url = EXCLUDED.image_url,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

-- Atualiza sequência de ID dos produtos
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
