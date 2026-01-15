
'use client';

import { useState, useEffect, useMemo } from 'react';
import { exampleTokens, issuersData } from '@/lib/data';
import type { TokenDetails, Issuer } from '@/lib/types';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Search, Check, X, FilePenLine } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import TokenIcon from '../ui/token-icon';

type CombinedRequest = TokenDetails & { issuer?: Issuer };

const ITEMS_PER_PAGE = 10;

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
};

function RequestTableRow({ request, onApprove, onReject }: { request: CombinedRequest, onApprove: (id: string) => void, onReject: (id: string) => void }) {
  return (
    <TableRow>
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
        {networkMap[request.network] || request.network}
      </TableCell>
       <TableCell className="hidden sm:table-cell font-mono">
        {request.maxSupply.toLocaleString()}
       </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => onReject(request.id)}>
                 <X className="mr-2 h-4 w-4" /> Reject
            </Button>
            <Button size="sm" onClick={() => onApprove(request.id)}>
                <Check className="mr-2 h-4 w-4" /> Approve
            </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}


export default function RequestList() {
  const [requests, setRequests] = useState<CombinedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    const allTokens: TokenDetails[] = [...exampleTokens, ...storedTokens];
    const pendingTokens = allTokens.filter(token => token.status === 'pending');
    
    const combinedRequests: CombinedRequest[] = pendingTokens.map(token => ({
      ...token,
      issuer: issuersData.find(issuer => issuer.id === token.issuerId)
    }));

    setRequests(combinedRequests);
    setLoading(false);
  }, []);

  const filteredRequests = useMemo(() => {
    let filtered = [...requests];
    
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
  }, [requests, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
    const updatedTokens = allTokens.map((token: TokenDetails) => 
        token.id === id ? { ...token, status } : token
    );
    localStorage.setItem('createdTokens', JSON.stringify(updatedTokens));

    // Update local state to remove the processed request
    setRequests(prev => prev.filter(req => req.id !== id));

    toast({
        title: `Request ${status === 'active' ? 'Approved' : 'Rejected'}`,
        description: `The token request has been ${status === 'active' ? 'approved' : 'rejected'}.`
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
        </div>
      </div>

       {paginatedRequests.length === 0 ? (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <FilePenLine className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Pending Requests</h2>
            <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search or filter." : "There are no new token requests awaiting approval."}
            </p>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead className="hidden md:table-cell">Issuer</TableHead>
                <TableHead className="hidden lg:table-cell">Network</TableHead>
                <TableHead className="hidden sm:table-cell">Max Supply</TableHead>
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
