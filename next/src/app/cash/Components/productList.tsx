'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Product } from '../../../../utils/types';

type ProductListProps = {
  color: 'lime' | 'blue' | 'rose' | 'amber';
  products: Product[];
  handleAddItem: (product: Product) => void;
};

export const ProductList = ({ color, products, handleAddItem }: ProductListProps) => {
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
                onClick={() => handleAddItem(product)}
                className={
                  'flex h-full w-full flex-col justify-between hyphens-auto break-words border-0 p-1 ' +
                  colors[color]
                }
              >
                <p className="text-wrap">{product.name}</p>
                <p className="self-bottom">{Number(product.price).toFixed(2)} €</p>
              </Button>
            </div>
          ))}
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
