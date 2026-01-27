'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { usersData } from '@/lib/data';
import PortfolioOverview from '@/components/dashboard/investor/portfolio-overview';
import MyHoldings from '@/components/dashboard/investor/my-holdings';
import RecentActivity from '@/components/dashboard/investor/recent-activity';
import MarketHighlights from '@/components/dashboard/investor/market-highlights';

export default function InvestorDashboard() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // For demo purposes, we'll just find the default investor user.
        // In a real app, you'd get the currently logged-in user.
        const investorUser = usersData.find((u: User) => u.role === 'investor');
        if (investorUser) {
            setUser(investorUser);
        }
    }, []);

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-headline font-semibold">
                    Welcome, {user?.name || 'Investor'}!
                </h1>
            </div>
            <PortfolioOverview />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    <MyHoldings />
                    <RecentActivity />
                </div>
                <div className="lg:col-span-2">
                    <MarketHighlights />
                </div>
            </div>
        </main>
    );
}
