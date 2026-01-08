
'use client';

import {
  Bell,
  PlusCircle,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';


export default function Header() {

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <Button className="hidden sm:inline-flex bg-primary text-primary-foreground">
        <PlusCircle />
        Create Payment
      </Button>
      <Button size="icon" variant="ghost" className="sm:hidden">
        <PlusCircle />
      </Button>

      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button className="hidden sm:inline-flex bg-primary text-primary-foreground">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
        </Button>
      </div>
    </header>
  );
}
