
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

export default function IssueTokenPage() {
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
                        <Link href="/issue-token/new">Create New Token</Link>
                    </Button>
                </div>
                <ExistingTokens />
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
