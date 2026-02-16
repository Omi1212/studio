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
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

type Invitation = {
  id: number;
  email: string;
  role: 'admin' | 'collaborator';
};

export default function InviteUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([
    { id: 1, email: '', role: 'collaborator' },
  ]);

  const handleAddInvitation = () => {
    setInvitations([
      ...invitations,
      { id: Date.now(), email: '', role: 'collaborator' },
    ]);
  };

  const handleRemoveInvitation = (id: number) => {
    if (invitations.length > 1) {
      setInvitations(invitations.filter((inv) => inv.id !== id));
    }
  };

  const handleInvitationChange = (id: number, field: 'email' | 'role', value: string) => {
    setInvitations(
      invitations.map((inv) =>
        inv.id === id ? { ...inv, [field]: value } : inv
      )
    );
  };

  const handleSendInvitations = () => {
    // In a real app, you would send the invitations to your backend here.
    const existingInvitations = JSON.parse(localStorage.getItem('pendingInvitations') || '[]');
    const newInvitations = invitations.filter(inv => inv.email); // Only save invitations with an email
    localStorage.setItem('pendingInvitations', JSON.stringify([...existingInvitations, ...newInvitations]));

    toast({
      title: 'Invitations Sent!',
      description: 'Your team members have been invited.',
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
                    Invite Users
                </h1>
            </div>

            <div className="max-w-4xl mx-auto">
                 <p className="text-muted-foreground mb-8">
                    The user will receive an email invitation with a link to accept and join.
                </p>

                <div className="space-y-6">
                    {invitations.map((invitation, index) => (
                        <Card key={invitation.id}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Invitation {index + 1}</CardTitle>
                                {invitations.length > 1 && (
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleRemoveInvitation(invitation.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`email-${invitation.id}`}>Email</Label>
                                    <Input
                                        id={`email-${invitation.id}`}
                                        type="email"
                                        placeholder="name@example.com"
                                        value={invitation.email}
                                        onChange={(e) => handleInvitationChange(invitation.id, 'email', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`role-${invitation.id}`}>Role</Label>
                                    <Select
                                        value={invitation.role}
                                        onValueChange={(value) => handleInvitationChange(invitation.id, 'role', value)}
                                    >
                                        <SelectTrigger id={`role-${invitation.id}`}>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="collaborator">Collaborator</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <Button variant="outline" onClick={handleAddInvitation}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/settings/users-and-access">Cancel</Link>
                        </Button>
                        <Button onClick={handleSendInvitations}>Invite</Button>
                    </div>
                </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
