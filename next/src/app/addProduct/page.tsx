import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '../../../utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { addProduct } from './actions';

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <form>
      <label htmlFor="name">Name:</label>
      <input id="name" name="name" type="text" required />
      <label htmlFor="price">Preis:</label>
      <input id="price" step=".01" name="price" type="number" required />
      <button formAction={addProduct}>Speichern</button>
    </form>
  );
}
