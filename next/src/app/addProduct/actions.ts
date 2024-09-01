'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from "../../../utils/supabase/server";

export async function addProduct(formData: FormData) {
    const supabase = createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const typedFormData = {
        name: formData.get('name'),
        price: formData.get('price'),
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
        console.log("not logged in")
        console.log(userError)
    }

    const { data, error } = await supabase
        .from('products')
        .insert([
            { name: typedFormData.name, price: typedFormData.price },
        ])


    if (error) {
        console.log(error)
        redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/admin');
}