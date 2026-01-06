import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import VolumeCards from '@/components/dashboard/volume-cards';
import TransactionsList from '@/components/dashboard/transactions-list';
import type { Metadata } from 'next';
import PaymentSummaryDynamic from '@/components/dashboard/payment-summary-dynamic';
import HeaderDynamic from '@/components/dashboard/header-dynamic';

export const metadata: Metadata = {
  title: 'SATS Dashboard',
  description: 'A dashboard to manage your SATS payments and transactions.',
};

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <h1 className="text-3xl font-headline font-semibold">Dashboard</h1>
            <VolumeCards />
            <div className="grid grid-cols-1 gap-8">
              <PaymentSummaryDynamic />
              <TransactionsList limit={7} />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
