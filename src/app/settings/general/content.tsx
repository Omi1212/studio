'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { User, Company } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Copy, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import BusinessVerification from '@/components/settings/business-verification';


function getKybBadge(status?: Company['kybStatus']) {
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

export default function GeneralSettingsContent() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const openSection = searchParams.get('open');
  const defaultAccordionValue = openSection === 'kyb' ? 'kyb-verification' : 'business-info';

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
            setUser(apiUser);
            if (apiUser.companyId) {
              fetch(`/api/companies/${apiUser.companyId}`)
                .then(res => res.ok ? res.json() : null)
                .then(company => {
                  if (company) {
                    setSelectedCompany(company);
                  }
                })
                .finally(() => setLoading(false));
            } else {
              setLoading(false);
            }
        }).catch(() => setLoading(false));
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
             <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-48" />
            </div>
            <div className="max-w-4xl mx-auto">
                <Skeleton className="h-64 w-full" />
            </div>
        </main>
    )
  }

  if (!user) {
      return null;
  }


  return (
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
        <Accordion type="single" collapsible defaultValue={defaultAccordionValue} className="w-full space-y-6">
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
                                  <TableCell className="text-right">{selectedCompany?.name || 'Not set'}</TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="font-medium text-muted-foreground">Legal Name</TableCell>
                                  <TableCell className="text-right">{selectedCompany?.legalName || 'Not set'}</TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="font-medium text-muted-foreground">Business ID</TableCell>
                                  <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-1">
                                          <span>{selectedCompany?.registrationId || 'Not set'}</span>
                                          {selectedCompany?.registrationId && (
                                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(selectedCompany!.registrationId!, 'Business ID')}>
                                                  <Copy className="h-4 w-4" />
                                              </Button>
                                          )}
                                      </div>
                                  </TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="font-medium text-muted-foreground">Industry</TableCell>
                                  <TableCell className="text-right">{selectedCompany?.industry || 'Not set'}</TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="font-medium text-muted-foreground">Website</TableCell>
                                  <TableCell className="text-right">
                                      {selectedCompany?.website ? (
                                          <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                              {selectedCompany.website}
                                          </a>
                                      ) : 'Not set'}
                                  </TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="font-medium text-muted-foreground">Employee Range</TableCell>
                                  <TableCell className="text-right">{selectedCompany?.employeeRange || 'Not set'}</TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="font-medium text-muted-foreground">KYB Status</TableCell>
                                  <TableCell className="text-right">{getKybBadge(selectedCompany?.kybStatus)}</TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="font-medium text-muted-foreground">Business Address</TableCell>
                                  <TableCell className="text-right">{selectedCompany?.address || 'Not set'}</TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="font-medium text-muted-foreground">Organization</TableCell>
                                  <TableCell className="text-right">BlockStratus S.A. de C.V.</TableCell>
                              </TableRow>
                          </TableBody>
                      </Table>
                         <div className="mt-4 flex justify-end">
                              <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                                  <Link href="/settings/business/edit">
                                      Edit
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
                          <BusinessVerification kybLevel={selectedCompany?.kybLevel || 0} />
                      </AccordionContent>
                  </Card>
              </AccordionItem>
           )}
        </Accordion>
      </div>
    </main>
  );
}
