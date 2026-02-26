'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AssetIcon from '@/components/ui/asset-icon';
import type { User } from '@/lib/types';

export default function InvestorPortfolio({ investor }: { investor: User }) {
    const holdings = investor.holdings || [];

    if (holdings.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                This investor has no holdings.
            </div>
        );
    }

    return (
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
                {holdings.map((holding: any, index: number) => (
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
    );
}
