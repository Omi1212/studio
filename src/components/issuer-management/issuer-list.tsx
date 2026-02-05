'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Issuer } from '@/lib/types';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreVertical, Plus, Search, Copy, Edit, Power, PowerOff } from 'lucide-react';
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

function getStatusBadge(status: Issuer['status']) {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>;
    case 'inactive':
      return <Badge variant="destructive">Inactive</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

function IssuerTableRow({ issuer, onToggleStatus, onCopy }: { issuer: Issuer, onToggleStatus: (id: string) => void, onCopy: (text: string) => void }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{issuer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{issuer.name}</p>
            <p className="text-sm text-muted-foreground">{issuer.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex items-center gap-1">
            <span className="font-mono">{issuer.walletAddress.slice(0, 7)}...{issuer.walletAddress.slice(-4)}</span>
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onCopy(issuer.walletAddress)}>
                <Copy className="h-3 w-3" />
            </Button>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell text-center">{issuer.issuedTokens}</TableCell>
      <TableCell className="hidden md:table-cell text-center">{issuer.pendingTokens}</TableCell>
      <TableCell className="hidden sm:table-cell">{getStatusBadge(issuer.status)}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/issuer-management/${issuer.id}`}>View Details</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href={`/issuer-management/${issuer.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
             <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                {issuer.status === 'active' ? 'Set as Inactive' : 'Set as Active'}
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will change the status of the issuer "{issuer.name}" to {issuer.status === 'active' ? 'Inactive' : 'Active'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onToggleStatus(issuer.id)}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </TableCell>
    </TableRow>
  );
}


export default function IssuerList() {
  const [issuers, setIssuers] = useState<Issuer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchIssuers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/issuers');
        const data = await response.json();
        setIssuers(data);
      } catch (error) {
        console.error("Failed to fetch issuers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssuers();
  }, []);

  const filteredIssuers = useMemo(() => {
    let filtered = [...issuers];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(issuer => issuer.status === statusFilter);
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(issuer => 
        issuer.name.toLowerCase().includes(lowercasedQuery) ||
        issuer.email.toLowerCase().includes(lowercasedQuery) ||
        issuer.walletAddress.toLowerCase().includes(lowercasedQuery)
      );
    }

    return filtered;
  }, [issuers, searchQuery, statusFilter]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredIssuers.length / ITEMS_PER_PAGE);
  const paginatedIssuers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIssuers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredIssuers, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleToggleStatus = (id: string) => {
    let updatedIssuer: Issuer | undefined;
    const updatedIssuers = issuers.map(issuer => {
      if (issuer.id === id) {
        updatedIssuer = { ...issuer, status: issuer.status === 'active' ? 'inactive' : 'active' };
        return updatedIssuer;
      }
      return issuer;
    });
    setIssuers(updatedIssuers);
    if (updatedIssuer) {
        toast({
            title: "Status Updated",
            description: `Issuer "${updatedIssuer.name}" is now ${updatedIssuer.status}. (Change not persisted)`
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
        <h1 className="text-3xl font-headline font-semibold">Issuer Management</h1>
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
        <h1 className="text-3xl font-headline font-semibold">Issuer Management</h1>
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
        </div>
      </div>


       {paginatedIssuers.length === 0 ? (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <Plus className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No issuers found</h2>
            <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' ? "Try adjusting your search or filter." : "Get started by adding a new issuer."}
            </p>
             <Button asChild>
                <Link href="/issuer-management/new">Add Issuer</Link>
            </Button>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issuer</TableHead>
                <TableHead className="hidden lg:table-cell">Wallet</TableHead>
                <TableHead className="hidden md:table-cell text-center">Issued Tokens</TableHead>
                 <TableHead className="hidden md:table-cell text-center">Pending Tokens</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedIssuers.map(issuer => (
                <AlertDialog key={issuer.id}>
                  <IssuerTableRow issuer={issuer} onToggleStatus={handleToggleStatus} onCopy={handleCopy} />
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
