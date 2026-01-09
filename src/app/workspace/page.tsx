
'use client';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import type { Metadata } from 'next';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { useEffect, useState } from 'react';
import type { TokenDetails } from '../issue-token/page';
import TokenWorkspaceCard from '@/components/workspace/token-workspace-card';
import { exampleTokens } from '@/lib/data';
import { Rocket } from 'lucide-react';

export default function WorkspacePage() {
  const [tokens, setTokens] = useState<(TokenDetails | (typeof exampleTokens)[0])[]>([]);

  useEffect(() => {
    // This code runs only on the client
    const storedTokens = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    setTokens([...exampleTokens, ...storedTokens]);
  }, []);

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
            
            {tokens.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tokens.map((token, index) => (
                  <TokenWorkspaceCard key={token.id || index} token={token} />
                ))}
              </div>
            ) : (
              <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center">
                  <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No tokens found</h2>
                  <p className="text-muted-foreground">Get started by launching your first token from the Launchpad.</p>
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

