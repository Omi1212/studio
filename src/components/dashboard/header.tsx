
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


const SparkIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-black text-white rounded-md p-1">
        <path d="M9.35156 8.28125L12 12M12 12L14.6484 15.7188M12 12L9.42969 15.7188M12 12L14.7266 8.28125" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18.3984 5.03906L15.2734 3.96094L12 7.67188L8.72656 3.96094L5.60156 5.03906L8.80469 8.82812L6.15625 12.3281L7.64062 14.9219L10.5 12.8906L12.0781 18.0234H11.9219L13.5 12.8906L16.3594 14.9219L17.8438 12.3281L15.1953 8.82812L18.3984 5.03906Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

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
                  <Wallet className="h-4 w-4" />
                  <div className="w-px h-4 bg-white/50 mx-2" />
                  <SparkIcon />
                  <span>spark1pg...92kjc</span>
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
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
