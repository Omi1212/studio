'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import PortfolioOverview from '@/components/dashboard/investor/portfolio-overview';
import MyHoldings from '@/components/dashboard/investor/my-holdings';
import RecentActivity from '@/components/dashboard/investor/recent-activity';
import MarketHighlights from '@/components/dashboard/investor/market-highlights';

export default function InvestorDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

    useEffect(() => {
        // For demo purposes, we'll just find the default investor user.
        // In a real app, you'd get the currently logged-in user.
        fetch('/api/users?perPage=999')
          .then(res => res.json())
          .then((usersResponse: { data: User[] }) => {
            const investorUser = usersResponse.data.find((u: User) => u.role === 'investor');
            if (investorUser) {
                setUser(investorUser);
            }
          }).catch(console.error);
        
        const handleCompanyChange = () => {
            const companyId = localStorage.getItem('selectedCompanyId');
            setSelectedCompanyId(companyId);
        };
        handleCompanyChange();

        window.addEventListener('companyChanged', handleCompanyChange);
        return () => window.removeEventListener('companyChanged', handleCompanyChange);
    }, []);

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
