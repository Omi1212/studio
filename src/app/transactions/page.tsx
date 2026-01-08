import {
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import type { Metadata } from 'next';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import AllTransactionsDynamic from '@/components/transactions/all-transactions-dynamic';

export const metadata: Metadata = {
  title: 'Transactions - SATS Dashboard',
  description: 'View all your SATS payments and transactions.',
};

export default function TransactionsPage() {
  return (
    <>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <h1 className="text-3xl font-headline font-semibold">Transactions</h1>
            <AllTransactionsDynamic />
          </main>
        </div>
      </SidebarInset>
    </>
  );
}
