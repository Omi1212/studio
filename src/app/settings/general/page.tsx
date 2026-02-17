import { Suspense } from 'react';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import GeneralSettingsContent from './content';

function Loading() {
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-48" />
            </div>
            <div className="max-w-4xl mx-auto">
                <Skeleton className="h-64 w-full" />
            </div>
        </main>
    );
}

export default function GeneralSettingsPage() {
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <Suspense fallback={<Loading />}>
            <GeneralSettingsContent />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
