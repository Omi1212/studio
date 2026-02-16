'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock user data to simulate a team
const mockTeamMembers: Partial<User>[] = [
    {
        id: 'team-member-1',
        name: 'John Doe',
        email: 'john.d@example.com',
        role: 'agent',
    },
    {
        id: 'team-member-2',
        name: 'Samantha Green',
        email: 'samantha.g@example.com',
        role: 'agent',
    }
];

function RoleBadge({ role, isOwner }: { role: string, isOwner?: boolean }) {
    if (isOwner) {
        return <Badge variant="outline" className="text-primary border-primary bg-primary/10">OWNER</Badge>;
    }
    
    switch (role.toUpperCase()) {
        case 'ADMIN':
            return <Badge variant="outline" className="text-orange-400 border-orange-400">ADMIN</Badge>;
        case 'COLLABORATOR':
            return <Badge variant="secondary">COLLABORATOR</Badge>;
        default:
            return <Badge variant="secondary">{role.toUpperCase()}</Badge>;
    }
}

export default function AccessList() {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<(Partial<User> & { displayRole: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const fullTeam = [
            { ...parsedUser, displayRole: 'Owner' },
            { ...mockTeamMembers[0], displayRole: 'Admin' },
            { ...mockTeamMembers[1], displayRole: 'Collaborator' },
        ];
        setTeam(fullTeam);

    } else {
        // Fallback for when no user is logged in
        const fullTeam = [
            { ...mockTeamMembers[0], displayRole: 'Admin' },
            { ...mockTeamMembers[1], displayRole: 'Collaborator' },
        ];
         setTeam(fullTeam);
    }
    setLoading(false);
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
             <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Invite users
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
                        team.map((member, index) => (
                             <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>
                                    <RoleBadge role={member.displayRole} isOwner={member.displayRole === 'Owner'} />
                                </TableCell>
                                <TableCell className="text-right">
                                    {/* No actions for anyone in this demo */}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                         <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </Card>
        </TabsContent>
        <TabsContent value="invitations">
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No pending invitations.
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  );
}
