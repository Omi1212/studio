

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { exampleTokens, issuersData } from '@/lib/data';
import type { TokenDetails, Issuer, ViewMode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Search, Check, X, FilePenLine, MoreVertical, LayoutGrid, List, Copy } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import TokenIcon from '../ui/token-icon';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Link from 'next/link';

type CombinedRequest = TokenDetails & { issuer?: Issuer };

const ITEMS_PER_PAGE = 10;

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
};

function getStatusBadge(status: TokenDetails['status']) {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="text-green-400 border-green-400">Approved</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
     case 'draft':
      return <Badge variant="secondary">Draft</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

function RequestCard({ request }: { request: CombinedRequest }) {
  const { toast } = useToast();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <TokenIcon token={request} className="h-10 w-10" />
            <div>
              <CardTitle className="text-lg">{request.tokenName}</CardTitle>
              <CardDescription className="text-primary font-bold">{request.tokenTicker}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {request.issuer && (
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Issuer:</span>
            <span className="font-medium">{request.issuer.name}</span>
          </div>
        )}
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">Status</span>
          {getStatusBadge(request.status)}
        </div>
      </CardContent>
      <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/requests/${request.id}`}>View</Link>
          </Button>
      </CardFooter>
    </Card>
  );
}

function RequestTableRow({ request }: { request: CombinedRequest }) {
  const { toast } = useToast();
  const router = useRouter();
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard."
    });
  }

  return (
    <TableRow onClick={() => router.push(`/requests/${request.id}`)} className="cursor-pointer">
      <TableCell>
        <div className="flex items-center gap-3">
            <TokenIcon token={request} className="h-8 w-8" />
            <div>
                <p className="font-medium">{request.tokenName}</p>
                <p className="text-sm text-primary">{request.tokenTicker}</p>
            </div>
        </div>
      </TableCell>
       <TableCell className="hidden md:table-cell">
        {request.issuer ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{request.issuer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{request.issuer.name}</p>
                <p className="text-sm text-muted-foreground">{request.issuer.email}</p>
              </div>
            </div>
        ) : (
            <span className="text-muted-foreground">Unknown Issuer</span>
        )}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {request.issuer ? (
            <div className="flex items-center gap-1">
                <span className="font-mono">{request.issuer.walletAddress.slice(0, 7)}...{request.issuer.walletAddress.slice(-4)}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleCopy(request.issuer!.walletAddress);}}>
                    <Copy className="h-3 w-3" />
                </Button>
            </div>
        ) : (
            <span className="text-muted-foreground">--</span>
        )}
      </TableCell>
       <TableCell>
        {getStatusBadge(request.status)}
       </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/requests/${request.id}`}>View</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}


export default function RequestList({ view, setView }: { view: ViewMode, setView: (mode: ViewMode) => void }) {
  const [requests, setRequests] = useState<CombinedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    const allTokens: TokenDetails[] = [...exampleTokens, ...storedTokens].filter(token => token.status !== 'draft');
    
    let combinedRequests: CombinedRequest[] = allTokens.map(token => ({
      ...token,
      issuer: issuersData.find(issuer => issuer.id === token.issuerId)
    }));

    const statusOrder = { 'pending': 1, 'active': 2, 'rejected': 3 };
    combinedRequests.sort((a, b) => {
        const orderA = statusOrder[a.status as keyof typeof statusOrder] || 4;
        const orderB = statusOrder[b.status as keyof typeof statusOrder] || 4;
        return orderA - orderB;
    });

    setRequests(combinedRequests);
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
        req.tokenName.toLowerCase().includes(lowercasedQuery) ||
        req.tokenTicker.toLowerCase().includes(lowercasedQuery) ||
        req.issuer?.name.toLowerCase().includes(lowercasedQuery) ||
        req.issuer?.email.toLowerCase().includes(lowercasedQuery)
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


  const updateRequestStatus = (id: string, status: 'active' | 'rejected') => {
    const allTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    let tokenName = '';
    const updatedTokens = allTokens.map((token: TokenDetails) => {
        if (token.id === id) {
          tokenName = token.tokenName;
          return { ...token, status };
        }
        return token;
    });
    localStorage.setItem('createdTokens', JSON.stringify(updatedTokens));

    // Update local state
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));

    toast({
        title: `Request ${status === 'active' ? 'Approved' : 'Rejected'}`,
        description: `The token "${tokenName}" has been ${status === 'active' ? 'approved' : 'rejected'}.`
    });
  }

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'active');
  };
  
  const handleReject = (id: string) => {
    updateRequestStatus(id, 'rejected');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-headline font-semibold">Token Requests</h1>
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
        <h1 className="text-3xl font-headline font-semibold">Token Requests</h1>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by token or issuer..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Approved</SelectItem>
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
                {searchQuery || statusFilter !== 'all' ? "Try adjusting your search or filter." : "There are no token requests at this time."}
            </p>
        </div>
      ) : view === 'card' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead className="hidden md:table-cell">Issuer</TableHead>
                <TableHead className="hidden lg:table-cell">Wallet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map(request => (
                  <RequestTableRow key={request.id} request={request} />
              ))}
            </TableBody>
          </Table>
          {renderPagination()}
        </Card>
      )}
    </div>
  )
}
