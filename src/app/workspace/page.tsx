'use client';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { useEffect, useState } from 'react';
import type { TokenDetails } from '@/lib/types';
import { exampleTokens } from '@/lib/data';
import { Rocket } from 'lucide-react';
import TokenDetailsView from '@/components/workspace/token-details-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WorkspacePage() {
  const [selectedToken, setSelectedToken] = useState<TokenDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleTokenChange = () => {
        const storedTokenId = localStorage.getItem('selectedTokenId');
        if (storedTokenId) {
            const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
            const allTokens: TokenDetails[] = [...exampleTokens, ...storedTokens].map(t => ({
                ...t,
                decimals: t.decimals ?? 0,
                isFreezable: t.isFreezable ?? false,
                publicKey: t.publicKey ?? `02f...${t.id.slice(-10)}`,
            }));
            const foundToken = allTokens.find(t => t.id === storedTokenId);
            setSelectedToken(foundToken || null);
        } else {
            setSelectedToken(null);
        }
        setLoading(false);
    };

    handleTokenChange();
    window.addEventListener('tokenChanged', handleTokenChange);

    return () => {
        window.removeEventListener('tokenChanged', handleTokenChange);
    };
  }, []);

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <h1 className="text-3xl font-headline font-semibold">Workspace</h1>
            
            {loading ? (
                <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center">
                   <p className="text-muted-foreground">Loading token details...</p>
                </div>
            ) : selectedToken ? (
               <TokenDetailsView token={selectedToken} view="workspace" />
            ) : (
              <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
                  <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No token selected or found</h2>
                  <p className="text-muted-foreground mb-4">Get started by launching your first token from the Launchpad.</p>
                  <Button asChild>
                    <Link href="/issue-token">Go to Launchpad</Link>
                  </Button>
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
