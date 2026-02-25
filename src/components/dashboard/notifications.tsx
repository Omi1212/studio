
'use client';
import { useState, useEffect } from 'react';
import type { Invitation, User } from '@/lib/types';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '../ui/card';
import { BellRing, Check, X } from 'lucide-react';
import { DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';

export default function Notifications() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            const user = JSON.parse(userJson);
            fetch('/api/invitations')
                .then(res => res.json())
                .then((allInvitations: Invitation[]) => {
                    const userInvitations = allInvitations.filter(inv => inv.email === user.email && inv.status === 'pending');
                    setInvitations(userInvitations);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const handleInvitation = async (invitationId: string, accepted: boolean) => {
        const response = await fetch(`/api/invitations/${invitationId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: accepted ? 'accepted' : 'rejected' }),
        });

        if (response.ok) {
            setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
            if (accepted) {
                toast({ title: "Invitation Accepted!", description: "You have joined the new company." });
                window.dispatchEvent(new Event('companyChanged')); // To refresh sidebar and other components
            } else {
                toast({ title: "Invitation Rejected." });
            }
        } else {
            toast({ variant: 'destructive', title: "Error", description: "Could not process the invitation." });
        }
    };

    return (
        <div className="p-1">
            <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {loading ? (
                <div className="p-4 text-sm text-center text-muted-foreground">Loading...</div>
            ) : invitations.length === 0 ? (
                <div className="p-4 text-sm text-center text-muted-foreground">No new notifications.</div>
            ) : (
                <div className="space-y-2 p-1">
                    {invitations.map(inv => (
                        <Card key={inv.id} className="border-none shadow-none">
                            <CardContent className="p-3">
                                <p className="text-sm mb-2">
                                    <span className="font-semibold">{inv.inviterName}</span> invited you to join <span className="font-semibold">{inv.companyName}</span> as a(n) <span className="font-semibold">{inv.role}</span>.
                                </p>
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="outline" className="h-7" onClick={() => handleInvitation(inv.id, false)}>
                                        <X className="h-4 w-4 mr-1" />
                                        Reject
                                    </Button>
                                    <Button size="sm" className="h-7" onClick={() => handleInvitation(inv.id, true)}>
                                        <Check className="h-4 w-4 mr-1" />
                                        Accept
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
