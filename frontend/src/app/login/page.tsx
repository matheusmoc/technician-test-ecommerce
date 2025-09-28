'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/auth.context';
import Link from 'next/link';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
        role
        isActive
        storeName
        createdAt
        updatedAt
      }
    }
  }
`;

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  
  // Garante que só executa no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  interface LoginMutationResult {
    login: {
      token: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
        isActive: boolean;
        storeName: string | null;
        createdAt: string;
        updatedAt: string;
      };
    };
  }
  
  const [loginMutation, { loading }] = useMutation<LoginMutationResult>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      login(data.login.token, { 
        ...data.login.user, 
        storeName: data.login.user.storeName ?? undefined, 
        role: data.login.user.role as "CLIENT" | "SELLER" 
      });
      router.push(data.login.user.role === 'SELLER' ? '/dashboard' : '/products');
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const onSubmit = (data: LoginForm) => {
    setError('');
    loginMutation({
      variables: {
        input: data
      }
    });
  };

  if (!isClient) {
    return (
      <div className="max-w-md mx-auto card">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold text-center mb-6">Entrar na conta</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      
      <p className="text-center mt-4 text-sm text-gray-600">
        Não tem uma conta?{' '}
        <Link href="/register" className="text-primary-600 hover:text-primary-700">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}