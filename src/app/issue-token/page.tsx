
'use client';

import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import IssueTokenForm, { TokenFormValues } from '@/components/issue-token/issue-token-form';
import TokenOverview from '@/components/issue-token/token-overview';

export interface TokenDetails extends TokenFormValues {
  id: string;
}

export default function IssueTokenPage() {
  const [createdToken, setCreatedToken] = useState<TokenDetails | null>(null);

  const handleTokenCreate = (data: TokenFormValues) => {
    // This is a mock creation. In a real app, you would call:
    // const createTx = await wallet.createToken({
    //   tokenName: data.tokenName,
    //   tokenTicker: data.tokenTicker,
    //   decimals: data.decimals,
    //   maxSupply: BigInt(data.maxSupply),
    //   isFreezable: data.isFreezable,
    // });
    // For now, we'll just simulate it.
    console.log('Creating token with:', data);
    const newId = `0.0.${Math.floor(Math.random() * 100000) + 1}`;
    setCreatedToken({ ...data, id: newId });
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <h1 className="text-3xl font-headline font-semibold">Issue Token</h1>
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                {!createdToken ? (
                  <IssueTokenForm onSubmit={handleTokenCreate} />
                ) : (
                  <TokenOverview
                    token={createdToken}
                    onIssueNew={() => setCreatedToken(null)}
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
