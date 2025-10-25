import { Category } from "./category.interface";

export interface Product {
    _id?: string;
    name: string;
    slug?: string;
    description: string;
    images?: string[];
    price: number;
    discountPercentage?: number;
    finalPrice?: number;
    category: Category
    brand?: string;
    stock: number;
    tags?: string[];
    isFeatured?: boolean;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}