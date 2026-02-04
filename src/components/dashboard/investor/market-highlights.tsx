'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { exampleTokens, investorsData } from '@/lib/data';
import TokenIcon from '@/components/ui/token-icon';
import Link from 'next/link';

export default function MarketHighlights() {
    const investor = investorsData.find(inv => inv.id === 'inv-001');
    const holdingsIds = investor?.holdings.map(h => h.tokenId) || [];
    
    // Highlight tokens not already held by the investor
    const highlights = exampleTokens.filter(token => !holdingsIds.includes(token.id) && token.status === 'active').slice(0, 2);

    return (
        <div>
             <h2 className="text-2xl font-headline font-semibold mb-4">Discover Opportunities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {highlights.map(token => (
                    <Card key={token.id}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <TokenIcon token={token} className="h-10 w-10" />
                                <div>
                                    <CardTitle className="text-lg">{token.tokenName}</CardTitle>
                                    <CardDescription className="text-primary font-bold">{token.tokenTicker}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Price</span>
                                <span className="font-mono font-medium">${token.price?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-muted-foreground">Network</span>
                                <span className="font-medium">{token.network}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/marketplace/${token.id}`}>View Offering</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
