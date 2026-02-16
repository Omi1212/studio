'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AccessList() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
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
                    {user ? (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-primary border-primary bg-primary/10">OWNER</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {/* No actions for owner */}
                            </TableCell>
                        </TableRow>
                    ) : (
                         <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No user found.
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
