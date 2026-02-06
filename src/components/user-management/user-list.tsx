

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ViewMode, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreVertical, LayoutGrid, List, Plus, Search, Copy, Edit, Power, PowerOff } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ITEMS_PER_PAGE = 10;

function getStatusBadge(status: User['status']) {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>;
    case 'inactive':
      return <Badge variant="destructive">Inactive</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

function getKycBadge(status: User['kycStatus']) {
  switch (status) {
    case 'verified':
      return <Badge variant="outline" className="text-green-400 border-green-400">Verified</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'rejected':
       return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}


function UserCard({ user, onToggleStatus, onCopy }: { user: User, onToggleStatus: (id: string) => void, onCopy: (text: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/user-management/${user.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                </DropdownMenuItem>
                 <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        {user.status === 'active' ? 
                            <><PowerOff className="mr-2 h-4 w-4" />Set Inactive</> : 
                            <><Power className="mr-2 h-4 w-4" />Set Active</>
                        }
                    </DropdownMenuItem>
                </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">Role</span>
          <span className="font-medium capitalize">{user.role}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">KYC Status</span>
          {getKycBadge(user.kycStatus)}
        </div>
        <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Wallet</span>
            <div className="flex items-center gap-1">
                <span className="font-medium font-mono truncate">{user.walletAddress.slice(0, 7)}...{user.walletAddress.slice(-4)}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onCopy(user.walletAddress)}>
                    <Copy className="h-3 w-3" />
                </Button>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
           <Link href={`/user-management/${user.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function UserTableRow({ user, onToggleStatus, onCopy }: { user: User, onToggleStatus: (id: string) => void, onCopy: (text: string) => void }) {
  const router = useRouter();
  return (
    <TableRow onClick={() => router.push(`/user-management/${user.id}`)} className="cursor-pointer">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </TableCell>
       <TableCell className="hidden sm:table-cell capitalize">{user.role}</TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex items-center gap-1">
            <span className="font-mono">{user.walletAddress.slice(0, 7)}...{user.walletAddress.slice(-4)}</span>
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onCopy(user.walletAddress);}}>
                <Copy className="h-3 w-3" />
            </Button>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{getKycBadge(user.kycStatus)}</TableCell>
      <TableCell className="hidden sm:table-cell">{getStatusBadge(user.status)}</TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/user-management/${user.id}`}>View Details</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href={`/user-management/${user.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
             <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                {user.status === 'active' ? 'Set as Inactive' : 'Set as Active'}
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will change the status of the user "{user.name}" to {user.status === 'active' ? 'Inactive' : 'Active'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onToggleStatus(user.id)}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </TableCell>
    </TableRow>
  );
}


export default function UserList({ view, setView }: { view: ViewMode, setView: (mode: ViewMode) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (roleFilter !== 'all') {
        filtered = filtered.filter(user => user.role === roleFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user.walletAddress.toLowerCase().includes(lowercasedQuery)
      );
    }

    return filtered;
  }, [users, searchQuery, roleFilter, statusFilter]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const targetUser = users.find(user => user.id === id);
    if (!targetUser) return;

    const newStatus = targetUser.status === 'active' ? 'inactive' : 'active';
    
    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error('Failed to update status');

        const updatedUser = await response.json();
        setUsers(prev => prev.map(user => (user.id === id ? updatedUser : user)));
        
        toast({
            title: "Status Updated",
            description: `User "${updatedUser.name}" is now ${updatedUser.status}.`
        });
    } catch(error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not update user status.'
        });
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard."
    });
  }


  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-headline font-semibold">User Management</h1>
        <Card className="h-64 animate-pulse bg-muted/50"></Card>
      </div>
    );
  }
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-between items-center p-4">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-semibold">User Management</h1>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, email, wallet..."
                    className="pl-8 w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
             <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="issuer">Issuer</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                </SelectContent>
            </Select>
             <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>
            <div className="hidden sm:flex items-center gap-1 bg-muted p-1 rounded-lg ml-auto">
                <Button
                    variant={view === 'card' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setView('card')}
                    aria-label="Card View"
                >
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                    variant={view === 'table' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setView('table')}
                    aria-label="Table View"
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>


       {paginatedUsers.length === 0 ? (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <Plus className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No users found</h2>
            <p className="text-muted-foreground mb-4">
                {searchQuery || roleFilter !== 'all' || statusFilter !== 'all' ? "Try adjusting your search or filters." : "Get started by adding a new user."}
            </p>
             <Button asChild>
                <Link href="/user-management/new">Add User</Link>
            </Button>
        </div>
      ) : view === 'card' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedUsers.map(user => (
              <AlertDialog key={user.id}>
                  <UserCard user={user} onToggleStatus={handleToggleStatus} onCopy={handleCopy} />
              </AlertDialog>
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="hidden lg:table-cell">Wallet</TableHead>
                <TableHead className="hidden md:table-cell">KYC</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map(user => (
                <AlertDialog key={user.id}>
                  <UserTableRow user={user} onToggleStatus={handleToggleStatus} onCopy={handleCopy} />
                </AlertDialog>
              ))}
            </TableBody>
          </Table>
          {renderPagination()}
        </Card>
      )}
    </div>
  )
}
