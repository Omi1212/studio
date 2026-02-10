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
    logo: 'https://i.ibb.co/k2A0V0b/hubspot.png',
    description: 'Sync contacts, companies, and deals.'
  },
  {
    name: 'Salesforce',
    logo: 'https://i.ibb.co/hZ2vYv1/salesforce.png',
    description: 'Sync leads, accounts, and opportunities.'
  },
  {
    name: 'Zoho CRM',
    logo: 'https://i.ibb.co/j3v4n5N/zoho.png',
    description: 'Sync leads, contacts, and potentials.'
  },
  {
    name: 'Pipedrive',
    logo: 'https://i.ibb.co/1nQY0jH/pipedrive.png',
    description: 'Sync people, organizations, and deals.'
  },
  {
    name: 'Copper',
    logo: 'https://i.ibb.co/yQWJzFq/copper.png',
    description: 'Sync people, companies, and opportunities.'
  },
  {
    name: 'Dynamics 365',
    logo: 'https://i.ibb.co/gDF8qP5/dynamics365.png',
    description: 'Sync leads, accounts, and contacts.'
  },
];

function IntegrationCard({ name, logo, description }: { name: string; logo: string; description: string; }) {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <div className="relative h-12 w-12 shrink-0">
          <Image
            src={logo}
            alt={`${name} logo`}
            fill
            style={{ objectFit: 'contain' }}
            className="rounded-md"
          />
        </div>
        <div className="flex-1">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-end">
        <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium text-muted-foreground">{isConnected ? "Connected" : "Connect"}</span>
            <Switch checked={isConnected} onCheckedChange={setIsConnected} />
        </div>
      </CardContent>
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
