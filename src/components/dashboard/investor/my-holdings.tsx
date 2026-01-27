'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { investorsData } from '@/lib/data';
import TokenIcon from '@/components/ui/token-icon';
import Link from 'next/link';

export default function MyHoldings() {
    const investor = investorsData.find(inv => inv.id === 'inv-001');
    const holdings = investor?.holdings || [];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>My Holdings</CardTitle>
                    <CardDescription>Your current token investments.</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href="/my-tokens">View All</Link>
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holdings.map(holding => (
                            <TableRow key={holding.tokenId}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <TokenIcon token={holding} className="h-8 w-8" />
                                        <div>
                                            <p className="font-medium">{holding.tokenTicker}</p>
                                            <p className="text-sm text-muted-foreground">{holding.tokenName}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">${holding.value.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-mono">{holding.amount.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-mono">${(holding.amount * holding.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
