export interface Bundle {
  id: string;
  shopId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  originalPrice: number;
  discountedPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bundleProducts: BundleProduct[];
}

export interface BundleProduct {
  id: string;
  bundleId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBundleInput {
  title: string;
  description?: string;
  imageUrl?: string;
  originalPrice: number;
  discountedPrice: number;
  bundleProducts: {
    productId: string;
    quantity: number;
  }[];
}

export interface BundleResponse {
  success: boolean;
  data?: Bundle | Bundle[];
  error?: string;
} 