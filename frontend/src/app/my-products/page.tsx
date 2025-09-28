'use client';

import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/auth.context';
import { useRouter } from 'next/navigation';

const MY_PRODUCTS_QUERY = gql`
  query MyProducts {
    myProducts {
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

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
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

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: String!, $input: CreateProductInput!) {
    updateProduct(id: $id, input: $input) {
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

const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export default function MyProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    stock: ''
  });

  interface MyProductsData {
    myProducts: {
      id: string;
      name: string;
      price: number;
      description: string;
      imageUrl: string;
      stock: number;
      isActive: boolean;
      createdAt: string;
    }[];
  }
  
  const { data, loading, error, refetch } = useQuery<MyProductsData>(MY_PRODUCTS_QUERY);

  const [createProduct] = useMutation(CREATE_PRODUCT_MUTATION, {
    onCompleted: () => {
      refetch();
      resetForm();
      setShowForm(false);
    }
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT_MUTATION, {
    onCompleted: () => {
      refetch();
      resetForm();
      setEditingProduct(null);
      setShowForm(false);
    }
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT_MUTATION, {
    onCompleted: () => refetch()
  });

  if (user?.role !== 'SELLER') {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        <p className="text-gray-600">Apenas vendedores podem acessar esta página.</p>
        <button 
          onClick={() => router.push('/products')}
          className="mt-4 btn btn-primary"
        >
          Ver Produtos
        </button>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      stock: ''
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.stock.toString()
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const input = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      imageUrl: formData.imageUrl,
      stock: parseInt(formData.stock)
    };

    if (editingProduct) {
      updateProduct({ variables: { id: editingProduct.id, input } });
    } else {
      createProduct({ variables: { input } });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct({ variables: { id } });
    }
  };

  if (loading) return <div className="container mx-auto p-6 text-center">Carregando produtos...</div>;
  if (error) return <div className="container mx-auto p-6 text-center text-red-500">Erro: {error.message}</div>;

  const products = data?.myProducts || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Produtos</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os seus produtos em um só lugar</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="btn btn-primary"
        >
          {showForm ? 'Cancelar' : 'Novo Produto'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Editar Produto' : 'Criar Novo Produto'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Ex: Smartphone Samsung"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input"
                  placeholder="Ex: 99.90"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estoque *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="input"
                  placeholder="Ex: 10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="input"
                  placeholder="Ex: https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input resize-none h-24"
                placeholder="Descreva o produto..."
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Seus Produtos ({products.length})</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Você ainda não tem produtos cadastrados.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Criar Primeiro Produto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-primary-600 font-bold text-xl mb-2">
                  R$ {product.price.toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Estoque: {product.stock}</span>
                  <span className={`px-2 py-1 rounded ${
                    product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 btn btn-secondary text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn bg-red-500 text-white hover:bg-red-600 text-sm"
                  >
                    Excluir
                  </button>
                </div>

                <div className="text-xs text-gray-400 mt-3">
                  Criado em: {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}