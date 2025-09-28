'use client';

import React, { useState } from 'react';
import { gql } from '@apollo/client'; 
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/auth.context';
import { Product } from '../../types/graphql';
import Image from 'next/image';

const PRODUCTS_QUERY = gql`
  query Products($filter: ProductsFilterInput) {
    products(filter: $filter) {
      id
      name
      price
      description
      imageUrl
      stock
      isActive
      seller {
        name
        storeName
      }
      createdAt
    }
  }
`;

const TOGGLE_FAVORITE_MUTATION = gql`
  mutation ToggleFavorite($productId: String!) {
    toggleFavorite(productId: $productId)
  }
`;

const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($productId: String!) {
    addToCart(productId: $productId) {
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
`;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function ProductsPage() {
  const { isAuthenticated, user } = useAuth();
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { data, loading, error, refetch } = useQuery<{ products: Product[] }>(PRODUCTS_QUERY, {
    variables: {
      filter: {
        search: search || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      }
    }
  });

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_MUTATION, {
    onCompleted: () => {
      refetch();
    }
  });

  const [addToCart] = useMutation(ADD_TO_CART_MUTATION, {
    onCompleted: () => {
      alert('Produto adicionado ao carrinho!');
    },
    onError: (error) => {
      alert('Erro ao adicionar ao carrinho: ' + error.message);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleAddToCart = (productId: string) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para adicionar itens ao carrinho');
      return;
    }
    addToCart({ variables: { productId } });
  };

  const handleToggleFavorite = (productId: string) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para favoritar produtos');
      return;
    }
    toggleFavorite({ variables: { productId } });
  };

  if (loading) return <div className="text-center">Carregando produtos...</div>;
  if (error) return <div className="text-center text-red-500">Erro: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        
        {user?.role === 'SELLER' && (
          <a
            href="/my-products"
            className="btn btn-primary"
          >
            Meus Produtos
          </a>
        )}
      </div>

      <form onSubmit={handleSearch} className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Buscar</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input mt-1"
              placeholder="Nome do produto..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço mínimo</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="input mt-1"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço máximo</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input mt-1"
              placeholder="999.99"
              step="0.01"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn btn-primary w-full">
              Filtrar
            </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.products.map((product: Product) => (
          <div key={product.id} className="card hover:shadow-lg transition-shadow">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={300}
              height={192}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-2xl font-bold text-primary-600">
                R$ {product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                Estoque: {product.stock}
              </span>
            </div>
            
            <div className="text-sm text-gray-500 mb-3">
              Vendido por: {product.seller?.storeName || product.seller?.name}
            </div>

            <div className="flex space-x-2">
              {user?.role === 'CLIENT' && (
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock === 0}
                  className="flex-1 btn btn-primary disabled:opacity-50"
                >
                  {product.stock === 0 ? 'Sem estoque' : 'Adicionar'}
                </button>
              )}
              
              {isAuthenticated && (
                <button
                  onClick={() => handleToggleFavorite(product.id)}
                  className="btn btn-secondary"
                  title="Favoritar"
                >
                  ♡
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {data?.products.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Nenhum produto encontrado
        </div>
      )}
    </div>
  );
}