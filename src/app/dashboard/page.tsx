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
import type { TokenDetails } from '@/lib/types';
import TokenDetailsView from '@/components/workspace/token-details-view';
import InvestorDashboard from './investor-dashboard';


function TokenDashboard({ token }: { token: TokenDetails }) {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
        <TokenDetailsView token={token} view="dashboard" />
    </main>
  );
}


function DashboardRenderer() {
    const [role, setRole] = useState<string | null>(null);
    const [selectedToken, setSelectedToken] = useState<TokenDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        setRole(userRole);

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
        return <div className="flex-1 p-4 sm:p-6 lg:p-8">Loading...</div>; // Or a skeleton loader
    }

    if (role === 'investor') {
        return <InvestorDashboard />;
    }

    if ((role === 'agent' || role === 'issuer') && selectedToken) {
        return <TokenDashboard token={selectedToken} />;
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
