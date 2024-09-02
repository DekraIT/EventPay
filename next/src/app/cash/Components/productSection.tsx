'use client';

import { useEffect, useState } from 'react';
import { ProductList } from './productList';
import { createClient } from '../../../../utils/supabase/client';

type ProductSection = {
  categoryName: string;
  color: 'lime' | 'blue' | 'rose' | 'amber';
  products: { id: number; name: string; price: number }[];
};

export const ProductSection = ({ categoryName, color, products }: ProductSection) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xl">{categoryName}</p>
      <ProductList products={products} color={color} />
    </div>
  );
};
