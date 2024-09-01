import Image from "next/image";
import { redirect } from 'next/navigation'
import { createClient } from '../../../utils/supabase/server'

export default async function Home() {

    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      redirect('/login');
    }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Show Existing Positions + Edit Them
      Add Position
    </main>
  );
}
