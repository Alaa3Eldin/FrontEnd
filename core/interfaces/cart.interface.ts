import { Product } from './product.interface';

export interface CartItem {
  product: Product | string;
  quantity: number;
  priceAtAddTime: number;
  currentPrice?: number;
  hasPriceChanged?: boolean;
}

export interface ICart {
  _id?: string;
  user?: string; 
  items: CartItem[];
  totalPrice: number;
  lastCheckedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
