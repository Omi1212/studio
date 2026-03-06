'use client';

import { Suspense } from 'react';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import InvestorList from '@/components/investors/investor-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

function Loading() {
    return (
         <div className="space-y-4">
            <h1 className="text-3xl font-headline font-semibold">Investors</h1>
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-8 w-[150px]" />
            </div>
            <Card className="h-[400px]" />
        </div>
    );
}

export default function InvestorsPage() {
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <Suspense fallback={<Loading />}>
              <InvestorList />
            </Suspense>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
