
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
import { exampleTokens } from '@/lib/data';
import SupplyCards from '@/components/token-dashboard/supply-cards';
import TokenSummaryCard from '@/components/token-dashboard/token-summary-card';
import type { Metadata } from 'next';

function TokenDashboard({ token }: { token: TokenDetails }) {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
        <TokenSummaryCard token={token} />
        <SupplyCards token={token} />
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

        const handleTokenChange = () => {
            const storedTokenId = localStorage.getItem('selectedTokenId');
            if (storedTokenId) {
                const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
                const allTokens: TokenDetails[] = [...exampleTokens, ...storedTokens];
                const foundToken = allTokens.find(t => t.id === storedTokenId);
                setSelectedToken(foundToken || null);
            } else if (exampleTokens.length > 0) {
              setSelectedToken(exampleTokens[0] as TokenDetails);
            }
        };

        handleTokenChange(); // Initial load
        window.addEventListener('tokenChanged', handleTokenChange);
        setLoading(false);

        return () => {
            window.removeEventListener('tokenChanged', handleTokenChange);
        };
    }, []);

    if (loading) {
        return <div className="flex-1 p-4 sm:p-6 lg:p-8">Loading...</div>; // Or a skeleton loader
    }

    if ((role === 'admin' || role === 'issuer') && selectedToken) {
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
