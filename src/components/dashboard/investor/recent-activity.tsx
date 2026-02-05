'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function RecentActivity() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/api/investors/inv-001')
            .then(res => res.json())
            .then(investor => {
                setTransactions(investor?.transactions.slice(0, 5) || []);
            }).catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Card className="h-80 animate-pulse bg-muted/50"></Card>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your last 5 transactions.</CardDescription>
                </div>
                 <Button asChild variant="outline" size="sm">
                    <Link href="/orders">View All</Link>
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction</TableHead>
                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right hidden md:table-cell">Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map(tx => (
                            <TableRow key={tx.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className={cn('flex-center h-8 w-8 rounded-full bg-muted', tx.type === 'Buy' ? 'text-green-500' : 'text-red-500')}>
                                            {tx.type === 'Buy' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="font-medium">{tx.type} {tx.token.tokenTicker}</p>
                                            <p className="text-sm text-muted-foreground">Order #{tx.id.slice(0,6)}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right font-mono">{tx.amount.toLocaleString()}</TableCell>
                                <TableCell className={cn("text-right font-mono hidden md:table-cell", tx.type === 'Buy' ? 'text-green-500' : 'text-red-500')}>
                                    {tx.type === 'Buy' ? '+' : '-'} ${(tx.amount * tx.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
