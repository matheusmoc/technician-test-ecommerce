'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/auth.context';
import Link from 'next/link';

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
        role
        isActive
        storeName
        createdAt
      }
    }
  }
`;

interface RegisterForm {
  email: string;
  password: string;
  name: string;
  role: 'CLIENT' | 'SELLER';
  storeName?: string;
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'SELLER'>('CLIENT');
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  
  const [registerMutation, { loading }] = useMutation<{ register: { token: string; user: { id: string; email: string; name: string; role: 'CLIENT' | 'SELLER'; isActive: boolean; storeName?: string; createdAt: string; } } }>(REGISTER_MUTATION, {
    onCompleted: (data) => {
      login(data.register.token, { ...data.register.user, updatedAt: new Date().toISOString() });
      router.push(data.register.user.role === 'SELLER' ? '/dashboard' : '/products');
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const onSubmit = (data: RegisterForm) => {
    setError('');
    const input = {
      ...data,
      role
    };
    
    registerMutation({
      variables: {
        input
      }
    });
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold text-center mb-6">Criar conta</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome completo
          </label>
          <input
            type="text"
            id="name"
            className="input mt-1"
            {...register('name', { required: 'Nome é obrigatório' })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="input mt-1"
            {...register('email', { 
              required: 'Email é obrigatório',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Email inválido'
              }
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            id="password"
            className="input mt-1"
            {...register('password', { 
              required: 'Senha é obrigatória',
              minLength: {
                value: 6,
                message: 'Senha deve ter pelo menos 6 caracteres'
              }
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de conta
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="CLIENT"
                checked={role === 'CLIENT'}
                onChange={(e) => setRole(e.target.value as 'CLIENT')}
                className="mr-2"
              />
              Cliente
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="SELLER"
                checked={role === 'SELLER'}
                onChange={(e) => setRole(e.target.value as 'SELLER')}
                className="mr-2"
              />
              Vendedor
            </label>
          </div>
        </div>
        
        {role === 'SELLER' && (
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
              Nome da loja
            </label>
            <input
              type="text"
              id="storeName"
              className="input mt-1"
              {...register('storeName', { required: 'Nome da loja é obrigatório para vendedores' })}
            />
            {errors.storeName && (
              <p className="text-red-500 text-sm mt-1">{errors.storeName.message}</p>
            )}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary disabled:opacity-50"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
      
      <p className="text-center mt-4 text-sm text-gray-600">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-primary-600 hover:text-primary-700">
          Entrar
        </Link>
      </p>
    </div>
  );
}