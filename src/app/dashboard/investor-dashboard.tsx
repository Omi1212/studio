'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import PortfolioOverview from '@/components/dashboard/investor/portfolio-overview';
import MyHoldings from '@/components/dashboard/investor/my-holdings';
import RecentActivity from '@/components/dashboard/investor/recent-activity';
import MarketHighlights from '@/components/dashboard/investor/market-highlights';
import KycBanner from '@/components/dashboard/investor/kyc-banner';
import { Skeleton } from '@/components/ui/skeleton';

export default function InvestorDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Prioritize user from localStorage as it reflects the current session
        const storedUser = localStorage.getItem('currentUser');
        let userToProcess: User | null = null;
        if (storedUser) {
            userToProcess = JSON.parse(storedUser);
            setUser(userToProcess);
        }
        
        // Fallback if no user in localStorage (e.g. direct navigation)
        if (!userToProcess) {
            fetch('/api/users?role=investor&perPage=1')
              .then(res => res.json())
              .then((usersResponse: { data: User[] }) => {
                const investorUser = usersResponse.data[0];
                if (investorUser) {
                    setUser(investorUser);
                }
              }).catch(console.error)
              .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
        
        const handleCompanyChange = () => {
            const companyId = localStorage.getItem('selectedCompanyId');
            setSelectedCompanyId(companyId);
        };
        handleCompanyChange();

        window.addEventListener('companyChanged', handleCompanyChange);
        return () => window.removeEventListener('companyChanged', handleCompanyChange);
    }, []);

    if (loading) {
        return (
            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-64 w-full" />
            </main>
        );
    }
    
    // Check if user has pending KYC
    if (user && user.kycStatus === 'pending') {
        return (
             <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-headline font-semibold">
                        Welcome, {user?.name || 'Investor'}!
                    </h1>
                </div>
                <KycBanner />
            </main>
        );
    }

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-headline font-semibold">
                    Welcome, {user?.name || 'Investor'}!
                </h1>
            </div>
            <PortfolioOverview selectedCompanyId={selectedCompanyId} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-1">
                    <MyHoldings selectedCompanyId={selectedCompanyId} />
                </div>
                <div className="lg:col-span-1">
                    <MarketHighlights selectedCompanyId={selectedCompanyId} />
                </div>
            </div>
            <RecentActivity selectedCompanyId={selectedCompanyId} />
        </main>
    );
}
