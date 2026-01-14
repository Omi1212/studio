
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { transfersData } from '@/lib/data';
import type { Transfer } from '@/lib/types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ArrowRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

const ITEMS_PER_PAGE = 5;

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

  useEffect(() => {
    setTransfers(transfersData);
    setLoading(false);
  }, []);

  const filteredTransfers = useMemo(() => {
    let filtered = [...transfers];

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
  }, [transfers, searchQuery, typeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter]);

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
