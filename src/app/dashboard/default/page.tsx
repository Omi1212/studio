'use client';

import VolumeCards from '@/components/dashboard/volume-cards';
import TransactionsList from '@/components/dashboard/transactions-list';
import PaymentSummaryDynamic from '@/components/dashboard/payment-summary-dynamic';
import CryptocurrenciesList from '@/components/dashboard/cryptocurrencies-list';

export default function DefaultDashboard() {
  return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
        <h1 className="text-3xl font-headline font-semibold">Dashboard</h1>
        <VolumeCards />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <PaymentSummaryDynamic className="lg:col-span-3" />
          <CryptocurrenciesList className="lg:col-span-2" />
        </div>
        <TransactionsList limit={7} />
      </main>
  );
}
