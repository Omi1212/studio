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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

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
            {loading ? (
                <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center">
                   <p className="text-muted-foreground">Loading asset details...</p>
                </div>
            ) : selectedAsset ? (
              <div>
                <h1 className="text-3xl font-headline font-semibold mb-4">{selectedAsset.assetName}</h1>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tokens">Tokens</TabsTrigger>
                    <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                    <TabsTrigger value="fees">Fees</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-6">
                    <AssetDetailsView asset={selectedAsset} view="workspace" userRole={userRole} />
                  </TabsContent>
                   <TabsContent value="tokens">
                    <Card>
                      <CardContent className="p-6">
                        <p>Tokens content goes here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="liquidity">
                    <Card>
                      <CardContent className="p-6">
                        <p>Liquidity content goes here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="reports">
                    <Card>
                      <CardContent className="p-6">
                        <p>Reports content goes here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                   <TabsContent value="data">
                    <Card>
                      <CardContent className="p-6">
                        <p>Data content goes here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                   <TabsContent value="fees">
                    <Card>
                      <CardContent className="p-6">
                        <p>Fees content goes here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
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
