'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import UserList from '@/components/user-management/user-list';
import type { ViewMode } from '@/lib/types';

export default function UserManagementPage() {
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
            <UserList view={viewMode} setView={setViewMode} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
