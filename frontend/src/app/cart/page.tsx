'use client';

import React from 'react';
import { gql } from '@apollo/client'; 
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/auth.context';
import Link from 'next/link';
import Image from 'next/image'; 

const CART_QUERY = gql`
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
    }
  }
`;


const UPDATE_CART_MUTATION = gql`
  mutation UpdateCartItem($productId: String!, $quantity: Float!) {
    updateCartItem(productId: $productId, quantity: $quantity) {
      id
      items {
        id
        productId
        quantity
        product {
          name
          price
        }
      }
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation RemoveFromCart($productId: String!) {
    removeFromCart(productId: $productId) {
      id
      items {
        id
        productId
        quantity
      }
    }
  }
`;

const CHECKOUT_MUTATION = gql`
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
    }
  }
`;

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
}

interface CartData {
  cart: {
    id: string;
    items: CartItem[];
  };
}

export default function CartPage() {
  const { user } = useAuth();
  
  const { data, loading, error, refetch } = useQuery<CartData>(CART_QUERY);
  
  const [updateCart] = useMutation(UPDATE_CART_MUTATION, {
    onCompleted: () => refetch()
  });
  
  const [removeFromCart] = useMutation(REMOVE_FROM_CART_MUTATION, {
    onCompleted: () => refetch()
  });
  
  const [checkout, { loading: checkoutLoading }] = useMutation(CHECKOUT_MUTATION, {
    onCompleted: () => {
      alert('Pedido criado com sucesso!');
      window.location.href = `/store-orders`;
    },
    onError: (error) => {
      alert('Erro ao finalizar pedido: ' + error.message);
    }
  });

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart({ variables: { productId } });
    } else {
      updateCart({ variables: { productId, quantity } });
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart({ variables: { productId } });
  };

  const handleCheckout = () => {
    checkout();
  };

  if (loading) return <div className="container mx-auto p-6 text-center">Carregando carrinho...</div>;
  if (error) return <div className="container mx-auto p-6 text-center text-red-500">Erro: {error.message}</div>;

  const cart = data?.cart;
  const items = cart?.items || [];

  const total = items.reduce((sum: number, item: CartItem) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  if (user?.role !== 'CLIENT') {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Carrinho</h1>
        <p className="text-gray-600">Apenas clientes podem acessar o carrinho.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>

      {items.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
          <Link href="/products" className="btn btn-primary">
            Continuar Comprando
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Itens no Carrinho</h2>
              
              <div className="space-y-4">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-primary-600 font-semibold">
                        R$ {item.product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Estoque: {item.product.stock}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 text-sm hover:text-red-700 mt-1"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="card h-fit">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-primary-600">R$ {total.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading || items.length === 0}
              className="w-full btn btn-primary disabled:opacity-50"
            >
              {checkoutLoading ? 'Processando...' : 'Finalizar Compra'}
            </button>

            <div className="mt-4 text-sm text-gray-500">
              <p>• Frete grátis para todo o Brasil</p>
              <p>• Entrega em até 7 dias úteis</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}