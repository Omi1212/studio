
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
import { usersData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { User } from '@/lib/types';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    const storedUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    let foundUser = usersData.find(i => i.id === id);
    const storedUser = storedUsers.find(i => i.id === id);
    
    if (storedUser) {
      foundUser = { ...foundUser, ...storedUser };
    } else if (!foundUser && storedUsers.length > 0) {
      foundUser = storedUsers.find(i => i.id === id);
    }
    
    if (foundUser) {
      setUser(foundUser);
    }
    setLoading(false);
  }, [params]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const updatedUser = {
      ...user,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as 'active' | 'inactive',
      role: formData.get('role') as 'investor' | 'issuer' | 'agent' | 'superadmin',
      kycStatus: formData.get('kycStatus') as 'verified' | 'pending' | 'rejected',
      walletAddress: formData.get('walletAddress') as string,
    };
    
    const storedUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = storedUsers.map(i => i.id === user.id ? updatedUser : i);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast({
      title: 'User Updated',
      description: `${updatedUser.name}'s details have been updated.`,
    });
    router.push(`/user-management/${user.id}`);
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (!user) {
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
                        <CardTitle>Edit User</CardTitle>
                        <CardDescription>Update the details for {user.name}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" defaultValue={user.name} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" defaultValue={user.email} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="walletAddress">Wallet Address</Label>
                            <Input id="walletAddress" name="walletAddress" defaultValue={user.walletAddress} required />
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select name="role" defaultValue={user.role}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select role" />
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
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" defaultValue={user.status}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                         </div>
                        <div className="space-y-2">
                            <Label htmlFor="kycStatus">KYC Status</Label>
                             <Select name="kycStatus" defaultValue={user.kycStatus}>
                                <SelectTrigger id="kycStatus">
                                    <SelectValue placeholder="Select KYC status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardContent className="flex justify-end gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/user-management/${user.id}`}>Cancel</Link>
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
