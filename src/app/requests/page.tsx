'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import RequestList from '@/components/requests/request-list';
import type { ViewMode } from '@/lib/types';

export default function RequestsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <RequestList view={viewMode} setView={setViewMode} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
