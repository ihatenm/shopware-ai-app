export interface Product {
    id: string;
    shopwareId: string;
    title: string;
    description: string;
    price: number;
    categories: string[];
    tags: string[];
    images: string[];
    status: 'active' | 'draft' | 'archived';
    aiSuggestions?: {
      title?: string;
      description?: string;
      tags?: string[];
    };
    updatedAt: string;
  }