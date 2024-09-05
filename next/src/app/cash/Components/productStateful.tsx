'use client';

import { Button } from '@/components/ui/button';
import { ProductSection } from './productSection';
import { Product, ProductCategory } from '../../../../utils/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isNumber } from '../../../../utils/typeChecks';
import { createClient } from '../../../../utils/supabase/client';
import { Database } from '../../../../database.types';
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { MinusIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { SideMenu } from '@/components/sideMenu';
import { ScrollArea } from '@/components/ui/scroll-area';

type ProductStatefulProps = {
  productCategories: ProductCategory[];
  products: Product[];
};

export const ProductStateful = ({ productCategories, products }: ProductStatefulProps) => {
  const [selectedItems, setSelectedItems] = useState<(Product & { amount: number })[]>([]);

  const supabase = createClient();

  const addSelectedItem = useCallback((product: Product) => {
    setSelectedItems((currentItems) => {
      const matchingSelectedItem = currentItems.find((item) => item.id === product.id);

      if (!matchingSelectedItem) {
        return [...currentItems, { ...product, amount: 1 }];
      }

      return currentItems.map((item) => {
        if (item.id !== product.id) {
          return item;
        }

        return { ...item, amount: item.amount + 1 };
      });
    });
  }, []);

  const price = useMemo(
    () => selectedItems.reduce((acc, { price, amount }) => acc + price * amount, 0),
    [selectedItems],
  );

  const formSchema = z.object({
    payment: z.coerce.number().min(price).max(Infinity).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const formPaymentValue = useMemo(() => {
    const formValue = form.getValues('payment');

    if (isNumber(formValue)) {
      return formValue;
    }

    return 0;
  }, [form.formState.isValidating]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { data, error } = await supabase
      .from('sales')
      .insert({ payed_money: values.payment ? values.payment - price : 0 })
      .select();

    if (!data || error) {
      form.setValue('payment', undefined, { shouldValidate: true });
      setSelectedItems([]);
      return;
    }

    for (const item of selectedItems) {
      await supabase
        .from('product_sales')
        .insert({ product_category_id: item.category, product_id: item.id, sales_id: data[0].id });
    }

    form.setValue('payment', undefined, { shouldValidate: true });
    setSelectedItems([]);
  }

  return (
    <>
      <header className="border-grey sticky top-0 flex w-full items-center justify-between border-b p-4 text-center">
        <Label className="text-2xl font-bold md:text-3xl">Summe: {price} €</Label>
        <SideMenu />
      </header>

      <main className="flex flex-1 flex-col gap-8 overflow-y-scroll p-4">
        {productCategories?.map(({ name, id, color }) => (
          <ProductSection
            key={id}
            categoryName={name}
            products={products.filter((product) => product.category === id) ?? []}
            color={color}
            handleAddItem={addSelectedItem}
          />
        ))}
      </main>

      <div className="sticky bottom-0 flex w-full flex-row items-center justify-between gap-4 p-4">
        <Button onClick={() => setSelectedItems([])} variant="destructive">
          Zurüksetzen
        </Button>
        <Drawer
          onClose={() => {
            form.setValue('payment', undefined, { shouldValidate: true });
          }}
        >
          <DrawerTrigger className="item-center flex-1 bg-foreground" asChild>
            <Button disabled={selectedItems.length === 0} className="item-center flex-1 shrink-0">
              Kassieren
            </Button>
          </DrawerTrigger>

          <DrawerContent className="flex flex-col">
            <DrawerHeader>
              <DrawerTitle className="font-bold md:text-2xl">Wechselgeld berechnen</DrawerTitle>
            </DrawerHeader>

            <ScrollArea className="mt-4 max-h-[20vh] w-full overflow-auto md:max-h-[50vh]">
              <div className="flex w-full flex-col px-4">
                {selectedItems.map((item, itemIndex) => (
                  <div key={item.id}>
                    <div className="grid grid-cols-2 items-center gap-2 md:flex md:flex-row md:justify-between">
                      <Label className="text-md hyphens-auto break-words font-medium md:text-xl">
                        {`${item.name} ${item.name_suffix || ''}`}
                      </Label>

                      <div className="flex flex-row items-center gap-4">
                        <div className="w-100 flex flex-row md:w-auto">
                          <Button
                            onClick={() => {
                              setSelectedItems((currentItems) =>
                                currentItems.reduce(
                                  (accCurrentItems, currentItem) => {
                                    if (currentItem.id === item.id) {
                                      if (currentItem.amount === 1) {
                                        return accCurrentItems;
                                      }

                                      return [
                                        ...accCurrentItems,
                                        { ...currentItem, amount: currentItem.amount - 1 },
                                      ];
                                    }

                                    return [...accCurrentItems, currentItem];
                                  },
                                  [] as (Product & { amount: number })[],
                                ),
                              );
                            }}
                            size="icon"
                          >
                            <MinusIcon />
                          </Button>

                          <div className="flex items-center justify-center md:min-w-16 md:min-w-24">
                            <Label className="text-md px-4 font-medium md:text-xl">
                              <span className="hidden md:inline">x </span>
                              {item.amount}
                            </Label>
                          </div>

                          <Button
                            onClick={() => {
                              setSelectedItems((currentItems) =>
                                currentItems.map((currentItem) => {
                                  if (currentItem.id === item.id) {
                                    return { ...currentItem, amount: currentItem.amount + 1 };
                                  }

                                  return currentItem;
                                }),
                              );
                            }}
                            size="icon"
                          >
                            <PlusIcon />
                          </Button>
                        </div>

                        <div className="grow text-right md:min-w-32">
                          <Label className="text-md font-medium md:text-xl">
                            <span className="hidden md:inline">Preis: </span>
                            {item.price * item.amount} €
                          </Label>
                        </div>
                      </div>
                    </div>
                    <Separator
                      className={'my-4 ' + (itemIndex === selectedItems.length - 1 ? 'hidden' : '')}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-8 flex w-full flex-col gap-2 px-4 md:w-1/2 md:self-end">
              <div className="flex flex-row items-center justify-between gap-4">
                <Label className="text-md self-end font-medium md:text-2xl">Summe:</Label>
                <Label className="text-md self-end font-medium md:text-2xl">{price} €</Label>
              </div>
              <div className="flex flex-row items-center justify-between">
                <Label className="text-md self-end font-medium md:text-2xl">Erhalten:</Label>
                <Label className="text-md self-end font-medium md:text-2xl">
                  {formPaymentValue} €
                </Label>
              </div>
              <Separator />
              <div className="flex flex-row items-center justify-between gap-4">
                <Label className="self-end text-xl font-bold md:text-2xl">
                  {formPaymentValue - price > 0 ? 'Rückgeld:' : 'Noch zu zahlen:'}
                </Label>
                <Label className="self-end text-xl font-bold md:text-2xl">
                  {(Math.round(Math.abs(formPaymentValue - price) * 100) / 100).toFixed(2)} €
                </Label>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4">
                <FormField
                  control={form.control}
                  name="payment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="hidden">Betrag Erhalten</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={0.1}
                          inputMode="decimal" // This will bring up the numeric keyboard with a comma key
                          pattern="^\d+([.,]\d{1,2})?$" // Allow numbers with optional comma or period
                          {...field}
                          onChange={(event) => {
                            form.setValue('payment', Number(event.currentTarget.value), {
                              shouldValidate: true,
                            });
                          }}
                          defaultValue={0}
                          disabled
                          className="hidden"
                        />
                      </FormControl>
                      <FormMessage className="hidden" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-4 gap-4">
                  <Button
                    onClick={() => {
                      form.setValue('payment', undefined, { shouldValidate: true });
                      form.setValue('payment', 0, { shouldValidate: false });
                    }}
                    size="lg"
                    type="button"
                    variant="destructive"
                    className="col-start-1 col-end-3"
                  >
                    Zurücksetzen
                  </Button>

                  <Button
                    onClick={() => form.setValue('payment', price, { shouldValidate: true })}
                    size="lg"
                    type="button"
                    className="col-start-3 col-end-5"
                  >
                    Passend
                  </Button>

                  {[50, 20, 10, 5, 2, 1, 0.5, 0.1].map((sum: number, index) => (
                    <Button
                      key={index}
                      onClick={() =>
                        form.setValue(
                          'payment',
                          Number((Math.round((formPaymentValue + sum) * 100) / 100).toFixed(2)),
                          { shouldValidate: true },
                        )
                      }
                      size="lg"
                      type="button"
                    >
                      + {sum} €
                    </Button>
                  ))}
                </div>

                <DrawerFooter className="flex flex-row items-center justify-between gap-4 px-0">
                  <DrawerClose className="flex-1">
                    <Button type="button" className="w-full" variant="outline" size="lg">
                      Abbrechen
                    </Button>
                  </DrawerClose>

                  <DrawerClose disabled={formPaymentValue - price < 0} className="flex-1">
                    <Button
                      disabled={formPaymentValue - price < 0}
                      type="submit"
                      className="w-full"
                      size="lg"
                    >
                      Quittieren
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </Form>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};
