'use server';

import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '../../../utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { ProductList } from './Components/productList';

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.log(error);
    redirect('/login');
  }

  let { data: products, error: readTableError } = await supabase.from('products').select('*');

  return (
    <main className="w-full flex-1 flex-col justify-between">
      <ProductList products={products} />
    </main>
  );
}
