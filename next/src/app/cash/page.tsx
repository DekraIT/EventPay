'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../../utils/supabase/server';
import { ProductStateful } from './Components/productStateful';
import { Product, ProductCategory } from '../../../utils/types';
import { SideMenu } from '@/components/sideMenu';

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  let { data: productCategories, error: productCategoriesReadTableError } = await supabase
    .from('product_categories')
    .select('*');

  let { data: products, error: productsReadTableError } = await supabase
    .from('products')
    .select('*');

  if (productCategoriesReadTableError || productsReadTableError) {
    redirect('/error');
  }

  return (
    <ProductStateful
      products={products as Product[]}
      productCategories={productCategories as ProductCategory[]}
    />
  );
}
