'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRightLeft, ArrowRight, User as UserIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import KycProviderList from '@/components/settings/kyc-provider-list';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


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
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<'kyc_kyb' | 'kyt'>('kyc_kyb');

  const handleOpenDialog = (type: 'kyc_kyb' | 'kyt') => {
    setSelectedVerification(type);
    setIsVerificationModalOpen(true);
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
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/settings"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Compliance
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle>Configure your Compliance Platform</CardTitle>
                      <CardDescription>Select your providers for KYC, KYB & KYT verification.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          <div
                              onClick={() => handleOpenDialog('kyc_kyb')}
                              className="rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-muted/50"
                          >
                              <UserIcon className="h-8 w-8 text-muted-foreground shrink-0" />
                              <div className="flex-1">
                                  <p className="font-semibold">KYC & KYB</p>
                                  <p className="text-sm text-muted-foreground">
                                    Configure providers for Identity and Business verification.
                                </p>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                          
                          <div
                              onClick={() => handleOpenDialog('kyt')}
                              className="rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-muted/50"
                          >
                              <ArrowRightLeft className="h-8 w-8 text-muted-foreground shrink-0" />
                              <div className="flex-1">
                                  <p className="font-semibold">KYT (Know Your Transaction)</p>
                                  <p className="text-sm text-muted-foreground">Configure providers for transaction monitoring.</p>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                      </div>
                  </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
       <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
            <DialogContent className="sm:max-w-4xl">
                 {selectedVerification === 'kyc_kyb' ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Identity & Business Verification</DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue='kyc' className="w-full pt-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="kyc">KYC (Individual)</TabsTrigger>
                                <TabsTrigger value="kyb">KYB (Business)</TabsTrigger>
                            </TabsList>
                            <TabsContent value="kyc" className="pt-4">
                                <KycProviderList />
                            </TabsContent>
                            <TabsContent value="kyb" className="pt-4">
                                <KybProviderList />
                            </TabsContent>
                        </Tabs>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>KYT (Know Your Transaction)</DialogTitle>
                        </DialogHeader>
                        <div className="pt-4">
                            <KytProviderList />
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    </SidebarProvider>
  );
}
