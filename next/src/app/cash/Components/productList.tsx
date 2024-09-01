'use client';

import { useState } from 'react';
import { ProductItem } from './productItem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ProductList = ({ products }: { products: any[] | null }) => {
  const [selection, setSelection] = useState<{ name: string; price: number }[]>([]);
  const [state, setState] = useState<'order' | 'pay'>('order');
  const [money, setMoney] = useState(0);

  const price = selection.reduce((acc, curr) => {
    return acc + curr.price;
  }, 0);

  if (!products) {
    return null;
  }

  if (state === 'order') {
    return (
      <div className="w-full flex-1 flex-col">
        <div>
          <p>Auswahl:</p>
          {products?.map((product) => (
            <button
              onClick={() =>
                setSelection((current) => [
                  ...current,
                  { name: product.name as string, price: product.price as number },
                ])
              }
              className="border-2 border-white"
            >
              <p>{product.name}</p>
              <p>{product.price}</p>
            </button>
          ))}
        </div>

        <ScrollArea className="h-52 w-full rounded-md border">
          <div>
            {selection.map((product, index) => (
              <ProductItem
                key={index}
                name={product.name}
                price={product.price}
                handleClick={() =>
                  setSelection((current) =>
                    current.filter((_, filterIndex) => index !== filterIndex),
                  )
                }
              />
            ))}
          </div>
        </ScrollArea>

        <div className="absolute bottom-4 left-4 right-4 flex flex-row items-center justify-between">
          <p>Summe: {price}€</p>
          <Button onClick={() => setState('pay')}>Bezahlen</Button>
        </div>
      </div>
    );
  }

  if (state === 'pay') {
    return (
      <div>
        <p>Zu bezahlen: {price}</p>

        <p>erhalten: </p>
        <input
          onChange={(event) => setMoney(Number(event.currentTarget.value))}
          id="got"
          step=".01"
          name="got"
          type="number"
          required
        />

        <p>
          zurück: {money === 0 ? <span>Zuerst erhaltenen Betrag eingeben!</span> : money - price}
        </p>

        <button
          className="absolute bottom-5"
          onClick={() => {
            setState('order');
            setSelection([]);
            setMoney(0);
          }}
        >
          Fertig
        </button>
      </div>
    );
  }
};
