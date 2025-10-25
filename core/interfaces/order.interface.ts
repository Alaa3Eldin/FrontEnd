// src/app/models/order.model.ts

import { Product } from "./product.interface";
import { IAddress, IUser } from "./user.interface";

export interface OrderItem {
    product: Product; 
    name: string;
    quantity: number;
    priceAtOrderTime: number;
}

export interface IOrder {
    _id?: string;
    user?: IUser;
    items: OrderItem[];
    shippingAddress: IAddress;
    totalPrice: number;
    status:
    | 'pending'
    | 'prepared'
    | 'shipped'
    | 'received'
    | 'rejected'
    | 'canceled_by_user'
    | 'canceled_by_admin';
    statusHistory?: {
        status: string;
        changedAt: string;
        changedBy: string;
    }[];
    paymentMethod: 'cash_on_delivery';
    isPaid?: boolean;
    paidAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    createdAt?: string;
    updatedAt?: string;
}
