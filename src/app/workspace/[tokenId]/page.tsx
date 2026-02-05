
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
import type { TokenDetails, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function TokenDetailsComponent({ params }: { params: { tokenId: string } }) {
  const [token, setToken] = useState<TokenDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<User['role'] | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole') as User['role'] | null;
    setUserRole(role);
    setLoading(true);

    const { tokenId } = params;
    
    fetch(`/api/tokens/${tokenId}`)
      .then(res => {
        if(res.ok) return res.json();
        throw new Error('Token not found');
      })
      .then((tokenData: TokenDetails) => {
        setToken({
          ...tokenData,
          decimals: tokenData.decimals ?? 0,
          isFreezable: tokenData.isFreezable ?? false,
          publicKey: tokenData.publicKey ?? `02f...${tokenData.id.slice(-10)}`,
        });
      })
      .catch(err => {
        console.error(err);
        setToken(null);
      })
      .finally(() => setLoading(false));

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
                    <Link href="/workspace"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Token Details
                </h1>
            </div>
            <div className="max-w-4xl mx-auto">
             <TokenDetailsView token={token} view="workspace" userRole={userRole} />
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
