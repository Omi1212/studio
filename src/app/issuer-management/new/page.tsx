

'use client';

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
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function NewIssuerPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newIssuerData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      walletAddress: formData.get('walletAddress') as string,
      issuedTokens: 0,
      pendingTokens: 0,
      status: 'active' as const,
    };
    
    try {
        const response = await fetch('/api/issuers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newIssuerData),
        });
        if (!response.ok) throw new Error('Failed to add issuer');

        const newIssuer = await response.json();
        toast({
          title: 'Issuer Added',
          description: `${newIssuer.name} has been added.`,
        });
        router.push('/issuer-management');
    } catch(error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not add the issuer.'
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
          <main className="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center items-start">
            <Card className="w-full max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Add New Issuer</CardTitle>
                        <CardDescription>Fill in the details to add a new issuer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Issuer Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Prime Issuance" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="e.g. contact@primeissuance.com" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="walletAddress">Wallet Address</Label>
                            <Input id="walletAddress" name="walletAddress" placeholder="e.g. spark1q..." required />
                        </div>
                    </CardContent>
                    <CardContent className="flex justify-end gap-2">
                         <Button variant="outline" asChild>
                            <Link href="/issuer-management">Cancel</Link>
                        </Button>
                        <Button type="submit">Add Issuer</Button>
                    </CardContent>
                </form>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
