'use client';

import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/auth.context';
import { useRouter } from 'next/navigation';

const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteMyAccount {
    deleteMyAccount
  }
`;

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteAccount, { loading }] = useMutation(DELETE_ACCOUNT_MUTATION, {
    onCompleted: () => {
      logout();
      router.push('/');
    },
    onError: (error) => {
      alert('Erro ao excluir conta: ' + error.message);
    }
  });

  const handleDeleteAccount = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      deleteAccount();
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
        <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Minha Conta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <p className="mt-1 text-lg">{user.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Conta</label>
                <p className="mt-1 text-lg capitalize">{user.role.toLowerCase()}</p>
              </div>

              {user.storeName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome da Loja</label>
                  <p className="mt-1 text-lg">{user.storeName}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Membro desde</label>
                <p className="mt-1 text-lg">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Ações Rápidas */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              {user.role === 'CLIENT' && (
                <>
                  <button
                    onClick={() => router.push('/orders')}
                    className="w-full btn btn-secondary text-left"
                  >
                    Meus Pedidos
                  </button>
                  <button
                    onClick={() => router.push('/favorites')}
                    className="w-full btn btn-secondary text-left"
                  >
                    Meus Favoritos
                  </button>
                  <button
                    onClick={() => router.push('/cart')}
                    className="w-full btn btn-secondary text-left"
                  >
                    Meu Carrinho
                  </button>
                </>
              )}
              
              {user.role === 'SELLER' && (
                <>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full btn btn-secondary text-left"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => router.push('/my-products')}
                    className="w-full btn btn-secondary text-left"
                  >
                    Meus Produtos
                  </button>
                  <button
                    onClick={() => router.push('/store-orders')}
                    className="w-full btn btn-secondary text-left"
                  >
                    Pedidos da Loja
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Área Perigosa */}
          <div className="card border-red-200">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Área Perigosa</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => logout()}
                className="w-full btn btn-secondary"
              >
                Sair da Conta
              </button>

              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="w-full btn bg-red-500 text-white hover:bg-red-600"
              >
                Excluir Minha Conta
              </button>

              {showDeleteConfirm && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm mb-3">
                    {user.role === 'SELLER' 
                      ? 'Ao excluir sua conta, todos os seus produtos serão desativados.'
                      : 'Ao excluir sua conta, seu histórico de compras será mantido.'
                    }
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="flex-1 btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 btn btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}