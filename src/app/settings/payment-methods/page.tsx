'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Banknote, Bitcoin, Plus, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
            
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-6">
                <AccordionItem value="bank-accounts" className="border-b-0">
                  <Card>
                    <AccordionTrigger className="p-6 hover:no-underline text-left">
                        <div className="flex items-center gap-4">
                            <Banknote className="h-6 w-6" />
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold leading-none tracking-tight">Bank Accounts</h3>
                                <p className="text-sm text-muted-foreground">Manage your linked bank accounts for payouts.</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0">
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
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                <AccordionItem value="bitcoin" className="border-b-0">
                  <Card>
                    <AccordionTrigger className="p-6 hover:no-underline text-left">
                        <div className="flex items-center gap-4">
                            <Bitcoin className="h-6 w-6" />
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold leading-none tracking-tight">Bitcoin</h3>
                                <p className="text-sm text-muted-foreground">Configure your Bitcoin addresses for receiving payments.</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0">
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
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                <AccordionItem value="stablecoins" className="border-b-0">
                    <Card>
                        <AccordionTrigger className="p-6 hover:no-underline text-left">
                            <div className="flex items-center gap-4">
                                <DollarSign className="h-6 w-6" />
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold leading-none tracking-tight">Stablecoins</h3>
                                    <p className="text-sm text-muted-foreground">Manage your stablecoin addresses and payout preferences.</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0">
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
                        </AccordionContent>
                    </Card>
                </AccordionItem>
              </Accordion>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
