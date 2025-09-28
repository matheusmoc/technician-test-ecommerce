'use client';

import React from 'react';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/context/auth.context';

interface StoreOrdersQuery {
  myStoreOrders: {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    payment?: {
      paymentMethod: string;
      status: string;
    };
  }[];
}

const STORE_ORDERS_QUERY: TypedDocumentNode<StoreOrdersQuery> = gql`
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
`;

export default function StoreOrdersPage() {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(STORE_ORDERS_QUERY);

  if (user?.role !== 'SELLER') {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        <p className="text-gray-600">Apenas vendedores podem acessar esta página.</p>
      </div>
    );
  }

  if (loading) return <div className="container mx-auto p-6 text-center">Carregando pedidos...</div>;
  if (error) return <div className="container mx-auto p-6 text-center text-red-500">Erro: {error.message}</div>;

  const orders = data?.myStoreOrders || [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pedidos da Minha Loja</h1>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <div key={order.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Pedido #{order.id.slice(-8)}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">R$ {order.total.toFixed(2)}</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status === 'PAID' ? 'PAGO' :
                   order.status === 'PENDING' ? 'PENDENTE' : order.status}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Itens do Pedido:</h4>
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm mb-1">
                  <span>{item.name} x {item.quantity}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {order.payment && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Pagamento:</h4>
                <div className="flex justify-between text-sm">
                  <span>Método: {order.payment.paymentMethod}</span>
                  <span>Status: {order.payment.status}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>Nenhum pedido encontrado para sua loja.</p>
        </div>
      )}
    </div>
  );
}