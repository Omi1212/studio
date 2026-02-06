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

export default function EditAgentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [agent, setAgent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    if (!id) return;
    
    setLoading(true);
    fetch(`/api/users/${id}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Agent not found');
      })
      .then((data: User) => {
        if (data && data.role === 'agent') {
          setAgent(data);
        } else {
          setAgent(null);
        }
      })
      .catch(err => {
        console.error(err);
        setAgent(null);
      })
      .finally(() => setLoading(false));
  }, [params]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agent) return;

    const formData = new FormData(event.currentTarget);
    const updatedAgentData = {
      role: formData.get('role') as 'investor' | 'issuer' | 'agent' | 'superadmin',
      status: formData.get('status') as 'active' | 'inactive',
    };
    
    try {
        const response = await fetch(`/api/users/${agent.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedAgentData),
        });
        if (!response.ok) throw new Error('Failed to update agent');
        
        const updatedAgent = await response.json();
        
        toast({
          title: 'Agent Updated',
          description: `${updatedAgent.name}'s details have been updated.`,
        });
        router.push(`/agents/${agent.id}`);

    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update agent details.' });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading agent details...</p>
      </div>
    );
  }

  if (!agent) {
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
                        <CardTitle>Edit Agent</CardTitle>
                        <CardDescription>Update the details for {agent.name}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" defaultValue={agent.name} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" defaultValue={agent.email} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="walletAddress">Wallet Address</Label>
                            <Input id="walletAddress" name="walletAddress" defaultValue={agent.walletAddress} disabled />
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select name="role" defaultValue={agent.role}>
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
                                <Select name="status" defaultValue={agent.status}>
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
                    </CardContent>
                    <CardContent className="flex justify-end gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/agents/${agent.id}`}>Cancel</Link>
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
