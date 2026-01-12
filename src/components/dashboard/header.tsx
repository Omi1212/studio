
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
import { useState, useEffect } from 'react';
import NavUser from './nav-user';

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    setIsClient(true);
    const storedConnection = localStorage.getItem('isWalletConnected');
    if (storedConnection === 'true') {
      setIsConnected(true);
    }
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleConnect = () => {
    localStorage.setItem('isWalletConnected', 'true');
    setIsConnected(true);
  };
  
  const handleDisconnect = () => {
    localStorage.removeItem('isWalletConnected');
    setIsConnected(false);
  };

  const formatRole = (role: string | null) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell />
          <span className="sr-only">Notifications</span>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
             <Button 
              className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isConnected ? (
                <>
                  <Wallet className="h-5 w-5" />
                  <span className="hidden lg:inline">spark1pg...92kjc</span>
                </>
              ) : (
                <>
                  <Wallet className="h-5 w-5" />
                  <span className="hidden lg:inline">Connect Wallet</span>
                </>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{isConnected ? 'Wallet' : 'Wallet options'}</SheetTitle>
            </SheetHeader>
            <WalletOptions 
              isConnected={isConnected} 
              onConnect={handleConnect} 
              onDisconnect={handleDisconnect} 
            />
          </SheetContent>
        </Sheet>
        
        <div className="w-px h-6 bg-border" />

        {isClient && userRole && (
          <span className="hidden lg:inline-flex text-sm font-medium text-muted-foreground">{formatRole(userRole)}</span>
        )}
        
        <NavUser />

      </div>
    </header>
  );
}
