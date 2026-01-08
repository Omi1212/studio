
'use client';

import {
  Bell,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import WalletOptions from './wallet-options';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);

  // This function is for demonstration purposes to toggle the wallet state
  const toggleConnection = () => {
    setIsConnected(!isConnected);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell />
          <span className="sr-only">Notifications</span>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
             <Button 
              className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={!isConnected ? undefined : toggleConnection} // Toggle off when clicked if connected
            >
              {isConnected ? (
                <>
                  <Wallet className="h-6 w-6" />
                  <div className="w-px h-4 bg-white/50 mx-2" />
                  <img src="https://spark.satsterminal.com/xverse.svg" alt="Xverse logo" className="h-6 w-6" />
                  <span>spark1pg...92kjc</span>
                </>
              ) : (
                <>
                  <Wallet className="h-6 w-6" />
                  <div className="w-px h-4 bg-white/50 mx-2" />
                  <span>Connect Wallet</span>
                </>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Wallet options</SheetTitle>
            </SheetHeader>
            {/* Pass a function to WalletOptions to handle connection */}
            <WalletOptions onConnect={toggleConnection} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
