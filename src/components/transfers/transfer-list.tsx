
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { transfersData, exampleTokens } from '@/lib/data';
import type { Transfer, TokenDetails } from '@/lib/types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ArrowRight, Search, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

const ITEMS_PER_PAGE = 10;

function getAmountClass(type: Transfer['type']) {
    switch (type) {
        case 'Mint':
            return 'text-green-500';
        case 'Burn':
            return 'text-red-500';
        default:
            return 'text-foreground';
    }
}

function getTypeBadge(type: Transfer['type']) {
    switch (type) {
        case 'Mint':
            return <Badge variant="outline" className="text-green-400 border-green-400">{type}</Badge>;
        case 'Burn':
            return <Badge variant="destructive">{type}</Badge>;
        case 'Transfer':
            return <Badge variant="secondary">{type}</Badge>;
        default:
            return <Badge>{type}</Badge>;
    }
}

export default function TransferList({ searchQuery, typeFilter }: { searchQuery: string, typeFilter: string }) {
  const router = useRouter();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedToken, setSelectedToken] = useState<TokenDetails | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);


  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    setTransfers(transfersData);
    
    const handleTokenChange = () => {
        const storedTokenId = localStorage.getItem('selectedTokenId');
        if (storedTokenId) {
            const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
            const allTokens: TokenDetails[] = [...exampleTokens, ...storedTokens];
            const foundToken = allTokens.find(t => t.id === storedTokenId);
            setSelectedToken(foundToken || null);
        } else {
            setSelectedToken(null);
        }
    };

    handleTokenChange();
    window.addEventListener('tokenChanged', handleTokenChange);
    setLoading(false);

    return () => {
        window.removeEventListener('tokenChanged', handleTokenChange);
    };

  }, []);

  const filteredTransfers = useMemo(() => {
    let filtered = [...transfers];

    if ((userRole === 'issuer' || userRole === 'agent') && selectedToken) {
        filtered = filtered.filter(t => t.tokenTicker === selectedToken.tokenTicker);
    } else if ((userRole === 'issuer' || userRole === 'agent') && !selectedToken) {
        return []; // No token selected, show no transfers for these roles
    }
    // Investor role sees all their transfers, so no token filtering is applied here.

    if (typeFilter !== 'all') {
        filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.from.toLowerCase().includes(lowercasedQuery) ||
        t.to.toLowerCase().includes(lowercasedQuery)
      );
    }

    return filtered;
  }, [transfers, searchQuery, typeFilter, selectedToken, userRole]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, selectedToken]);

  const totalPages = Math.ceil(filteredTransfers.length / ITEMS_PER_PAGE);

  const paginatedTransfers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransfers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransfers, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  if (loading) {
    return (
      <Card className="h-96 animate-pulse bg-muted/50"></Card>
    );
  }

  if (paginatedTransfers.length === 0) {
      const noTransfersMessage = () => {
          if ((userRole === 'issuer' || userRole === 'agent') && !selectedToken) {
              return {
                  title: "No Token Selected",
                  description: "Please select a token from the sidebar to view its transfers."
              }
          }
          if (searchQuery || typeFilter !== 'all') {
              return {
                  title: "No Transfers Found",
                  description: "Try adjusting your search or filter."
              }
          }
          return {
              title: "No Transfers Found",
              description: `There are no transfers for ${selectedToken?.tokenTicker} at this time.`
          }
      }
      return (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <ArrowRightLeft className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{noTransfersMessage().title}</h2>
            <p className="text-muted-foreground mb-4">
                {noTransfersMessage().description}
            </p>
        </div>
      )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead></TableHead>
                <TableHead>To</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransfers.map((transfer) => (
                <TableRow 
                  key={transfer.txId} 
                  onClick={() => router.push(`/transfers/${transfer.txId}`)}
                  className="cursor-pointer"
                >
                  <TableCell>{getTypeBadge(transfer.type)}</TableCell>
                  <TableCell className="font-mono">{transfer.from}</TableCell>
                  <TableCell className="px-0 text-muted-foreground"><ArrowRight className="h-4 w-4" /></TableCell>
                  <TableCell className={cn("font-mono", transfer.type === 'Burn' && 'text-red-500')}>{transfer.to}</TableCell>
                  <TableCell className={cn("font-mono text-right", getAmountClass(transfer.type))}>
                    {transfer.amount.toLocaleString()} {transfer.tokenTicker}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{new Date(transfer.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
         {totalPages > 1 && (
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
        )}
      </CardContent>
    </Card>
  );
}
