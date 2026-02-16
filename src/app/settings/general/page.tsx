'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Settings, Edit } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';


function getKycBadge(status?: User['kycStatus']) {
  switch (status) {
    case 'verified':
      return <Badge variant="outline" className="text-green-400 border-green-400">Verified</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'rejected':
       return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

function PersonalInfoRow({ label, value, actionLabel, onActionClick }: { label: string; value: React.ReactNode; actionLabel?: string; onActionClick?: () => void; }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2">
            <p className="text-sm text-muted-foreground mb-1 sm:mb-0">{label}</p>
            <div className="flex items-center gap-4">
                {actionLabel && (
                    <Button variant="link" className="text-sm p-0 h-auto text-primary hover:underline" onClick={onActionClick}>
                        {actionLabel}
                    </Button>
                )}
                <div className="text-sm font-medium text-right break-all">{value}</div>
            </div>
        </div>
    );
}

export default function GeneralSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      
       fetch(`/api/users/${parsedUser.id}`)
        .then(res => {
            if (res.ok) return res.json();
            return parsedUser; // Fallback to local
        })
        .then((apiUser: User) => {
            const mergedUser = { ...apiUser, ...parsedUser };
            setUser(mergedUser);

             if (mergedUser.role === 'issuer') {
              const storedCompanyId = localStorage.getItem('selectedCompanyId');
              if (storedCompanyId) {
                fetch('/api/companies')
                  .then(res => res.json())
                  .then(companiesResponse => {
                    const company = (companiesResponse.data || []).find((c: any) => c.id === storedCompanyId);
                    setSelectedCompany(company || null);
                  });
              }
            }
        }).finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, []);

  if (loading) {
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
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-48" />
                </div>
                <div className="max-w-4xl mx-auto">
                    <Skeleton className="h-64 w-full" />
                </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!user) {
      return null;
  }


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
                    General Settings
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible defaultValue="business-info" className="w-full">
                {(user?.role === 'issuer' || user?.role === 'agent' || user?.role === 'superadmin') && (
                  <AccordionItem value="business-info" className="border-b-0">
                      <Card>
                          <AccordionTrigger className="p-6 hover:no-underline text-left">
                              <div className="flex items-center gap-4">
                                  <Building className="h-6 w-6" />
                                  <div className="space-y-1 text-left">
                                      <h3 className="text-lg font-semibold leading-none tracking-tight">Business Information</h3>
                                      <p className="text-sm text-muted-foreground">Manage your business information.</p>
                                  </div>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-6 pt-0">
                              <div className="space-y-1">
                                <PersonalInfoRow label="Business Name" value={selectedCompany?.name || user.businessName || 'Not set'} />
                                <PersonalInfoRow label="Legal Name" value={user.legalName || 'Not set'} />
                                <PersonalInfoRow label="Business ID" value={user.businessRegistrationId || 'Not set'} />
                                <PersonalInfoRow label="Industry" value={user.industry || 'Not set'} />
                                <PersonalInfoRow label="KYC Verification" value={getKycBadge(user.kycStatus)} />
                                <PersonalInfoRow label="Business Address" value={user.address || 'Not set'} />
                              </div>
                               <div className="mt-4 flex justify-end">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/settings/business/edit">
                                            <Edit className="mr-2 h-4 w-4"/>Edit
                                        </Link>
                                    </Button>
                                </div>
                          </AccordionContent>
                      </Card>
                  </AccordionItem>
                )}
                {user?.role === 'investor' && (
                  <AccordionItem value="user-preferences" className="border-b-0">
                      <Card>
                          <AccordionTrigger className="p-6 hover:no-underline text-left">
                              <div className="flex items-center gap-4">
                                  <Settings className="h-6 w-6" />
                                  <div className="space-y-1 text-left">
                                      <h3 className="text-lg font-semibold leading-none tracking-tight">User Preferences</h3>
                                      <p className="text-sm text-muted-foreground">Manage your language, currency, and theme settings.</p>
                                  </div>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-6 pt-0">
                              <div className="space-y-6">
                                  <div className="flex items-center justify-between">
                                      <Label>Theme</Label>
                                      <Tabs defaultValue="dark" className="w-auto">
                                          <TabsList className="h-auto">
                                              <TabsTrigger value="light" className="px-6 py-2">Light</TabsTrigger>
                                              <TabsTrigger value="dark" className="px-6 py-2">Dark</TabsTrigger>
                                              <TabsTrigger value="system" className="px-6 py-2">System</TabsTrigger>
                                          </TabsList>
                                      </Tabs>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                          <Label htmlFor="language">Language</Label>
                                          <Select defaultValue="en">
                                              <SelectTrigger id="language">
                                                  <SelectValue placeholder="Select language" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                  <SelectItem value="en">English</SelectItem>
                                                  <SelectItem value="es">Español</SelectItem>
                                                  <SelectItem value="fr">Français</SelectItem>
                                              </SelectContent>
                                          </Select>
                                      </div>
                                      <div className="space-y-2">
                                          <Label htmlFor="currency">Currency</Label>
                                          <Select defaultValue="usd">
                                              <SelectTrigger id="currency">
                                                  <SelectValue placeholder="Select currency" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                  <SelectItem value="usd">USD - US Dollar</SelectItem>
                                                  <SelectItem value="eur">EUR - Euro</SelectItem>
                                                  <SelectItem value="btc">BTC - Bitcoin</SelectItem>
                                              </SelectContent>
                                          </Select>
                                      </div>
                                  </div>
                              </div>
                          </AccordionContent>
                      </Card>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
