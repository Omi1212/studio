
'use client';

import { useState, useEffect } from 'react';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { Company } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

export default function InviteInvestorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const selectedCompanyId = localStorage.getItem('selectedCompanyId');
    if (selectedCompanyId) {
      fetch(`/api/companies/${selectedCompanyId}`).then(res => res.json()).then(setCompany);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    if (!email) {
      toast({ variant: 'destructive', title: 'Error', description: 'Email is required.' });
      return;
    }
    
    if (!company) {
       toast({ variant: 'destructive', title: 'Error', description: 'No company selected.' });
       return;
    }

    const payload = {
        email,
        inviteScope: 'company',
        companyId: company.id,
    };
    
    try {
        const response = await fetch('/api/investors/invite', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to send invitation');
        }
        
        toast({
          title: 'Invitation Sent',
          description: `An invitation has been sent to ${email}.`,
        });
        router.push('/investors');
    } catch(error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message,
        });
    }
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
             <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/investors"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Invite Investor
                </h1>
            </div>
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Invite a new Investor</CardTitle>
                            <CardDescription>
                                Invite an investor to your company.
                                They will receive an email to create an account and complete their profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" placeholder="e.g. john.doe@example.com" required />
                            </div>
                        </CardContent>
                        <CardContent className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/investors">Cancel</Link>
                            </Button>
                            <Button type="submit">Send Invitation</Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
