export interface Category {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string | File;
  parentCategory?: string | Category | null;
  subcategories?: Category[];
  products?: { name: string; price: number; isFeatured: boolean }[];
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
