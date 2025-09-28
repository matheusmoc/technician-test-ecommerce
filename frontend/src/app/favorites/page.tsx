'use client';

import React from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/auth.context';
import Link from 'next/link';

const FAVORITES_QUERY = gql`
  query Favorites {
    favorites {
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
`;

const TOGGLE_FAVORITE_MUTATION = gql`
  mutation ToggleFavorite($productId: String!) {
    toggleFavorite(productId: $productId)
  }
`;

export default function FavoritesPage() {
  const { user } = useAuth();
  interface FavoritesQueryResult {
    favorites: {
      id: string;
      name: string;
      price: number;
      description: string;
      imageUrl: string;
      stock: number;
      seller: {
        name: string;
        storeName: string;
      };
    }[];
  }
  
  const { data, loading, error, refetch } = useQuery<FavoritesQueryResult>(FAVORITES_QUERY);

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_MUTATION, {
    onCompleted: () => refetch()
  });

  const handleRemoveFavorite = (productId: string) => {
    toggleFavorite({ variables: { productId } });
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Favoritos</h1>
        <p className="text-gray-600">Você precisa estar logado para ver seus favoritos.</p>
      </div>
    );
  }

  if (loading) return <div className="container mx-auto p-6 text-center">Carregando favoritos...</div>;
  if (error) return <div className="container mx-auto p-6 text-center text-red-500">Erro: {error.message}</div>;

  const favorites = data?.favorites || [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Meus Favoritos</h1>

      {favorites.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-600 mb-4">Você ainda não tem produtos favoritos.</p>
          <Link href="/products" className="btn btn-primary">
            Explorar Produtos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product: any) => (
            <div key={product.id} className="card hover:shadow-lg transition-shadow">
              <img
                src={product.imageUrl}
                alt={product.name}
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
                <Link
                  href="/products"
                  className="flex-1 btn btn-primary text-center"
                >
                  Ver Produto
                </Link>
                <button
                  onClick={() => handleRemoveFavorite(product.id)}
                  className="btn btn-secondary"
                  title="Remover dos favoritos"
                >
                  ♥
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}