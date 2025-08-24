export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  savings: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  featured?: boolean;
  howToUse?: string;
  benefits?: string[];
  ingredients?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
