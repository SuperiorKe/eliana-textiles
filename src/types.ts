export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: "Duvets" | "Mattresses" | "Bed Sheets";
  price: number;
  description: string;
  image: string;
  images?: string[];
  reviews: Review[];
  attributes?: {
    material?: string;
    threadCount?: string;
    firmness?: string;
    weight?: string;
  };
}

export interface CartItem extends Omit<Product, 'reviews' | 'attributes'> {
  quantity: number;
}
