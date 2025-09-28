export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'SELLER';
  storeName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  publishedDate: string;
  sellerId: string;
  seller?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  product: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentMethod: 'CREDIT_CARD' | 'PIX' | 'DEBIT_CARD' | 'BANK_SLIP' | 'PAYPAL';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  amount: number;
  createdAt: string;
  updatedAt: string;
}