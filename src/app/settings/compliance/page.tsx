'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRightLeft, User as UserIcon, Building } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import KycProviderList from '@/components/settings/kyc-provider-list';


const kybProviders = [
  { name: 'Sumsub', logo: 'https://i.ibb.co/xKGcFvcs/1.png' },
  { name: 'Onfido', logo: 'https://i.ibb.co/8g2Qmknh/2.png' },
  { name: 'Kyckr', logo: 'https://i.ibb.co/0yYWB1Yb/8.png' },
  { name: 'Middesk', logo: 'https://i.ibb.co/8DsyxCyR/9.png' },
  { name: "Moody's Analytics", logo: 'https://i.ibb.co/Pzc00sHp/10.png' },
];

const kytProviders = [
  { name: 'Scorechain', logo: 'https://i.ibb.co/hFk9xwJW/11.png' },
  { name: 'Crystal Intelligence', logo: 'https://i.ibb.co/jv0cDR9Z/12.png' },
  { name: 'Chainalysis', logo: 'https://i.ibb.co/ZRBJWJ5T/13.png' },
  { name: 'TRM Labs', logo: 'https://i.ibb.co/zhRZJDbW/14.png' },
  { name: 'Merkle Science', logo: 'https://i.ibb.co/dZddJQ2/merkle-science.png' },
];


function KybProviderList() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-center text-muted-foreground">
        Choose a provider to continue with your business verification.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kybProviders.map((provider) => (
          <Card
            key={provider.name}
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors group rounded-xl"
          >
            <div className="relative h-12 w-28 mb-4">
              <Image
                src={provider.logo}
                alt={`${provider.name} logo`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="rounded-md"
              />
            </div>
            <CardTitle className="text-base font-semibold">{provider.name}</CardTitle>
          </Card>
        ))}
      </div>
    </div>
  );
}

function KytProviderList() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-center text-muted-foreground">
        Choose a provider to continue with your transaction monitoring.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kytProviders.map((provider) => (
          <Card
            key={provider.name}
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors group rounded-xl"
          >
            <div className="relative h-12 w-28 mb-4">
              <Image
                src={provider.logo}
                alt={`${provider.name} logo`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="rounded-md"
              />
            </div>
            <CardTitle className="text-base font-semibold">{provider.name}</CardTitle>
          </Card>
        ))}
      </div>
    </div>
  );
}


export default function CompliancePage() {
  
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
                    Compliance
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="w-full space-y-6">
                    <AccordionItem value="kyc" className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <UserIcon className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">KYC (Know Your Customer)</h3>
                                        <p className="text-sm text-muted-foreground">Configure providers for Identity verification.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <KycProviderList />
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="kyb" className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <Building className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">KYB (Know Your Business)</h3>
                                        <p className="text-sm text-muted-foreground">Configure providers for Business verification.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <KybProviderList />
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                     <AccordionItem value="kyt" className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <ArrowRightLeft className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">KYT (Know Your Transaction)</h3>
                                        <p className="text-sm text-muted-foreground">Configure providers for transaction monitoring.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <KytProviderList />
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
