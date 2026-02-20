
'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import ExistingAssets from '@/components/issue-asset/existing-assets';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export type ViewMode = 'card' | 'table';

export default function IssueAssetPage() {
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
            <div className="flex justify-center">
              <div className="w-full max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-headline font-semibold">
                    Launchpad
                    </h1>
                    <Button asChild>
                        <Link href="/issue-asset/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Asset
                        </Link>
                    </Button>
                </div>
                <ExistingAssets view={viewMode} setView={setViewMode} />
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
