'use server';

import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '../../../utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { ProductList } from './Components/productList';
import { ProductSection } from './Components/productSection';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.log(error);
    redirect('/login');
  }

  let { data: productCategories, error: productCategoriesReadTableError } = await supabase
    .from('product_categories')
    .select('*');

  let { data: products, error: productsReadTableError } = await supabase
    .from('products')
    .select('*');

  return (
    <>
      <main className="flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
        {productCategories?.map(({ name, id, color }) => (
          <ProductSection
            key={id}
            categoryName={name as string}
            products={products?.filter((product) => product.category === id) ?? []}
            color={color as 'lime' | 'blue' | 'rose' | 'amber'}
          />
        ))}
      </main>

      <div className="sticky bottom-0 flex w-full flex-row items-center justify-between gap-4 p-4">
        <Button className="item-center flex-1 shrink-0">Bestellung: {0} €</Button>
        <Button className="item-center flex-1 shrink-0">Bezahlen</Button>
      </div>
    </>
  );
}
