# 🛍️ E-commerce System - Apresentação e Funcionalidades

## 🎯 Apresentação do Sistema

Este sistema de **E-commerce** foi desenvolvido utilizando **Next.js** no front-end, **NestJS** com **GraphQL** no back-end, e **SQLite** como banco de dados.  
O sistema permite que usuários se registrem como **Clientes** ou **Vendedores**, oferecendo uma experiência completa de compra, gerenciamento de produtos e acompanhamento de pedidos.  

Principais características:
- Autenticação segura utilizando JWT e gerenciamento de papéis de usuário (Cliente e Vendedor).
- Catálogo de produtos com busca, filtros e paginação.
- Carrinho de compras persistente e histórico de pedidos.
- Dashboard do vendedor com métricas de vendas.
- Upload de produtos via formulário ou CSV.
- Integração GraphQL para comunicação eficiente entre front-end e back-end.

---

## ✅ Funcionalidades Desenvolvidas

### 1. Autenticação & Papéis de Usuário
- [x] Usuário pode criar conta como **Cliente** ou **Vendedor**
- [x] Login de usuários existentes
- [x] Cliente pode excluir sua própria conta
  - [x] Histórico de compras mantido
- [x] Vendedor pode desativar sua própria conta
  - [x] Produtos da loja são automaticamente ocultados

<img width="1917" height="867" alt="Captura de tela 2025-09-28 134405" src="https://github.com/user-attachments/assets/b832cb00-ee7c-4bd3-aa4e-a5abbc55b9d9" />
<img width="1142" height="448" alt="Captura de tela 2025-09-28 134551" src="https://github.com/user-attachments/assets/f4e5ff49-2545-4e28-b578-a1878103d951" />
<img width="1916" height="760" alt="Captura de tela 2025-09-28 134418" src="https://github.com/user-attachments/assets/8533f3f9-bafe-4599-bfa5-d3a6df83e22b" />





### 2. Funcionalidades do Vendedor
- [x] Criar e gerenciar produtos na própria loja
- [x] Cadastro manual de produtos via formulário
- [ ] Upload de múltiplos produtos via arquivo CSV
  - [ ] Suporte a grandes volumes de dados sem prejudicar a experiência 
- [x] Dashboard do vendedor com métricas:
  - [x] Total de produtos vendidos
  - [x] Faturamento total
  - [x] Quantidade de produtos cadastrados
  - [x] Produto mais vendido
- [x] Propriedades obrigatórias do produto:
  - [x] Nome
  - [x] Preço
  - [x] Descrição
  - [x] Data de publicação
  - [x] URL da imagem
<img width="1473" height="620" alt="Captura de tela 2025-09-28 134619" src="https://github.com/user-attachments/assets/00bb900b-ac21-46e3-a70e-e0fda9f77ad0" />
<img width="1011" height="580" alt="Captura de tela 2025-09-28 134723" src="https://github.com/user-attachments/assets/4cf04832-b61c-47b7-b251-c1ec29a73fb0" />
<img width="1919" height="576" alt="Captura de tela 2025-09-28 140049" src="https://github.com/user-attachments/assets/9ec3b036-2a14-4eff-af21-a52864a2ad1d" />



### 3. Funcionalidades do Cliente
- [x] Pesquisar produtos cadastrados pelos vendedores
  - [x] Filtragem feita no back-end
  - [x] Listagem paginada
- [x] Favoritar produtos
- [x] Carrinho de compras persistente
- [x] Finalizar compras
  - [x] Registro adicionado ao histórico de compras
- [x] Acessar histórico de compras
<img width="1838" height="540" alt="image" src="https://github.com/user-attachments/assets/af9b3a84-a822-41d1-9132-f53d4bbd1a1b" />
<img width="1804" height="423" alt="image" src="https://github.com/user-attachments/assets/92ab00de-96fd-4022-bf22-019e31449391" />
<img width="1427" height="376" alt="Captura de tela 2025-09-28 134905" src="https://github.com/user-attachments/assets/439c2afb-a1cf-432b-b469-76137ac54faa" />
<img width="1358" height="652" alt="Captura de tela 2025-09-28 135019" src="https://github.com/user-attachments/assets/627ff9c4-b671-4609-b497-20b80b0f2c6c" />
<img width="1358" height="652" alt="Captura de tela 2025-09-28 135019" src="https://github.com/user-attachments/assets/7c77681a-238d-400b-a486-cee03dca2c21" />
<img width="1457" height="830" alt="Captura de tela 2025-09-28 135038" src="https://github.com/user-attachments/assets/5f7bcf65-778e-4e62-ac30-a1d9cb6ff6a8" />
<img width="1327" height="624" alt="Captura de tela 2025-09-28 135104" src="https://github.com/user-attachments/assets/2ef9b1dd-7556-4c4b-a279-f65b1e524a9a" />







