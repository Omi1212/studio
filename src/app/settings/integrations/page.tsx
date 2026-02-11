'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plug } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

const integrations = [
  {
    name: 'HubSpot',
    logo: 'https://i.ibb.co/JjfssTr2/16.png',
    description: 'Sync contacts, companies, and deals.'
  },
  {
    name: 'Salesforce',
    logo: 'https://i.ibb.co/PvMcS85n/17.png',
    description: 'Sync leads, accounts, and opportunities.'
  },
  {
    name: 'Zoho CRM',
    logo: 'https://i.ibb.co/jk96dZs1/18.png',
    description: 'Sync leads, contacts, and potentials.'
  },
];

function IntegrationCard({ name, logo, description }: { name: string; logo: string; description: string; }) {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src={logo}
                alt={`${name} logo`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="40px"
                className="rounded-md"
              />
            </div>
            <CardTitle className="text-lg">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium text-green-500">
              Connected
            </span>
            <Switch checked={isConnected} onCheckedChange={setIsConnected} />
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setIsConnected(true)}>
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function IntegrationsPage() {
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
                    Third Party Integrations
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {integrations.map((integration) => (
                        <IntegrationCard key={integration.name} {...integration} />
                    ))}
                </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
