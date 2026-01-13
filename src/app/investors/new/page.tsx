
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function NewInvestorPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newInvestor = {
      id: `inv-${Math.random().toString(36).substring(2, 9)}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as 'whitelisted' | 'pending',
      walletAddress: formData.get('walletAddress') as string,
      joinedDate: new Date().toISOString().split('T')[0],
      totalInvested: 0,
      holdings: [],
      isFrozen: false,
    };
    
    const existingInvestors = JSON.parse(localStorage.getItem('investors') || '[]');
    localStorage.setItem('investors', JSON.stringify([newInvestor, ...existingInvestors]));

    toast({
      title: 'Investor Added',
      description: `${newInvestor.name} has been added to your investor list.`,
    });
    router.push('/investors');
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
                        <CardTitle>Add New Investor</CardTitle>
                        <CardDescription>Fill in the details to add a new investor to your list.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="e.g. John Doe" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="e.g. john.doe@example.com" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="walletAddress">Wallet Address</Label>
                            <Input id="walletAddress" name="walletAddress" placeholder="e.g. spark1q..." required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                             <Select name="status" defaultValue="pending">
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="whitelisted">Whitelisted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardContent className="flex justify-end gap-2">
                         <Button variant="outline" asChild>
                            <Link href="/investors">Cancel</Link>
                        </Button>
                    </CardContent>
                </form>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
