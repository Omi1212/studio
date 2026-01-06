
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
import { useToast } from '@/hooks/use-toast';

export interface TokenDetails extends TokenFormValues {
  id: string;
  publicKey: string;
}

export default function IssueTokenPage() {
  const [createdToken, setCreatedToken] = useState<TokenDetails | null>(null);
  const { toast } = useToast();

  const handleTokenCreate = (data: TokenFormValues) => {
    console.log('Creating token with:', data);
    const newId = `btkn176av2...${Math.random().toString(36).substring(2, 10)}`;
    const newPublicKey = `03a0626e30...${Math.random().toString(36).substring(2, 10)}`;
    
    setCreatedToken({ ...data, id: newId, publicKey: newPublicKey });

    toast({
      title: 'Token Issued Successfully!',
      description: `Your new token "${data.tokenName}" has been created on the network.`,
    });
  };

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
              <div className="w-full max-w-4xl">
                {!createdToken ? (
                  <>
                    <h1 className="text-3xl font-headline font-semibold mb-8">Issue Token</h1>
                    <div className="flex justify-center pb-8">
                      <div className="w-full max-w-2xl">
                        <IssueTokenForm onSubmit={handleTokenCreate} />
                      </div>
                    </div>
                  </>
                ) : (
                  <TokenOverview
                    token={createdToken}
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
