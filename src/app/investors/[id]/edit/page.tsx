
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type Investor = {
    id: string;
    name: string;
    email: string;
    status: 'whitelisted' | 'pending' | 'accepted' | 'rejected';
    walletAddress: string;
};

export default function EditInvestorPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    if (!id) return;

    fetch(`/api/investors/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Investor not found');
        return res.json();
      })
      .then(data => setInvestor(data))
      .catch(err => {
        console.error(err);
        setInvestor(null);
      })
      .finally(() => setLoading(false));
  }, [params]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!investor) return;

    const formData = new FormData(event.currentTarget);
    const updatedInvestor = {
      ...investor,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as 'whitelisted' | 'pending' | 'accepted' | 'rejected',
      walletAddress: formData.get('walletAddress') as string,
    };
    
    // NOTE: This change is not persisted. This is for demonstration purposes only.
    toast({
      title: 'Investor Updated (Not Persisted)',
      description: `${updatedInvestor.name}'s details have been updated for this session.`,
    });
    router.push(`/investors/${investor.id}`);
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading investor details...</p>
      </div>
    );
  }

  if (!investor) {
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
                        <CardTitle>Edit Investor</CardTitle>
                        <CardDescription>Update the details for {investor.name}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" defaultValue={investor.name} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" defaultValue={investor.email} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="walletAddress">Wallet Address</Label>
                            <Input id="walletAddress" name="walletAddress" defaultValue={investor.walletAddress} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                             <Select name="status" defaultValue={investor.status}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="whitelisted">Whitelisted</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardContent className="flex justify-end gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/investors/${investor.id}`}>Cancel</Link>
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
