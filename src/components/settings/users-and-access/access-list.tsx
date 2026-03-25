'use client';

import { useState, useEffect } from 'react';
import type { User, Invitation, Company } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';

function RoleBadge({ role }: { role: string }) {
    let badgeClass = "text-primary border-primary bg-primary/10";
    if (role === 'Owner') {
        badgeClass = "text-amber-500 border-amber-500 bg-amber-500/10";
    }

    return (
        <Badge variant="outline" className={badgeClass}>
            {role}
        </Badge>
    );
}

export default function AccessList() {
  const [team, setTeam] = useState<(User & { displayRole: string })[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const companyId = localStorage.getItem('selectedCompanyId');

    if (!companyId) {
        setLoading(false);
        return;
    }

    setLoading(true);
    Promise.all([
        fetch(`/api/users?perPage=999`).then(res => res.json()),
        fetch(`/api/invitations?companyId=${companyId}`).then(res => res.json())
    ]).then(([usersResponse, invitationsResponse]) => {
        const companyUsers = (usersResponse.data || []).filter((u: User) => u.companyId?.includes(companyId) && u.role !== 'investor');

        const processedTeam = companyUsers.map((user: User) => {
            const displayRole = user.companyRoles?.[companyId] || user.role;
            return { ...user, displayRole };
        });

        processedTeam.sort((a, b) => {
            if (a.displayRole === 'Owner') return -1;
            if (b.displayRole === 'Owner') return 1;
            if (a.displayRole === 'Admin') return -1;
            if (b.displayRole === 'Admin') return 1;
            return a.name.localeCompare(b.name);
        });

        setTeam(processedTeam);
        setPendingInvitations(invitationsResponse || []);

    }).catch(console.error).finally(() => setLoading(false));

  }, []);

  if (loading) {
    return (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                Loading...
            </CardContent>
        </Card>
    );
  }

  return (
    <Tabs defaultValue="users">
        <div className="flex justify-between items-center mb-4">
            <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="invitations">Invitations</TabsTrigger>
            </TabsList>
             <Button asChild>
                <Link href="/settings/users-and-access/invite">
                    <Plus className="mr-2 h-4 w-4" />
                    Invite users
                </Link>
            </Button>
        </div>
      
        <TabsContent value="users">
             <Card>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {team.length > 0 ? (
                        team.map((member) => (
                             <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>
                                    <RoleBadge role={member.displayRole} />
                                </TableCell>
                                <TableCell className="text-right">
                                    {member.displayRole !== 'Owner' && (
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                         <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No users found for this company.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </Card>
        </TabsContent>
        <TabsContent value="invitations">
            <Card>
                {pendingInvitations.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingInvitations.map((invitation) => (
                                <TableRow key={invitation.id}>
                                    <TableCell className="font-medium">{invitation.email}</TableCell>
                                    <TableCell>
                                        <RoleBadge role={invitation.role} />
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">
                                            Resend
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <CardContent className="p-6 text-center text-muted-foreground">
                        No pending invitations.
                    </CardContent>
                )}
            </Card>
        </TabsContent>
    </Tabs>
  );
}
