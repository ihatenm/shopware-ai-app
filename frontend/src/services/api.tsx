import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // or your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  // Get all products
  getProducts: async () => {
    try {
      const response = await api.get('/shopware/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (id: string) => {
    try {
      const response = await api.get(`/shopware/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }
};