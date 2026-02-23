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


function DashboardRenderer() {
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<AssetDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [areComplianceProvidersLinked, setAreComplianceProvidersLinked] = useState(false);

    const loadComplianceStatus = () => {
        let complianceLinked = false;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('compliance-provider-')) {
                complianceLinked = true;
                break;
            }
        }
        setAreComplianceProvidersLinked(complianceLinked);
    };

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
        loadComplianceStatus();

        const handleAssetChange = async () => {
            if (userRole === 'issuer' || userRole === 'agent' || userRole === 'superadmin') {
                const storedAssetId = localStorage.getItem('selectedAssetId');
                try {
                    const currentUser: User | null = JSON.parse(localStorage.getItem('currentUser') || 'null');
                    
                    const getAssetsPromise = async (): Promise<{ data: AssetDetails[] }> => {
                        if (!currentUser) return { data: [] };

                        if (currentUser.role === 'issuer') {
                            const issuersRes = await fetch('/api/issuers?perPage=999');
                            if (!issuersRes.ok) throw new Error("Failed to fetch issuers");
                            const issuersData = await issuersRes.json();
                            const currentIssuer = (issuersData.data || []).find((i: Issuer) => i.email === currentUser.email);
                            if (currentIssuer) {
                                const assetsResponse = await fetch(`/api/assets?perPage=999&issuerId=${currentIssuer.id}`);
                                return assetsResponse.ok ? assetsResponse.json() : { data: [] };
                            } else {
                                return { data: [] };
                            }
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
                            publicKey: `02f...${firstAsset.id.slice(-10)}`,
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
        window.addEventListener('complianceProvidersChanged', loadComplianceStatus);

        return () => {
            window.removeEventListener('assetChanged', handleAssetChange);
            window.removeEventListener('companyChanged', loadUserData);
            window.removeEventListener('complianceProvidersChanged', loadComplianceStatus);
        };
    }, [role]);

    if (loading) {
        return <div className="flex-1 p-4 sm:p-6 lg:p-8">Loading...</div>;
    }
    
    if (role === 'investor') {
        return <InvestorDashboard />;
    }

    if (role === 'issuer') {
        const isKybVerified = company?.kybStatus === 'verified' || user?.email === 'issuer@gmail.com';
        
        const showKybBanner = user && !isKybVerified;
        const showComplianceBanner = user && isKybVerified && !areComplianceProvidersLinked;
        
        return (
            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
                {showKybBanner && <KybBanner />}
                {showComplianceBanner && <IdentityProvidersBanner />}
                
                {showKybBanner || showComplianceBanner ? (
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
                    <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
                        <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No Asset Selected</h2>
                        <p className="text-muted-foreground mb-4">Please select an asset from the sidebar or go to the Launchpad to create one.</p>
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
