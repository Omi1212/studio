'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ITEMS_PER_PAGE = 6;

function getRoleBadge(role: User['role']) {
  switch (role) {
    case 'superadmin':
      return <Badge variant="outline" className="text-primary border-primary bg-primary/10">OWNER</Badge>;
    case 'agent':
    case 'issuer':
      return <Badge variant="outline" className="text-blue-400 border-blue-400 bg-blue-500/10">ADMIN</Badge>;
    default:
      return <Badge variant="secondary">{role.toUpperCase()}</Badge>;
  }
}

export default function AccessList() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
        try {
            const response = await fetch(`/api/users?perPage=100`);
            const data = await response.json();
            const teamMembers = data.data.filter((u: User) => u.role === 'agent' || u.role === 'issuer');
            setUsers(teamMembers);
            setTotalUsers(teamMembers.length);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchUsers();

  }, []);
  
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-end items-center p-4 gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Items per page:</span>
            <Select value={String(itemsPerPage)} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <span className="text-sm text-muted-foreground">
          {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalUsers)} of ${totalUsers}`}
        </span>
        <div className="flex gap-1">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
             className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
             className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
            <Button 
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                 className="h-8 w-8 p-0"
            >
                <ChevronsRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
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
                    {paginatedUsers.map(user => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell className="text-right">
                                {user.role !== 'superadmin' && (
                                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                {renderPagination()}
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
  )
}
