'use client';

import { ProductList } from './productList';
import { Product } from '../../../../utils/types';

type ProductSection = {
  categoryName: string;
  color: 'lime' | 'blue' | 'rose' | 'amber';
  products: Product[];
  handleAddItem: (product: Product) => void;
};

export const ProductSection = ({
  categoryName,
  color,
  products,
  handleAddItem,
}: ProductSection) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xl">{categoryName}</p>
      <ProductList handleAddItem={handleAddItem} products={products} color={color} />
    </div>
  );
};
