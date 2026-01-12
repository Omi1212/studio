
'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import ExistingTokens from '@/components/issue-token/existing-tokens';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type ViewMode = 'card' | 'table';

export default function IssueTokenPage() {
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
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-1 bg-muted p-1 rounded-lg">
                             <Button 
                                variant={viewMode === 'card' ? 'secondary' : 'ghost'} 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setViewMode('card')}
                                >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setViewMode('table')}
                                >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button asChild>
                            <Link href="/issue-token/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Token
                            </Link>
                        </Button>
                    </div>
                </div>
                <ExistingTokens view={viewMode} />
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
