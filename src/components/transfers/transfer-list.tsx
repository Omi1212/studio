
'use client';

import { useState, useEffect, useMemo } from 'react';
import { transfersData } from '@/lib/data';
import type { Transfer } from '@/lib/types';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';


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

export default function TransferList() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTransfers(transfersData);
    setLoading(false);
  }, []);

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
                <TableHead>Tx Id</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead></TableHead>
                <TableHead>To</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.txId}>
                  <TableCell className="font-mono">{transfer.txId}</TableCell>
                  <TableCell>{getTypeBadge(transfer.type)}</TableCell>
                  <TableCell className="font-mono">{transfer.from}</TableCell>
                  <TableCell className="px-0 text-muted-foreground"><ArrowRight className="h-4 w-4" /></TableCell>
                  <TableCell className={cn("font-mono", transfer.type === 'Burn' && 'text-red-500')}>{transfer.to}</TableCell>
                  <TableCell className={cn("font-mono text-right", getAmountClass(transfer.type))}>
                    {transfer.amount.toLocaleString()} {transfer.tokenTicker}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{transfer.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
