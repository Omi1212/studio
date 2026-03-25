'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/types';
import AssetIcon from '../ui/asset-icon';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function InvestorTransactions({ investor }: { investor: User }) {
    const transactions = investor.transactions || [];

    if (transactions.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                This investor has no transaction history.
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((tx: any) => (
                    <TableRow key={tx.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                    'flex-center h-8 w-8 rounded-full bg-muted shrink-0',
                                    tx.type === 'Buy' ? 'text-green-500' : 'text-red-500'
                                    )}
                                >
                                    {tx.type === 'Buy' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                </div>
                                <span className="font-medium">{tx.type}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <AssetIcon asset={tx.asset} className="h-6 w-6" />
                                <span className="font-medium text-primary">{tx.asset.assetTicker}</span>
                            </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                            {new Date(tx.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                            {tx.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className={cn("text-right font-mono hidden md:table-cell", tx.type === 'Buy' ? 'text-green-500' : 'text-red-500')}>
                        {tx.type === 'Buy' ? '+' : '-'} ${(tx.amount * tx.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
