import { Inter } from 'next/font/google';
import { Providers } from './providers';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'E-Commerce',
  description: 'Sistema de e-commerce completo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <script src="https://cdn.tailwindcss.com"></script>
          {children}
        </Providers>
      </body>
    </html>
  );
}