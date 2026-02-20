
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import type { Metadata } from 'next';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import PortfolioValue from '@/components/my-assets/portfolio-value';
import AssetsListDynamic from '@/components/my-assets/assets-list-dynamic';

export const metadata: Metadata = {
  title: 'Portfolio - SATS Dashboard',
  description: 'View and manage your assets.',
};

export default function MyAssetsPage() {
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <h1 className="text-3xl font-headline font-semibold">Portfolio</h1>
            <div className="space-y-8">
              <PortfolioValue />
              <AssetsListDynamic />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
