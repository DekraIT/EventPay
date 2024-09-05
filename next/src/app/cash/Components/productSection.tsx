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
    <div className="flex flex-col gap-4">
      <p className="text-xl font-medium md:text-2xl">{categoryName}</p>
      <ProductList handleAddItem={handleAddItem} products={products} color={color} />
    </div>
  );
};
