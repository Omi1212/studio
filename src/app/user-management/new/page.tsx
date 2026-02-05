
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewUserPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newUser = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      walletAddress: formData.get('walletAddress') as string,
      role: (formData.get('role') as 'investor' | 'issuer' | 'agent' | 'superadmin') || 'investor',
      kycStatus: (formData.get('kycStatus') as 'verified' | 'pending' | 'rejected') || 'pending',
      status: 'active' as const,
    };
    
    // NOTE: This change is not persisted.
    toast({
      title: 'User Added (Not Persisted)',
      description: `${newUser.name} has been added for this session.`,
    });
    router.push('/user-management');
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
                        <CardTitle>Add New User</CardTitle>
                        <CardDescription>Fill in the details to add a new user.</CardDescription>
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
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" defaultValue="investor">
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="investor">Investor</SelectItem>
                                    <SelectItem value="issuer">Issuer</SelectItem>
                                    <SelectItem value="agent">Agent</SelectItem>
                                    <SelectItem value="superadmin">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="kycStatus">KYC Status</Label>
                            <Select name="kycStatus" defaultValue="pending">
                                <SelectTrigger id="kycStatus">
                                    <SelectValue placeholder="Select KYC status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                     <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardContent className="flex justify-end gap-2">
                         <Button variant="outline" asChild>
                            <Link href="/user-management">Cancel</Link>
                        </Button>
                        <Button type="submit">Add User</Button>
                    </CardContent>
                </form>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
