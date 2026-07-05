export interface ProductListItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryName: string;
  stock: number;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: number;
  categoryName: string;
}

export interface ProductQueryParams {
  search?: string;
  categoryId?: number;
  sortBy?: 'price' | 'name';
  descending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: number;
}
