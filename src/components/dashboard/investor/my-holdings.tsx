'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import AssetIcon from '@/components/ui/asset-icon';
import Link from 'next/link';

export default function MyHoldings() {
    const [holdings, setHoldings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/api/investors/inv-001')
            .then(res => res.json())
            .then(investor => {
                setHoldings(investor?.holdings || []);
            }).catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Card className="h-80 animate-pulse bg-muted/50"></Card>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>My Holdings</CardTitle>
                    <CardDescription>Your current asset investments.</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href="/my-assets">View All</Link>
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead className="hidden sm:table-cell text-right">Price</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                            <TableHead className="hidden sm:table-cell text-right">Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holdings.map(holding => (
                            <TableRow key={holding.assetId}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <AssetIcon asset={holding} className="h-8 w-8" />
                                        <div>
                                            <p className="font-medium">{holding.assetTicker}</p>
                                            <p className="text-sm text-muted-foreground">{holding.assetName}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-right font-mono">${holding.value.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-mono">
                                    <p className="font-medium">{holding.amount.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground sm:hidden">${(holding.amount * holding.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-right font-mono">${(holding.amount * holding.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
