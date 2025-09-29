# 🚀 E-commerce - Backend GraphQL Documentation

## 📋 Quick Start

### 1. Start Backend
```bash
cd backend
npm install
npm run start:dev
```



# 🛍️ Documentação GraphQL - E-commerce

Este documento reúne todas as **queries** e **mutations** do sistema, com exemplos prontos para uso no **GraphQL Playground**.

---

## 🔐 AUTENTICAÇÃO

### 📝 Registrar Usuário
```graphql
mutation Register {
  register(input: {
    email: "user@example.com",
    password: "password123",
    name: "User Name",
    role: CLIENT, # ou SELLER
    storeName: "Minha Loja" # obrigatório para SELLER
  }) {
    token
    user {
      id
      email
      name
      role
      storeName
      isActive
      createdAt
    }
  }
}
```


🔐 Login
```graphql
mutation Login {
  login(input: {
    email: "user@example.com",
    password: "password123"
  }) {
    token
    user {
      id
      email
      name
      role
      storeName
      isActive
      createdAt
    }
  }
}
```

🗑️ Excluir Conta (Cliente)
```graphql
mutation DeleteMyAccount {
  deleteMyAccount
}
```

🛍️ PRODUTOS
📋 Listar Produtos
```graphql
query Products {
  products(filter: {
    search: "nome do produto",
    minPrice: 10.0,
    maxPrice: 100.0,
    page: 1,
    limit: 10
  }) {
    id
    name
    price
    description
    imageUrl
    stock
    isActive
    seller {
      id
      name
      storeName
    }
    createdAt
  }
}
```
```graphql
🏪 Meus Produtos (Vendedor)
query MyProducts {
  myProducts {
    id
    name
    price
    description
    imageUrl
    stock
    isActive
    createdAt
  }
}
```

➕ Criar Produto (Vendedor)
```graphql
mutation CreateProduct {
  createProduct(input: {
    name: "Nome do Produto",
    price: 99.99,
    description: "Descrição do produto",
    imageUrl: "https://example.com/image.jpg",
    stock: 10
  }) {
    id
    name
    price
    description
    imageUrl
    stock
    isActive
    createdAt
  }
}
```

✏️ Atualizar Produto
```graphql
mutation UpdateProduct {
  updateProduct(
    id: "product-id",
    input: {
      name: "Nome Atualizado",
      price: 89.99,
      description: "Descrição atualizada",
      imageUrl: "https://example.com/new-image.jpg",
      stock: 5
    }
  ) {
    id
    name
    price
    description
    imageUrl
    stock
    isActive
  }
}
```

🗑️ Deletar Produto
```graphql
mutation DeleteProduct {
  deleteProduct(id: "product-id")
}
```

🛒 CARRINHO
🛍️ Ver Carrinho
```graphql
query Cart {
  cart {
    id
    items {
      id
      productId
      quantity
      product {
        id
        name
        price
        imageUrl
        stock
      }
    }
    createdAt
    updatedAt
  }
}
```

➕ Adicionar ao Carrinho
```graphql
mutation AddToCart {
  addToCart(productId: "product-id") {
    id
    items {
      productId
      quantity
      product {
        name
        price
      }
    }
  }
}
```

🔢 Atualizar Quantidade
```graphql
mutation UpdateCartItem {
  updateCartItem(productId: "product-id", quantity: 2) {
    id
    items {
      productId
      quantity
      product {
        name
        price
      }
    }
  }
}
```

🗑️ Remover do Carrinho
```graphql
mutation RemoveFromCart {
  removeFromCart(productId: "product-id") {
    id
    items {
      productId
      quantity
    }
  }
}
```

🧹 Limpar Carrinho
```graphql
mutation ClearCart {
  clearCart
}
```

📦 PEDIDOS & PAGAMENTOS
🛍️ Finalizar Compra (Checkout)
```graphql
mutation Checkout {
  checkout {
    id
    total
    status
    items {
      productId
      quantity
      price
      name
    }
    createdAt
  }
}
```

💳 Processar Pagamento
```graphql
mutation ProcessPayment {
  processPayment(input: {
    orderId: "order-id",
    paymentMethod: PIX # CREDIT_CARD, DEBIT_CARD, BANK_SLIP, PAYPAL
  }) {
    success
    message
    order {
      id
      status
      updatedAt
    }
  }
}
```

📋 Meus Pedidos (Cliente)
```graphql
query MyOrders {
  myOrders {
    id
    total
    status
    createdAt
    items {
      name
      quantity
      price
    }
    payment {
      paymentMethod
      status
      amount
    }
  }
}
```

🏪 Pedidos da Minha Loja (Vendedor)
```graphql
query StoreOrders {
  myStoreOrders {
    id
    total
    status
    createdAt
    items {
      name
      quantity
      price
    }
    payment {
      paymentMethod
      status
    }
  }
}
```

❤️ FAVORITOS
📋 Meus Favoritos
```graphql
query Favorites {
  favorites {
    id
    name
    price
    description
    imageUrl
    stock
    seller {
      name
      storeName
    }
  }
}
```

🔄 Alternar Favorito
```graphql
mutation ToggleFavorite {
  toggleFavorite(productId: "product-id")
}
```

📊 DASHBOARD (Vendedor)
📈 Estatísticas do Vendedor
```graphql
query SellerStats {
  sellerStats {
    totalProducts
    totalSold
    revenue
    bestSeller {
      product {
        id
        name
        price
      }
      sales
    }
  }
}
```

👤 PERFIL DO USUÁRIO
👤 Meu Perfil
```graphql
query Me {
  me {
    id
    email
    name
    role
    storeName
    isActive
    createdAt
    updatedAt
  }
}
```

🎯 EXEMPLOS DE USO
Fluxo Completo de Compra
# 1. Adicionar produtos ao carrinho
```graphql
mutation AddProducts {
  addToCart(productId: "product-1") { ... }
  addToCart(productId: "product-2") { ... }
}
```
# 2. Verificar carrinho
```graphql
query CheckCart {
  cart {
    items {
      productId
      quantity
      product {
        name
        price
      }
    }
  }
}
```

# 3. Finalizar compra
```graphql
mutation CheckoutOrder {
  checkout {
    id
    total
    items { ... }
  }
}
```

# 4. Processar pagamento
```graphql
mutation PayOrder {
  processPayment(input: {
    orderId: "order-id",
    paymentMethod: PIX
  }) { ... }
}
```

# 5. Ver status do pedido
```graphql
query OrderStatus {
  myOrders {
    id
    status
    payment { ... }
  }
}
```

Fluxo do Vendedor
# 1. Criar produto
```graphql
mutation CreateProducts {
  createProduct(input: { ... }) { ... }
}
```

# 2. Ver dashboard
```graphql
query Dashboard {
  sellerStats {
    totalProducts
    revenue
    bestSeller { ... }
  }
}
```

# 3. Gerenciar pedidos
```graphql
query StoreOrders {
  myStoreOrders {
    id
    status
    total
    items { ... }
  }
}
```

🔧 TROUBLESHOOTING
Erros Comuns

401 Unauthorized → Adicione o header de autenticação Authorization: Bearer {token}

404 Not Found → Verifique se o backend está rodando na porta 3001

Erros de campo → Confira se os nomes dos campos nas queries/mutations estão corretos

Headers para Requisições Autenticadas
{
  "Authorization": "Bearer seu-jwt-token",
  "Content-Type": "application/json"
}

Testes no GraphQL Playground

Acesse: http://localhost:3001/graphql

Para operações autenticadas com JWT, use o header:

{
  "Authorization": "Bearer seu-token"
}
