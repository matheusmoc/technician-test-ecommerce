'use client';

import Link from 'next/link';
import { useAuth } from '@/context/auth.context';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bem-vindo ao E-Commerce
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A melhor plataforma para comprar e vender produtos online. 
            {!isAuthenticated && ' Crie sua conta e comece hoje mesmo!'}
          </p>

          {!isAuthenticated ? (
            <div className="space-x-4">
              <Link href="/register" className="btn btn-primary text-lg px-8 py-3">
                Começar Agora
              </Link>
              <Link href="/products" className="btn btn-secondary text-lg px-8 py-3">
                Ver Produtos
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link 
                href={user?.role === 'SELLER' ? '/dashboard' : '/products'} 
                className="btn btn-primary text-lg px-8 py-3"
              >
                {user?.role === 'SELLER' ? 'Ir para Dashboard' : 'Ver Produtos'}
              </Link>
              <Link href="/account" className="btn btn-secondary text-lg px-8 py-3">
                Minha Conta
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="card text-center">
            <div className="text-3xl mb-4">🛒</div>
            <h3 className="text-lg font-semibold mb-2">Compre com Segurança</h3>
            <p className="text-gray-600">
              Milhares de produtos com garantia de qualidade e entrega rápida
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-4">🏪</div>
            <h3 className="text-lg font-semibold mb-2">Venda com Facilidade</h3>
            <p className="text-gray-600">
              Ferramentas completas para gerenciar sua loja e aumentar suas vendas
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-4">⭐</div>
            <h3 className="text-lg font-semibold mb-2">Experiência Completa</h3>
            <p className="text-gray-600">
              Carrinho, favoritos, histórico de pedidos e muito mais
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}