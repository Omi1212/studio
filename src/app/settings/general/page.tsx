
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
import { ArrowLeft, Building, Settings, Edit, Copy, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import BusinessVerification from '@/components/settings/business-verification';


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

export default function GeneralSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
  
  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: `${fieldName} has been copied.`,
    });
  };


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
              <Accordion type="single" collapsible defaultValue="business-info" className="w-full space-y-6">
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
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium text-muted-foreground">Business Name</TableCell>
                                        <TableCell className="text-right">{selectedCompany?.name || user.businessName || 'Not set'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-muted-foreground">Legal Name</TableCell>
                                        <TableCell className="text-right">{user.legalName || 'Not set'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-muted-foreground">Business ID</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <span>{user.businessRegistrationId || 'Not set'}</span>
                                                {user.businessRegistrationId && (
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(user.businessRegistrationId!, 'Business ID')}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-muted-foreground">Industry</TableCell>
                                        <TableCell className="text-right">{user.industry || 'Not set'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-muted-foreground">KYC Verification</TableCell>
                                        <TableCell className="text-right">{getKycBadge(user.kycStatus)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-muted-foreground">Business Address</TableCell>
                                        <TableCell className="text-right">{user.address || 'Not set'}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                               <div className="mt-4 flex justify-end">
                                    <Button size="sm" asChild>
                                        <Link href="/settings/business/edit">
                                            <Edit className="mr-2 h-4 w-4"/>Edit
                                        </Link>
                                    </Button>
                                </div>
                          </AccordionContent>
                      </Card>
                  </AccordionItem>
                )}
                 {(user?.role === 'issuer' || user?.role === 'agent' || user?.role === 'superadmin') && (
                    <AccordionItem value="kyb-verification" className="border-b-0">
                        <Card>
                             <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Business Verification (KYB)</h3>
                                        <p className="text-sm text-muted-foreground">Complete business verification to access all platform features.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <BusinessVerification kybLevel={user.kybLevel || 0} />
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
