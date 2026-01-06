import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import type { Metadata } from 'next';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import PortfolioValue from '@/components/my-tokens/portfolio-value';
import TokensList from '@/components/my-tokens/tokens-list';

export const metadata: Metadata = {
  title: 'My Tokens - SATS Dashboard',
  description: 'View and manage your tokens.',
};

export default function MyTokensPage() {
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <h1 className="text-3xl font-headline font-semibold">My Tokens</h1>
            <div className="space-y-8">
              <PortfolioValue />
              <TokensList />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
