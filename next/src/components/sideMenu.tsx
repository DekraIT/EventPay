import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { ModeToggle } from './modeToggle';
import Link from 'next/link';

export function SideMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col">
          <Separator className="mt-4" />
          <SheetClose asChild>
            <Link className="py-4" href="/cash">
              Kassieren
            </Link>
          </SheetClose>
          <Separator />
          <SheetClose asChild>
            <Link className="py-4" href="/addProduct">
              Produkte konfigurieren
            </Link>
          </SheetClose>
          <Separator className="mb-4" />
        </div>
        <ModeToggle />
      </SheetContent>
    </Sheet>
  );
}
