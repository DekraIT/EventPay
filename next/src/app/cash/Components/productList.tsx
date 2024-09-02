'use client';

import { useState } from 'react';
import { ProductItem } from './productItem';
import { Button } from '@/components/ui/button';

export const ProductList = ({
  color,
  products,
}: {
  products: any[] | null;
  color: 'lime' | 'blue' | 'rose' | 'amber';
}) => {
  const [selection, setSelection] = useState<{ name: string; price: number; amount: number }[]>([]);
  const [state, setState] = useState<'order' | 'pay'>('order');
  const [money, setMoney] = useState(0);

  const colors = {
    lime: 'bg-lime-400/20 hover:bg-lime-400/50',
    blue: 'bg-blue-400/20 hover:bg-blue-400/50',
    rose: 'bg-rose-400/20 hover:bg-rose-400/50',
    amber: 'bg-amber-400/20 hover:bg-amber-400/50',
  };

  const price = selection.reduce((acc, curr) => {
    return acc + curr.price;
  }, 0);

  if (!products) {
    return null;
  }

  if (state === 'order') {
    return (
      <div className="w-full flex-1 flex-col">
        <div className="grid grid-cols-3 gap-6">
          {products?.map((product) => (
            <div key={product.id} className="aspect-square w-full">
              <Button
                variant="ghost"
                onClick={() =>
                  setSelection((current) => {
                    // TODO: change state, so amount of a product is shown instead of the product twice

                    return [
                      ...current,
                      { name: product.name as string, price: product.price as number, amount: 1 },
                    ];
                  })
                }
                className={'flex h-full w-full flex-col justify-between border-0 ' + colors[color]}
              >
                <p className="text-wrap">{product.name}</p>
                <p className="self-bottom">{Number(product.price).toFixed(2)} €</p>
              </Button>
            </div>
          ))}
        </div>

        {/* <ScrollArea className="h-52 w-full rounded-md border">
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
        </ScrollArea> */}
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
