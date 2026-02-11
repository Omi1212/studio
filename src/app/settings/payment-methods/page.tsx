'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Banknote, Bitcoin, Plus, DollarSign, Zap } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function PaymentMethodsPage() {
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/settings"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Payment Methods
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Banknote className="h-6 w-6" />
                        <CardTitle>Bank Accounts</CardTitle>
                    </div>
                    <CardDescription>
                        Manage your linked bank accounts for payouts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                        <p>No bank accounts added yet.</p>
                   </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Bank Account
                    </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Bitcoin className="h-6 w-6" />
                        <CardTitle>Bitcoin</CardTitle>
                    </div>
                    <CardDescription>
                        Configure your Bitcoin addresses for receiving payments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                        <p>No Bitcoin addresses configured yet.</p>
                   </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Configure Bitcoin
                    </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Zap className="h-6 w-6" />
                        <CardTitle>Other Networks</CardTitle>
                    </div>
                    <CardDescription>
                        Configure addresses for other supported networks.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                        <p>No other network addresses configured yet.</p>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Configure Networks
                    </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                     <div className="flex items-center gap-3">
                        <DollarSign className="h-6 w-6" />
                        <CardTitle>Stablecoins</CardTitle>
                    </div>
                    <CardDescription>
                       Manage your stablecoin addresses and payout preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                        <p>No stablecoin addresses configured yet.</p>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Configure Stablecoins
                    </Button>
                </CardFooter>
              </Card>

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
