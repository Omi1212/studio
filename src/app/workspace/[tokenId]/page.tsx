
'use client';

import { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import TokenDetailsView from '@/components/workspace/token-details-view';
import { exampleTokens } from '@/lib/data';
import type { TokenDetails } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function TokenDetailsComponent({ params }: { params: { tokenId: string } }) {
  const [token, setToken] = useState<TokenDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { tokenId } = params;
    
    const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    const allTokens: TokenDetails[] = [...exampleTokens, ...storedTokens].map(t => ({
      ...t,
      decimals: t.decimals ?? 0,
      isFreezable: t.isFreezable ?? false,
      publicKey: t.publicKey ?? `02f...${t.id.slice(-10)}`,
    }));

    const foundToken = allTokens.find(t => t.id === tokenId);
    
    if (foundToken) {
      setToken(foundToken);
    }
    
    setLoading(false);
  }, [params]);

  if (loading) {
    return (
      <SidebarProvider>
        <Sidebar className="border-r">
          <SidebarNav />
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col min-h-dvh">
            <HeaderDynamic />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
              <p>Loading token details...</p>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!token) {
    notFound();
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <a href="/workspace"><ArrowLeft /></a>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Token Details
                </h1>
            </div>
            <div className="max-w-4xl mx-auto">
             <TokenDetailsView token={token} />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function TokenDetailsPage({ params }: { params: Promise<{ tokenId: string }> }) {
  const resolvedParams = use(params);
  return <TokenDetailsComponent params={resolvedParams} />;
}
