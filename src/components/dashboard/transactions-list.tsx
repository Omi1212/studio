'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

type Transaction = {
    id: number;
    type: string;
    address: string;
    date: string;
    amount: number;
    currency: string;
    direction: 'in' | 'out';
};

export default function TransactionsList({ className, limit }: { className?: string; limit?: number }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({
        page: '1',
        perPage: limit ? limit.toString() : '7',
    });
    fetch(`/api/transactions?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data.data);
      })
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) {
    return <Skeleton className={cn("h-[400px]", className)} />;
  }

  return (
    <Card className={className}>
      <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Transaction history</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <a href="/transactions">View All</a>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 sm:px-6 w-[40%]">Transaction</TableHead>
                <TableHead className="hidden sm:table-cell px-4 sm:px-6 w-[30%]">Date</TableHead>
                <TableHead className="text-right px-4 sm:px-6 w-[20%]">Amount</TableHead>
                <TableHead className="hidden md:table-cell px-4 sm:px-6 w-[10%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                       <div
                        className={cn(
                          'flex-center h-8 w-8 rounded-full bg-muted',
                          transaction.direction === 'in'
                            ? 'text-green-500'
                            : 'text-red-500'
                        )}
                      >
                        {transaction.direction === 'in' ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-28 sm:max-w-xs">
                          {transaction.address}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell px-4 sm:px-6">{transaction.date}</TableCell>
                  <TableCell className="text-right px-4 sm:px-6">
                     <p
                      className={cn(
                        'font-medium',
                        transaction.direction === 'in'
                          ? 'text-green-500'
                          : 'text-red-500'
                      )}
                    >
                      {transaction.direction === 'in' ? '+' : '-'}
                      {transaction.amount} {transaction.currency}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right px-4 sm:px-6">
                      <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Open on Sparkscan</span>
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
