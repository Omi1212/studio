

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { investorsData } from '@/lib/data';
import type { ViewMode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreVertical, LayoutGrid, List, Search, Check, X, FilePenLine } from 'lucide-react';
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

type WhitelistRequest = typeof investorsData[0];
const ITEMS_PER_PAGE = 10;

function getStatusBadge(investor: WhitelistRequest) {
  switch (investor.status) {
    case 'accepted':
      return <Badge variant="outline" className="text-green-400 border-green-400">Accepted</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

function RequestCard({ request, onApprove, onReject }: { request: WhitelistRequest, onApprove: (id: string) => void, onReject: (id: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{request.name}</CardTitle>
              <CardDescription>{request.email}</CardDescription>
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
                <Link href={`/whitelisting-requests/${request.id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/whitelisting-requests/${request.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Wallet</span>
            <span className="font-medium font-mono truncate">{request.walletAddress.slice(0, 7)}...{request.walletAddress.slice(-4)}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">Joined Date</span>
          <span className="font-medium">{new Date(request.joinedDate).toLocaleDateString()}</span>
        </div>
         <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Status</span>
            {getStatusBadge(request)}
        </div>
      </CardContent>
      {request.status === 'pending' && (
        <CardFooter className="flex gap-2">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will reject the request from {request.name}. This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onReject(request.id)}>Confirm Reject</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button className="w-full" onClick={() => onApprove(request.id)}>
                <Check className="mr-2 h-4 w-4" /> Approve
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}

function RequestTableRow({ request, onApprove, onReject }: { request: WhitelistRequest, onApprove: (id: string) => void, onReject: (id: string) => void }) {
  const router = useRouter();
  return (
    <TableRow onClick={() => router.push(`/whitelisting-requests/${request.id}`)} className="cursor-pointer">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{request.name}</p>
            <p className="text-sm text-muted-foreground">{request.email}</p>
          </div>
        </div>
      </TableCell>
       <TableCell className="hidden lg:table-cell">
        <span className="font-mono">{request.walletAddress.slice(0, 15)}...{request.walletAddress.slice(-4)}</span>
       </TableCell>
       <TableCell className="hidden md:table-cell">
        {new Date(request.joinedDate).toLocaleDateString()}
       </TableCell>
       <TableCell className="hidden sm:table-cell">{getStatusBadge(request)}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            {request.status === 'pending' && (
                <>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">Reject</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This will reject the request from {request.name}. This cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onReject(request.id)}>Confirm Reject</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button size="sm" onClick={() => onApprove(request.id)}>Approve</Button>
                </>
            )}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                <Link href={`/whitelisting-requests/${request.id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                <Link href={`/whitelisting-requests/${request.id}/edit`}>Edit</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}


export default function RequestList({ view, setView }: { view: ViewMode, setView: (mode: ViewMode) => void }) {
  const [requests, setRequests] = useState<WhitelistRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const storedInvestorsRaw = localStorage.getItem('investors');
    const allInvestors = storedInvestorsRaw ? JSON.parse(storedInvestorsRaw) : investorsData;
    setRequests(allInvestors);
    setLoading(false);
  }, []);

  const filteredRequests = useMemo(() => {
    let filtered = [...requests];

    if (statusFilter !== 'all') {
        filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        req.name.toLowerCase().includes(lowercasedQuery) ||
        req.email.toLowerCase().includes(lowercasedQuery) ||
        req.walletAddress.toLowerCase().includes(lowercasedQuery)
      );
    }

    return filtered;
  }, [requests, searchQuery, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const updateRequestStatus = (id: string, status: 'accepted' | 'rejected') => {
    const allInvestors: WhitelistRequest[] = JSON.parse(localStorage.getItem('investors') || '[]');
    const updatedInvestors = allInvestors.map((inv: WhitelistRequest) => inv.id === id ? { ...inv, status } : inv);
    localStorage.setItem('investors', JSON.stringify(updatedInvestors));
    setRequests(updatedInvestors);

    toast({
        title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `The request for ${requests.find(r=>r.id===id)?.name} has been ${status}.`
    });
  }

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'accepted');
  };
  
  const handleReject = (id: string) => {
    updateRequestStatus(id, 'rejected');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-headline font-semibold">Whitelisting Requests</h1>
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
        <h1 className="text-3xl font-headline font-semibold">Whitelisting Requests</h1>
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
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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

       {paginatedRequests.length === 0 ? (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <FilePenLine className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Requests Found</h2>
            <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' ? "Try adjusting your search or filter." : "There are no new whitelisting requests at this time."}
            </p>
        </div>
      ) : view === 'card' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedRequests.map(request => (
              <RequestCard key={request.id} request={request} onApprove={handleApprove} onReject={handleReject} />
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
                <TableHead className="hidden lg:table-cell">Wallet</TableHead>
                <TableHead className="hidden md:table-cell">Request Date</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map(request => (
                  <RequestTableRow key={request.id} request={request} onApprove={handleApprove} onReject={handleReject} />
              ))}
            </TableBody>
          </Table>
          {renderPagination()}
        </Card>
      )}
    </div>
  )
}
