
'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import type { Metadata } from 'next';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import InvestorList from '@/components/investors/investor-list';
import type { ViewMode } from '@/lib/types';

export default function InvestorsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-headline font-semibold">Investors</h1>
              <Button asChild>
                <Link href="/investors/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Investor
                </Link>
              </Button>
            </div>
            <InvestorList view={viewMode} setView={setViewMode} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
