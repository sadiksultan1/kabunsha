export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  category: 'Baby' | 'Kids' | 'Accessories';
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'cash_pending';
  method: 'paypal' | 'cod';
  date: Date;
}

export enum ViewState {
  HOME = 'HOME',
  SHOP = 'SHOP',
  CART = 'CART',
  ABOUT = 'ABOUT',
  LOGIN = 'LOGIN'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}