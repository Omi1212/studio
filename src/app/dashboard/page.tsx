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
import type { AssetDetails, Company, User, Issuer } from '@/lib/types';
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
import AssetIcon from '@/components/ui/asset-icon';


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
                        if (Array.isArray(dbUser.companyId) && dbUser.companyId.length > 0) {
                            const companyToFetchId = localStorage.getItem('selectedCompanyId') || dbUser.companyId[0];
                            if (!localStorage.getItem('selectedCompanyId')) {
                                localStorage.setItem('selectedCompanyId', companyToFetchId);
                            }
                            fetch(`/api/companies/${companyToFetchId}`)
                                .then(res => res.ok ? res.json() : null)
                                .then(companyData => setCompany(companyData));
                            window.dispatchEvent(new Event('companyChanged'));
                        }
                    })
                    .catch(() => {});
            }
        }
        loadUserData();

        const handleAssetChange = async () => {
            if (userRole === 'issuer' || userRole === 'agent' || userRole === 'superadmin') {
                const storedAssetId = localStorage.getItem('selectedAssetId');
                try {
                    const currentUser: User | null = JSON.parse(localStorage.getItem('currentUser') || 'null');
                    
                    const getAssetsPromise = async (): Promise<{ data: AssetDetails[] }> => {
                        if (!currentUser) return { data: [] };
                        const selectedCompanyId = localStorage.getItem('selectedCompanyId');

                        if (currentUser.role === 'issuer') {
                            if (selectedCompanyId) {
                                const assetsResponse = await fetch(`/api/assets?perPage=999&companyId=${selectedCompanyId}`);
                                return assetsResponse.ok ? assetsResponse.json() : { data: [] };
                            }
                            return { data: [] };
                        } else if (currentUser.role === 'agent') {
                            const [allAssignments, allAssetsRes] = await Promise.all([
                                fetch(`/api/agents/assignments`).then(res => res.ok ? res.json() : {}),
                                fetch('/api/assets?perPage=999').then(res => res.ok ? res.json() : { data: [] })
                            ]);
                            const assignedAssetIds = allAssignments[currentUser.id] || [];
                            const agentAssets = (allAssetsRes.data || []).filter((asset: AssetDetails) => assignedAssetIds.includes(asset.id));
                            return { data: agentAssets };
                        } else { // for superadmin and any other case
                            const assetsResponse = await fetch('/api/assets?perPage=999');
                            return assetsResponse.ok ? assetsResponse.json() : { data: [] };
                        }
                    };
                    const assetsResponse = await getAssetsPromise();

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
                            decimals: 0,
                            isFreezable: false,
                        };
                        setSelectedAsset(enrichedAsset);
                        localStorage.setItem('selectedAssetId', firstAsset.id);
                    } else {
                        setSelectedAsset(null);
                        localStorage.removeItem('selectedAssetId');
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
        const isKybVerified = company?.kybStatus === 'verified';
        const complianceProvidersCount = company?.complianceProviders?.length ?? 0;
        
        const showKybBanner = user && !isKybVerified;
        const showComplianceBanner = user && isKybVerified && complianceProvidersCount < 3;

        const canShowAssetDetails = !showKybBanner && !showComplianceBanner && selectedAsset;
        
        return (
            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
              <div className="flex items-center gap-4">
                  {canShowAssetDetails && selectedAsset && <AssetIcon asset={selectedAsset} className="h-10 w-10" />}
                  <h1 className="text-3xl font-headline font-semibold">
                      {canShowAssetDetails && selectedAsset ? selectedAsset.assetName : 'Dashboard'}
                  </h1>
              </div>
                {showKybBanner && <KybBanner />}
                {showComplianceBanner && <IdentityProvidersBanner />}
                
                {canShowAssetDetails ? (
                    <AssetDetailsView asset={selectedAsset!} view="dashboard" userRole="issuer" />
                ) : (
                    <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
                        <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No Issued Assets</h2>
                        <p className="text-muted-foreground mb-4">Launch your first asset to see your workspace.</p>
                        <Button asChild>
                          <Link href="/issue-asset">Go to Launchpad</Link>
                        </Button>
                    </div>
                )}
            </main>
        );
    }
    
    if (role === 'agent' || role === 'superadmin') {
        if (selectedAsset) {
            return (
                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
                    <div className="flex items-center gap-4">
                        {selectedAsset && <AssetIcon asset={selectedAsset} className="h-10 w-10" />}
                        <h1 className="text-3xl font-headline font-semibold">{selectedAsset.assetName}</h1>
                    </div>
                    <AssetDetailsView asset={selectedAsset} view="dashboard" userRole={role} />
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
