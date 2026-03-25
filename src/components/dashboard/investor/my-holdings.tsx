'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import AssetIcon from '@/components/ui/asset-icon';
import Link from 'next/link';
import type { AssetDetails } from '@/lib/types';

export default function MyHoldings({ selectedCompanyId }: { selectedCompanyId: string | null }) {
    const [holdings, setHoldings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch('/api/investors/inv-001').then(res => res.json()),
            fetch('/api/assets?perPage=999').then(res => res.json())
        ]).then(([investor, assetsData]) => {
            const allAssets: AssetDetails[] = assetsData.data || [];
            let investorHoldings = investor?.holdings || [];

            if (selectedCompanyId) {
                const companyAssetIds = allAssets.filter(a => a.companyId === selectedCompanyId).map(a => a.id);
                investorHoldings = investorHoldings.filter((h: any) => companyAssetIds.includes(h.assetId));
            }
            
            setHoldings(investorHoldings);
        }).catch(console.error)
        .finally(() => setLoading(false));
    }, [selectedCompanyId]);

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
                        {holdings.map((holding, index) => (
                            <TableRow key={`${holding.assetId}-${index}`}>
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
