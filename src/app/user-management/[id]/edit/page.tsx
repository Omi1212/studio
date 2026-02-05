
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
import type { User } from '@/lib/types';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    if (!id) return;
    setLoading(true);
    fetch(`/api/users/${id}`)
        .then(res => {
            if (!res.ok) throw new Error('User not found');
            return res.json();
        })
        .then(data => setUser(data))
        .catch(err => {
            console.error(err);
            setUser(null);
        })
        .finally(() => setLoading(false));
  }, [params]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const updatedUser = {
      ...user,
      name: user.name,
      email: user.email,
      walletAddress: user.walletAddress,
      role: formData.get('role') as 'investor' | 'issuer' | 'agent' | 'superadmin',
      status: formData.get('status') as 'active' | 'inactive',
      kycStatus: formData.get('kycStatus') as 'verified' | 'pending' | 'rejected',
    };
    
    // NOTE: This change is not persisted.
    toast({
      title: 'User Updated (Not Persisted)',
      description: `${updatedUser.name}'s details have been updated for this session.`,
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
                            <Input id="name" name="name" defaultValue={user.name} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" defaultValue={user.email} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="walletAddress">Wallet Address</Label>
                            <Input id="walletAddress" name="walletAddress" defaultValue={user.walletAddress} disabled />
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
