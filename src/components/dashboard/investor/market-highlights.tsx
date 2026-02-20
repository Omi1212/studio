'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AssetIcon from '@/components/ui/asset-icon';
import Link from 'next/link';
import type { AssetDetails } from '@/lib/types';

export default function MarketHighlights() {
    const [highlights, setHighlights] = useState<AssetDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);
      Promise.all([
        fetch('/api/investors/inv-001').then(res => res.json()),
        fetch('/api/assets').then(res => res.json())
      ]).then(([investorData, assetsData]) => {
        const holdingsIds = investorData?.holdings.map((h: any) => h.assetId) || [];
        const filteredHighlights = assetsData.data
          .filter((asset: AssetDetails) => !holdingsIds.includes(asset.id) && asset.status === 'active')
          .slice(0, 2);
        setHighlights(filteredHighlights);
      }).catch(console.error)
      .finally(() => setLoading(false));
    }, []);

    if(loading) {
        return (
            <div>
                 <h2 className="text-2xl font-headline font-semibold mb-4">Discover Opportunities</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <Card className="h-64 animate-pulse bg-muted/50"></Card>
                    <Card className="h-64 animate-pulse bg-muted/50"></Card>
                 </div>
            </div>
        );
    }

    return (
        <div>
             <h2 className="text-2xl font-headline font-semibold mb-4">Discover Opportunities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {highlights.map(asset => (
                    <Card key={asset.id}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <AssetIcon asset={asset} className="h-10 w-10" />
                                <div>
                                    <CardTitle className="text-lg">{asset.assetName}</CardTitle>
                                    <CardDescription className="text-primary font-bold">{asset.assetTicker}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Price</span>
                                <span className="font-mono font-medium">${asset.price?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-muted-foreground">Network</span>
                                <span className="font-medium">{asset.network}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/marketplace/${asset.id}`}>View Offering</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
