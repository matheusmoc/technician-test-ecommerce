'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth.context';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-primary-600">
            E-Commerce
          </Link>

          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/products" className="text-gray-700 hover:text-primary-600">
                  Produtos
                </Link>
                
                {user?.role === 'CLIENT' && (
                  <>
                    <Link href="/cart" className="text-gray-700 hover:text-primary-600">
                      Carrinho
                    </Link>
                    <Link href="/orders" className="text-gray-700 hover:text-primary-600">
                      Meus Pedidos
                    </Link>
                    <Link href="/favorites" className="text-gray-700 hover:text-primary-600">
                      Favoritos
                    </Link>
                  </>
                )}
                
                {user?.role === 'SELLER' && (
                  <>
                    <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                      Dashboard
                    </Link>
                    <Link href="/my-products" className="text-gray-700 hover:text-primary-600">
                      Meus Produtos
                    </Link>
                    <Link href="/store-orders" className="text-gray-700 hover:text-primary-600">
                      Pedidos
                    </Link>
                  </>
                )}
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Olá, {user?.name}
                  </span>
                  <button
                    onClick={logout}
                    className="btn btn-secondary text-sm"
                  >
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="btn btn-secondary">
                  Entrar
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Cadastrar
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};