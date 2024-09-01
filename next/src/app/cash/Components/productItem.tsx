'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Cross1Icon } from '@radix-ui/react-icons';

type ProductItemProps = {
  name: string;
  price: number;
  handleClick: () => void;
};

export const ProductItem = ({ name, price, handleClick }: ProductItemProps) => (
  <div className="flex w-full flex-row flex-nowrap items-center justify-between">
    <Label>{name}</Label>
    <Label>{price}</Label>
    <Button
      onClick={handleClick}
      className="relative flex items-center justify-center"
      variant="outline"
      size="icon"
    >
      <Cross1Icon />
    </Button>
  </div>
);
