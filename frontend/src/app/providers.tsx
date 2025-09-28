'use client';

import { ApolloProvider } from '@apollo/client/react';
import { client } from '@/lib/apollo-client';
import { AuthProvider } from '@/context/auth.context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ApolloProvider>
  );
}