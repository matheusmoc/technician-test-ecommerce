'use client';

import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/auth.context';
import Link from 'next/link';

const MY_ORDERS_QUERY = gql`
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
        id
        paymentMethod
        status
        amount
      }
    }
  }
`;

const PROCESS_PAYMENT_MUTATION = gql`
  mutation ProcessPayment($input: ProcessPaymentInput!) {
    processPayment(input: $input) {
      success
      message
      order {
        id
        status
        updatedAt
      }
    }
  }
`;

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Payment {
  id: string;
  paymentMethod: string;
  status: string;
  amount: number;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  payment?: Payment;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('PIX');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { data, loading, error, refetch } = useQuery<{ myOrders: Order[] }>(MY_ORDERS_QUERY);

  const [processPayment, { loading: paymentLoading }] = useMutation<{ processPayment: { success: boolean; message: string; order: { id: string; status: string; updatedAt: string } } }>(PROCESS_PAYMENT_MUTATION, {
    onCompleted: (data) => {
      if (data.processPayment.success) {
        alert('Pagamento processado com sucesso!');
        setShowPaymentModal(false);
        setSelectedOrder(null);
        refetch();
      } else {
        alert('Erro no pagamento: ' + data.processPayment.message);
      }
    },
    onError: (error) => {
      alert('Erro ao processar pagamento: ' + error.message);
    }
  });

  const handleProcessPayment = (order: Order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedOrder) return;

    processPayment({
      variables: {
        input: {
          orderId: selectedOrder.id,
          paymentMethod: paymentMethod
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'PAGO';
      case 'PENDING':
        return 'PENDENTE';
      case 'CANCELLED':
        return 'CANCELADO';
      case 'SHIPPED':
        return 'ENVIADO';
      case 'DELIVERED':
        return 'ENTREGUE';
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'CONCLUÍDO';
      case 'PENDING':
        return 'PENDENTE';
      case 'FAILED':
        return 'FALHOU';
      case 'REFUNDED':
        return 'REEMBOLSADO';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Meus Pedidos</h1>
        <p className="text-gray-600">Você precisa estar logado para ver seus pedidos.</p>
        <Link href="/login" className="btn btn-primary mt-4">
          Fazer Login
        </Link>
      </div>
    );
  }

  if (loading) return <div className="container mx-auto p-6 text-center">Carregando pedidos...</div>;
  if (error) return <div className="container mx-auto p-6 text-center text-red-500">Erro: {error.message}</div>;

  const orders = data?.myOrders || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
        <Link href="/products" className="btn btn-primary">
          Continuar Comprando
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-600 mb-4">Você ainda não fez nenhum pedido.</p>
          <Link href="/products" className="btn btn-primary">
            Fazer Minha Primeira Compra
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Pedido #{order.id.slice(-8)}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">R$ {order.total.toFixed(2)}</p>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Itens do Pedido:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span>{item.name} x {item.quantity}</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {order.payment && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">Pagamento:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Método:</span>
                      <p className="font-medium">{order.payment.paymentMethod}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className="font-medium">{getPaymentStatusText(order.payment.status)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Valor:</span>
                      <p className="font-medium">R$ {order.payment.amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {order.status === 'PENDING' && (
                <div className="border-t pt-4 mt-4">
                  <button
                    onClick={() => handleProcessPayment(order)}
                    className="btn btn-primary w-full"
                  >
                    Realizar Pagamento
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Pagamento */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Processar Pagamento</h2>
            
            <div className="mb-4">
              <p className="text-gray-600">Pedido: #{selectedOrder.id.slice(-8)}</p>
              <p className="text-lg font-bold">Total: R$ {selectedOrder.total.toFixed(2)}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input w-full"
              >
                <option value="PIX">PIX</option>
                <option value="CREDIT_CARD">Cartão de Crédito</option>
                <option value="DEBIT_CARD">Cartão de Débito</option>
                <option value="BANK_SLIP">Boleto Bancário</option>
                <option value="PAYPAL">PayPal</option>
              </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Atenção:</strong> Esta é uma simulação de pagamento. 
                Em um ambiente real, você seria redirecionado para um gateway de pagamento.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleConfirmPayment}
                disabled={paymentLoading}
                className="flex-1 btn btn-primary disabled:opacity-50"
              >
                {paymentLoading ? 'Processando...' : 'Confirmar Pagamento'}
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 btn btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}