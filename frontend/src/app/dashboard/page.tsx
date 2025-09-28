'use client';

import React from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuth } from '@/context/auth.context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SELLER_STATS_QUERY = gql`
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
`;

interface SellerStatsData {
  sellerStats: {
    totalProducts: number;
    totalSold: number;
    revenue: number;
    bestSeller: {
      product: {
        id: string;
        name: string;
        price: number;
      };
      sales: number;
    } | null;
  };
}

// Removed redundant destructuring of useQuery

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const { data, loading, error } = useQuery<SellerStatsData>(SELLER_STATS_QUERY);

  if (user?.role !== 'SELLER') {
    router.push('/products');
    return null;
  }

  if (loading) return <div className="container mx-auto p-6 text-center">Carregando dashboard...</div>;
  if (error) return <div className="container mx-auto p-6 text-center text-red-500">Erro: {error.message}</div>;

  const stats = data?.sellerStats ?? {
    totalProducts: 0,
    totalSold: 0,
    revenue: 0,
    bestSeller: null,
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Produtos Cadastrados</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.totalProducts}</p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Vendido</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.totalSold}</p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Faturamento</h3>
          <p className="text-3xl font-bold text-primary-600">
            R$ {stats.revenue.toFixed(2)}
          </p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Produto Mais Vendido</h3>
          <p className="text-lg font-bold text-primary-600 truncate">
            {stats.bestSeller?.product.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-500">
            {stats.bestSeller?.sales || 0} vendas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/my-products"
          className="card hover:shadow-lg transition-shadow cursor-pointer block"
        >
          <h3 className="text-xl font-semibold mb-2">Gerenciar Produtos</h3>
          <p className="text-gray-600">Adicionar, editar ou remover produtos da sua loja</p>
        </Link>
        
        <Link
          href="/store-orders"
          className="card hover:shadow-lg transition-shadow cursor-pointer block"
        >
          <h3 className="text-xl font-semibold mb-2">Ver Pedidos</h3>
          <p className="text-gray-600">Acompanhar pedidos da sua loja</p>
        </Link>
      </div>
    </div>
  );
}