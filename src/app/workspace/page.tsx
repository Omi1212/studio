'use client';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { useEffect, useState } from 'react';
import type { AssetDetails, User } from '@/lib/types';
import { Rocket } from 'lucide-react';
import AssetDetailsView from '@/components/workspace/token-details-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WorkspacePage() {
  const [selectedAsset, setSelectedAsset] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<User['role'] | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole') as User['role'] | null;
    setUserRole(role);

    const handleAssetChange = async () => {
        const storedAssetId = localStorage.getItem('selectedAssetId');
        if (storedAssetId) {
            try {
              const response = await fetch(`/api/assets/${storedAssetId}`);
              if (response.ok) {
                const assetData = await response.json();
                 setSelectedAsset({
                    ...assetData,
                    network: Array.isArray(assetData.network) ? assetData.network : [assetData.network].filter(Boolean),
                    decimals: assetData.decimals ?? 0,
                    isFreezable: assetData.isFreezable ?? false,
                    publicKey: assetData.publicKey ?? `02f...${assetData.id.slice(-10)}`,
                });
              } else {
                 setSelectedAsset(null);
              }
            } catch (error) {
               console.error("Failed to fetch selected asset:", error);
               setSelectedAsset(null);
            }
        } else {
            setSelectedAsset(null);
        }
        setLoading(false);
    };

    handleAssetChange();
    window.addEventListener('assetChanged', handleAssetChange);

    return () => {
        window.removeEventListener('assetChanged', handleAssetChange);
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
                   <p className="text-muted-foreground">Loading asset details...</p>
                </div>
            ) : selectedAsset ? (
               <AssetDetailsView asset={selectedAsset} view="workspace" userRole={userRole} />
            ) : (
              <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
                  <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No asset selected or found</h2>
                  <p className="text-muted-foreground mb-4">Get started by launching your first asset from the Launchpad.</p>
                  <Button asChild>
                    <Link href="/issue-asset">Go to Launchpad</Link>
                  </Button>
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
