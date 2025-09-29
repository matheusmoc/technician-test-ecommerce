# 🛍️ E-commerce Frontend - Documentação

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)
  - [Autenticação & Usuários](#-autenticação--usuários)
  - [Módulo do Cliente](#-módulo-do-cliente)
  - [Módulo do Vendedor](#-módulo-do-vendedor)
  - [Gerenciamento de Conta](#-gerenciamento-de-conta)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Scripts](#-scripts)
- [Deploy](#-deploy)
- [Design System](#-design-system)
- [Fluxos Principais](#-fluxos-principais)
- [Segurança](#-segurança)
- [Troubleshooting](#-troubleshooting)
- [Próximas Funcionalidades](#-próximas-funcionalidades)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
---

## 🎯 Visão Geral

Sistema de e-commerce completo desenvolvido com **Next.js 15**, **Apollo Client** e **Tailwind CSS**, integrado com backend NestJS GraphQL. Oferece experiência completa para clientes e vendedores.

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Next.js** | 15.0.0 | Framework React com App Router |
| **React** | 18.0.0 | Biblioteca UI |
| **TypeScript** | 5.0.0 | Tipagem estática |
| **Apollo Client** | 3.8.0 | Gerenciamento GraphQL |
| **Tailwind CSS** | 3.3.0 | Estilização |
| **GraphQL** | 16.8.0 | API Queries/Mutations |

---



---

## 🚀 Funcionalidades

### 👥 Autenticação & Usuários

#### 🔐 Página de Login (`/login`)
**Funcionalidades:**
- ✅ Autenticação de usuários existentes
- ✅ Validação de formulário em tempo real
- ✅ Redirecionamento automático por role
- ✅ Tratamento de erros
- ✅ Link para registro

**Campos do Formulário:**
- 📧 Email (com validação)
- 🔒 Senha (mínimo 6 caracteres)

#### 📝 Página de Registro (`/register`)
**Funcionalidades:**
- ✅ Criação de nova conta
- ✅ Seleção de tipo de usuário
- ✅ Campo condicional para vendedores
- ✅ Validação de dados
- ✅ Login automático pós-registro

**Tipos de Usuário:**
- 🧑‍💼 **Cliente** - Compra produtos
- 🏪 **Vendedor** - Vende e gerencia produtos

---

### 🛍️ Módulo do Cliente

#### 🏪 Catálogo de Produtos (`/products`)
**Funcionalidades:**
- ✅ Listagem paginada de produtos
- 🔍 Sistema de busca por nome
- 💰 Filtros por preço (min/max)
- 🛒 Adição ao carrinho
- ❤️ Favoritar produtos
- 📊 Visualização de estoque
- 👨‍💼 Informações do vendedor

**Filtros Disponíveis:**
- 🔎 Busca textual
- 💵 Faixa de preço
- 🏪 Filtro por vendedor

#### ❤️ Favoritos (`/favorites`)
**Funcionalidades:**
- ✅ Lista de produtos favoritados
- 🗑️ Remoção de favoritos
- 🔗 Navegação para produtos
- 📱 Design responsivo

#### 🛒 Carrinho de Compras (`/cart`)
**Funcionalidades:**
- ✅ Visualização de itens
- 🔢 Ajuste de quantidades
- 🗑️ Remoção de itens
- 🧮 Cálculo automático de total
- 📦 Validação de estoque
- 💰 Checkout integrado

**Ações:**
- ➕ Incrementar quantidade
- ➖ Decrementar quantidade
- ❌ Remover item
- 🎯 Finalizar compra

#### 📦 Pedidos e Pagamentos (`/orders`)
**Funcionalidades:**
- ✅ Histórico completo de pedidos
- 📋 Detalhes de cada pedido
- 💳 Processamento de pagamento
- 🏦 Múltiplos métodos de pagamento
- 📊 Acompanhamento de status

**Métodos de Pagamento:**
- 🔶 PIX
- 💳 Cartão de Crédito
- 🏦 Cartão de Débito
- 📄 Boleto Bancário
- 🔵 PayPal

**Status de Pedido:**
- 🟡 **PENDENTE** - Aguardando pagamento
- 🟢 **PAGO** - Pagamento confirmado
- 🔵 **ENVIADO** - Produto despachado
- 🟣 **ENTREGUE** - Pedido finalizado
- 🔴 **CANCELADO** - Pedido cancelado

---

### 🏪 Módulo do Vendedor

#### 📊 Dashboard (`/dashboard`)
**Métricas:**
- 📦 Total de produtos cadastrados
- 💰 Quantidade total vendida
- 🏦 Faturamento total
- 🏆 Produto mais vendido

**Cards de Métricas:**
- 🏷️ Produtos Cadastrados
- 📈 Total Vendido
- 💵 Faturamento
- ⭐ Produto Mais Vendido

#### 📦 Gerenciamento de Produtos (`/my-products`)
**Funcionalidades CRUD:**
- ✅ **Create** - Cadastro de novos produtos
- ✅ **Read** - Listagem dos produtos
- ✅ **Update** - Edição de produtos
- ✅ **Delete** - Exclusão de produtos

**Formulário de Produto:**
- 🏷️ Nome do produto
- 💰 Preço (decimal)
- 📝 Descrição
- 🖼️ URL da imagem
- 📦 Quantidade em estoque
- 🟢 Status ativo/inativo

#### 📋 Pedidos da Loja (`/store-orders`)
**Funcionalidades:**
- ✅ Visualização de pedidos
- 📋 Detalhes completos
- 💳 Status de pagamento
- 📦 Informações dos itens

---

### 👤 Gerenciamento de Conta

#### ⚙️ Minha Conta (`/account`)
**Funcionalidades:**
- ✅ Informações pessoais
- 🚀 Ações rápidas
- 🔐 Logout seguro
- 🗑️ Exclusão de conta

**Informações:**
- 👤 Nome completo
- 📧 Email
- 🏷️ Tipo de conta
- 🏪 Nome da loja (vendedores)
- 📅 Data de criação

**Ações Rápidas:**
- **Clientes:** 📦 Pedidos, ❤️ Favoritos, 🛒 Carrinho
- **Vendedores:** 📊 Dashboard, 📦 Produtos, 📋 Pedidos

---

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Backend NestJS rodando

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/matheusmoc/technician-test-ecommerce.git
cd frontend
npm install
npm run dev

http://localhost:3000

