
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
import AssetDetailsView from '@/components/workspace/token-details-view';
import type { AssetDetails, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function AssetDetailsComponent({ params }: { params: { assetId: string } }) {
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<User['role'] | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole') as User['role'] | null;
    setUserRole(role);
    setLoading(true);

    const { assetId } = params;
    
    fetch(`/api/assets/${assetId}`)
      .then(res => {
        if(res.ok) return res.json();
        throw new Error('Asset not found');
      })
      .then((assetData: AssetDetails) => {
        setAsset({
          ...assetData,
          network: Array.isArray(assetData.network) ? assetData.network : [assetData.network].filter(Boolean),
          decimals: assetData.decimals ?? 0,
          isFreezable: assetData.isFreezable ?? false,
          publicKey: assetData.publicKey ?? `02f...${assetData.id.slice(-10)}`,
        });
      })
      .catch(err => {
        console.error(err);
        setAsset(null);
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
              <p>Loading asset details...</p>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!asset) {
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
                    Asset Details
                </h1>
            </div>
            <div className="max-w-4xl mx-auto">
             <AssetDetailsView asset={asset} view="workspace" userRole={userRole} />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AssetDetailsPage({ params }: { params: Promise<{ assetId: string }> }) {
  const resolvedParams = use(params);
  return <AssetDetailsComponent params={resolvedParams} />;
}
