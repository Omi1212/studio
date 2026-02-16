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
import type { TokenDetails, User } from '@/lib/types';
import TokenDetailsView from '@/components/workspace/token-details-view';
import InvestorDashboard from './investor-dashboard';
import KybBanner from '@/components/dashboard/kyb-banner';
import IdentityProvidersBanner from '@/components/dashboard/identity-providers-banner';
import VolumeCards from '@/components/dashboard/volume-cards';
import TransactionsList from '@/components/dashboard/transactions-list';
import PaymentSummaryDynamic from '@/components/dashboard/payment-summary-dynamic';
import CryptocurrenciesList from '@/components/dashboard/cryptocurrencies-list';


function DashboardRenderer() {
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [selectedToken, setSelectedToken] = useState<TokenDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        setRole(userRole);
        
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser); // Set immediately for faster UI response
            fetch(`/api/users/${parsedUser.id}`)
                .then(res => res.ok ? res.json() : parsedUser)
                .then(dbUser => setUser(dbUser))
                .catch(() => {});
        }

        const handleTokenChange = async () => {
            if (userRole === 'issuer' || userRole === 'agent') {
                const storedTokenId = localStorage.getItem('selectedTokenId');
                try {
                    const response = await fetch('/api/tokens?perPage=999');
                    const tokensResponse = await response.json();
                    const allTokens: TokenDetails[] = tokensResponse.data || [];

                    if (storedTokenId) {
                        const foundToken = allTokens.find(t => t.id === storedTokenId);
                        setSelectedToken(foundToken || null);
                    } else if (allTokens.length > 0) {
                        const firstToken = allTokens[0];
                         const enrichedToken = {
                            ...firstToken,
                            id: firstToken.id,
                            tokenName: firstToken.tokenName,
                            tokenTicker: firstToken.tokenTicker,
                            network: firstToken.network,
                            status: firstToken.status,
                            maxSupply: firstToken.maxSupply,
                            publicKey: `02f...${firstToken.id.slice(-10)}`,
                            decimals: 0,
                            isFreezable: false,
                        };
                        setSelectedToken(enrichedToken);
                        localStorage.setItem('selectedTokenId', firstToken.id);
                    }
                } catch (error) {
                    console.error("Failed to fetch tokens:", error);
                }
            }
            setLoading(false);
        };

        handleTokenChange();
        window.addEventListener('tokenChanged', handleTokenChange);

        return () => {
            window.removeEventListener('tokenChanged', handleTokenChange);
        };
    }, [role]);

    if (loading) {
        return <div className="flex-1 p-4 sm:p-6 lg:p-8">Loading...</div>;
    }
    
    if (role === 'investor') {
        return <InvestorDashboard />;
    }

    if (role === 'issuer') {
        const showKybBanner = user && user.kybStatus !== 'verified';
        return (
            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
                {showKybBanner && (
                  <>
                    <KybBanner />
                    <IdentityProvidersBanner />
                  </>
                )}
                {selectedToken ? (
                     <TokenDetailsView token={selectedToken} view="dashboard" userRole="issuer" />
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
        if (selectedToken) {
            return (
                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
                    <TokenDetailsView token={selectedToken} view="dashboard" userRole="agent" />
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
