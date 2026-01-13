
'use client';

import { useState, useEffect, useMemo } from 'react';
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

type WhitelistRequest = typeof investorsData[0];

function getStatusBadge(investor: WhitelistRequest) {
  switch (investor.status) {
    case 'whitelisted':
      return <Badge variant="outline" className="text-green-400 border-green-400">Whitelisted</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
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
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="w-full" onClick={() => onReject(request.id)}>
            <X className="mr-2 h-4 w-4" /> Reject
        </Button>
        <Button className="w-full" onClick={() => onApprove(request.id)}>
            <Check className="mr-2 h-4 w-4" /> Approve
        </Button>
      </CardFooter>
    </Card>
  );
}

function RequestTableRow({ request, onApprove, onReject }: { request: WhitelistRequest, onApprove: (id: string) => void, onReject: (id: string) => void }) {
  return (
    <TableRow>
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
      <TableCell className="text-right flex items-center justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => onReject(request.id)}>Reject</Button>
        <Button size="sm" onClick={() => onApprove(request.id)}>Approve</Button>
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

  useEffect(() => {
    const storedInvestorsRaw = localStorage.getItem('investors');
    const allInvestors = storedInvestorsRaw ? JSON.parse(storedInvestorsRaw) : investorsData;
    setRequests(allInvestors);
    setLoading(false);
  }, []);

  const filteredRequests = useMemo(() => {
    let filtered = requests.filter(req => req.status === 'pending');

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        req.name.toLowerCase().includes(lowercasedQuery) ||
        req.email.toLowerCase().includes(lowercasedQuery) ||
        req.walletAddress.toLowerCase().includes(lowercasedQuery)
      );
    }

    return filtered;
  }, [requests, searchQuery]);

  const updateRequestStatus = (id: string, status: 'whitelisted' | 'rejected') => {
    const updatedRequests = requests.map(req => {
      if (req.id === id) {
        return { ...req, status: status === 'whitelisted' ? 'whitelisted' : 'pending' };
      }
      return req;
    });

    const allInvestors = JSON.parse(localStorage.getItem('investors') || '[]');
    const updatedInvestors = allInvestors.map((inv: WhitelistRequest) => inv.id === id ? { ...inv, status } : inv);
    localStorage.setItem('investors', JSON.stringify(updatedInvestors));
    setRequests(updatedInvestors);

    toast({
        title: `Request ${status === 'whitelisted' ? 'Approved' : 'Rejected'}`,
        description: `The request for ${requests.find(r=>r.id===id)?.name} has been ${status === 'whitelisted' ? 'approved' : 'rejected'}.`
    });
  }

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'whitelisted');
  };
  
  const handleReject = (id: string) => {
    // For now, "rejecting" just keeps it as pending, but could be a different status
    // To effectively remove it from this list, we change its status to 'whitelisted' or another status
    const targetRequest = requests.find(req => req.id === id);
    if (!targetRequest) return;
    
    // This is a placeholder for a real rejection logic
    toast({
        title: 'Request Rejected',
        variant: 'destructive',
        description: `The request for "${targetRequest.name}" has been rejected.`,
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-headline font-semibold">Whitelisting Requests</h1>
        <Card className="h-64 animate-pulse bg-muted/50"></Card>
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

       {filteredRequests.length === 0 ? (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <FilePenLine className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Pending Requests</h2>
            <p className="text-muted-foreground mb-4">
                {searchQuery ? "No requests match your search." : "There are no new whitelisting requests at this time."}
            </p>
        </div>
      ) : view === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRequests.map(request => (
             <RequestCard key={request.id} request={request} onApprove={handleApprove} onReject={handleReject} />
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden lg:table-cell">Wallet</TableHead>
                <TableHead className="hidden md:table-cell">Request Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map(request => (
                  <RequestTableRow key={request.id} request={request} onApprove={handleApprove} onReject={handleReject} />
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
