'use client';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import DefaultDashboard from './default/page';
import { useEffect, useState } from 'react';
import type { AssetDetails, Company, User } from '@/lib/types';
import AssetDetailsView from '@/components/workspace/token-details-view';
import InvestorDashboard from './investor-dashboard';
import KybBanner from '@/components/dashboard/kyb-banner';
import IdentityProvidersBanner from '@/components/dashboard/identity-providers-banner';
import VolumeCards from '@/components/dashboard/volume-cards';
import TransactionsList from '@/components/dashboard/transactions-list';
import PaymentSummaryDynamic from '@/components/dashboard/payment-summary-dynamic';
import CryptocurrenciesList from '@/components/dashboard/cryptocurrencies-list';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


function DashboardRenderer() {
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<AssetDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        setRole(userRole);
        
        const loadUserData = () => {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                setUser(parsedUser); // Set immediately for faster UI response
                fetch(`/api/users/${parsedUser.id}`)
                    .then(res => res.ok ? res.json() : parsedUser)
                    .then(dbUser => {
                      setUser(dbUser)
                      if (dbUser.companyId) {
                        fetch(`/api/companies/${dbUser.companyId}`)
                          .then(res => res.ok ? res.json() : null)
                          .then(companyData => setCompany(companyData));
                      }
                    })
                    .catch(() => {});
            }
        }
        loadUserData();

        const handleAssetChange = async () => {
            if (userRole === 'issuer' || userRole === 'agent') {
                const storedAssetId = localStorage.getItem('selectedAssetId');
                try {
                    const response = await fetch('/api/assets?perPage=999');
                    const assetsResponse = await response.json();
                    const allAssets: AssetDetails[] = (assetsResponse.data || []).map((asset: any) => ({
                        ...asset,
                        network: Array.isArray(asset.network) ? asset.network : [asset.network].filter(Boolean)
                    }));

                    if (storedAssetId) {
                        const foundAsset = allAssets.find(t => t.id === storedAssetId);
                        setSelectedAsset(foundAsset || null);
                    } else if (allAssets.length > 0) {
                        const firstAsset = allAssets[0];
                         const enrichedAsset = {
                            ...firstAsset,
                            id: firstAsset.id,
                            assetName: firstAsset.assetName,
                            assetTicker: firstAsset.assetTicker,
                            network: firstAsset.network,
                            status: firstAsset.status,
                            maxSupply: firstAsset.maxSupply,
                            publicKey: `02f...${firstAsset.id.slice(-10)}`,
                            decimals: 0,
                            isFreezable: false,
                        };
                        setSelectedAsset(enrichedAsset);
                        localStorage.setItem('selectedAssetId', firstAsset.id);
                    }
                } catch (error) {
                    console.error("Failed to fetch assets:", error);
                }
            }
            setLoading(false);
        };

        handleAssetChange();
        window.addEventListener('assetChanged', handleAssetChange);
        window.addEventListener('companyChanged', loadUserData);

        return () => {
            window.removeEventListener('assetChanged', handleAssetChange);
            window.removeEventListener('companyChanged', loadUserData);
        };
    }, [role]);

    if (loading) {
        return <div className="flex-1 p-4 sm:p-6 lg:p-8">Loading...</div>;
    }
    
    if (role === 'investor') {
        return <InvestorDashboard />;
    }

    if (role === 'issuer') {
        const showKybBanner = user && company && company.kybStatus !== 'verified' && user.email !== 'issuer@gmail.com';
        return (
            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
                {showKybBanner && (
                  <>
                    <KybBanner />
                    <IdentityProvidersBanner />
                  </>
                )}
                {showKybBanner ? (
                    <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
                        <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No Issued Assets</h2>
                        <p className="text-muted-foreground mb-4">Launch your first asset to see your workspace.</p>
                        <Button asChild>
                          <Link href="/issue-asset">Go to Launchpad</Link>
                        </Button>
                    </div>
                ) : selectedAsset ? (
                     <AssetDetailsView asset={selectedAsset} view="dashboard" userRole="issuer" />
                ) : (
                    <>
                        <h1 className="text-3xl font-headline font-semibold">Dashboard</h1>
                        <VolumeCards />
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <PaymentSummaryDynamic className="lg:col-span-3" />
                            <CryptocurrenciesList className="lg:col-span-2" />
                        </div>
                        <TransactionsList limit={7} />
                    </>
                )}
            </main>
        );
    }
    
    if (role === 'agent') {
        if (selectedAsset) {
            return (
                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
                    <AssetDetailsView asset={selectedAsset} view="dashboard" userRole="agent" />
                </main>
            );
        } else {
             return <DefaultDashboard />;
        }
    }

    return <DefaultDashboard />;
}


export default function DashboardPage() {
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <HeaderDynamic />
          <DashboardRenderer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
