
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import type { Metadata } from 'next';
import HeaderDynamic from '@/components/dashboard/header-dynamic';

export const metadata: Metadata = {
  title: 'Workspace - SATS Dashboard',
  description: 'Manage your workspace.',
};

export default function WorkspacePage() {
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <h1 className="text-3xl font-headline font-semibold">Workspace</h1>
            <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex items-center justify-center">
                <p className="text-muted-foreground">Workspace content goes here.</p>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
