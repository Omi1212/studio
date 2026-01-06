'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { transactionData } from '@/lib/data';
import { ArrowDownLeft, ArrowUpRight, ExternalLink, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ITEMS_PER_PAGE = 10;

export default function AllTransactions({ className }: { className?: string }) {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredTransactions = React.useMemo(() => {
    return transactionData
      .filter(tx => filter === 'all' || tx.direction === filter)
      .filter(tx => search === '' || tx.address.toLowerCase().includes(search.toLowerCase()));
  }, [filter, search]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const paginatedTransactions = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="p-4 sm:p-6 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by address..." 
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <Select value={filter} onValueChange={(value) => {
              setFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in">Receive</SelectItem>
                <SelectItem value="out">Send</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
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
                  <TableCell className="text-muted-foreground hidden sm:table-cell">{transaction.date}</TableCell>
                  <TableCell className="text-right">
                    <p
                      className={cn(
                        'font-medium',
                        transaction.direction === 'in'
                          ? 'text-green-500'
                          : 'text-red-500'
                      )}
                    >
                      {transaction.direction === 'in' ? '+' : '-'}
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">
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
