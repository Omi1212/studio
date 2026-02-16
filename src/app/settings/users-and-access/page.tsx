'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import AccessList from '@/components/settings/users-and-access/access-list';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

export default function UsersAndAccessPage() {
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
                    Users & Access
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible defaultValue="users-access" className="w-full">
                    <AccordionItem value="users-access" className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <Users className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Manage Access</h3>
                                        <p className="text-sm text-muted-foreground">Define roles and permissions for your team.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <AccessList />
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
