

'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { issuersData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { Issuer } from '@/lib/types';

export default function EditIssuerPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [issuer, setIssuer] = useState<Issuer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    const storedIssuers: Issuer[] = JSON.parse(localStorage.getItem('issuers') || '[]');
    let foundIssuer = issuersData.find(i => i.id === id);
    const storedIssuer = storedIssuers.find(i => i.id === id);
    
    if (storedIssuer) {
      foundIssuer = { ...foundIssuer, ...storedIssuer };
    } else if (!foundIssuer && storedIssuers.length > 0) {
      foundIssuer = storedIssuers.find(i => i.id === id);
    }
    
    if (foundIssuer) {
      setIssuer(foundIssuer);
    }
    setLoading(false);
  }, [params]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!issuer) return;

    const formData = new FormData(event.currentTarget);
    const updatedIssuer = {
      ...issuer,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as 'active' | 'inactive',
      walletAddress: formData.get('walletAddress') as string,
    };
    
    const storedIssuers: Issuer[] = JSON.parse(localStorage.getItem('issuers') || '[]');
    const updatedIssuers = storedIssuers.map(i => i.id === issuer.id ? updatedIssuer : i);
    localStorage.setItem('issuers', JSON.stringify(updatedIssuers));

    toast({
      title: 'Issuer Updated',
      description: `${updatedIssuer.name}'s details have been updated.`,
    });
    router.push(`/issuer-management/${issuer.id}`);
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading issuer details...</p>
      </div>
    );
  }

  if (!issuer) {
    notFound();
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center items-start">
            <Card className="w-full max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Edit Issuer</CardTitle>
                        <CardDescription>Update the details for {issuer.name}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Issuer Name</Label>
                            <Input id="name" name="name" defaultValue={issuer.name} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" defaultValue={issuer.email} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="walletAddress">Wallet Address</Label>
                            <Input id="walletAddress" name="walletAddress" defaultValue={issuer.walletAddress} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                             <Select name="status" defaultValue={issuer.status}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardContent className="flex justify-end gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/issuer-management/${issuer.id}`}>Cancel</Link>
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </CardContent>
                </form>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

