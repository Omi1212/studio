'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function InviteUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<{ email: string; role: string }>({
    email: '',
    role: '',
  });

  const handleInvitationChange = (field: 'email' | 'role', value: string) => {
    setInvitation(prev => ({ ...prev, [field]: value }));
  };

  const handleSendInvitation = () => {
    if (!invitation.email) {
      toast({
        variant: 'destructive',
        title: 'Email is required',
        description: 'Please enter an email address to send an invitation.',
      });
      return;
    }
    if (!invitation.role) {
      toast({
        variant: 'destructive',
        title: 'Role is required',
        description: 'Please select a role for the user.',
      });
      return;
    }
    // In a real app, you would send the invitation to your backend here.
    const existingInvitations = JSON.parse(localStorage.getItem('pendingInvitations') || '[]');
    const newInvitation = { ...invitation, id: Date.now() };
    localStorage.setItem('pendingInvitations', JSON.stringify([...existingInvitations, newInvitation]));

    toast({
      title: 'Invitation Sent!',
      description: 'Your team member has been invited.',
    });
    router.push('/settings/users-and-access');
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/settings/users-and-access"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Invite User
                </h1>
            </div>

            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Send an Invitation</CardTitle>
                        <CardDescription>
                            The user will receive an email invitation with a link to accept and join.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={invitation.email}
                                onChange={(e) => handleInvitationChange('email', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={invitation.role}
                                onValueChange={(value) => handleInvitationChange('role', value)}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="operations">Operations</SelectItem>
                                    <SelectItem value="sales">Sales</SelectItem>
                                    <SelectItem value="support">Technical Support</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/settings/users-and-access">Cancel</Link>
                        </Button>
                        <Button onClick={handleSendInvitation}>Send Invitation</Button>
                    </CardFooter>
                </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
