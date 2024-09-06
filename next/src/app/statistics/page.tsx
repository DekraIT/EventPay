import { ChartConfig } from '@/components/ui/chart';
import { redirect } from 'next/navigation';
import { createClient } from '../../../utils/supabase/server';
import { SalesPerHourCard } from './Components/salesPerHourCard';
import { ProductSales } from './Components/productSales';

export const description = 'A bar chart';

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default async function Statistics() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  const { data: dataQuery, error: errorQuery } = await supabase.rpc('get_sales');
  if (error) {
    console.error('Error calling sales_per_hour:', errorQuery);
  } else {
    console.log('Sales per hour:', dataQuery);
  }

  const passData = (dataQuery as { interval_start: Date; sales_count: number }[]).map((data) => ({
    interval_start: new Date(data.interval_start),
    sales_count: data.sales_count,
  }));

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name');

  const productSales = await Promise.all(
    products?.map(async (product) => {
      const { data, count } = await supabase
        .from('product_sales')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', product.id);

      return { name: product.name as string, count: count ?? 0 };
    }) ?? [],
  );

  return (
    <>
      <ProductSales productSales={productSales} />
      <SalesPerHourCard chartData={passData} />
    </>
  );
}
