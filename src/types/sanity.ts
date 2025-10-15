import { Image } from 'sanity';

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}
export interface SanityCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SanitySubcategory {
  _id: string;
  name: string;
  slug: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
}

export interface SanityProduct {
  rating: number;
  reviews: number;
  is_new: boolean;
  _id: string;
  name: string;
  price: number;
  original_price?: number;
  images?: Image[];
  description?: string;
  detailed_description?: string;
  colors?: string[];
  is_featured?: boolean;
  is_ceo_chair?: boolean;
  is_molded?: boolean;
  is_gaming_chair?: boolean;
  is_dining_chair?: boolean;
  is_visitor_sofa?: boolean;
  is_study_chair?: boolean;
  is_outdoor_furniture?: boolean;
  is_folding_furniture?: boolean;
  show_in_office?: boolean;
  created_at?: string;

  category?: {
    _id: string;
    name: string;
    slug: string;
  };

  subcategory?: {
    _id: string;
    name: string;
    slug: string;
  };

  slug: string;
}
