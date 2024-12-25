import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/products/ProductDetail';

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <ProductDetail productId={id} />
    </div>
  );
};

export default ProductEditPage;