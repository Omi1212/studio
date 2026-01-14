
'use client';

import { useEffect, useState, use } from 'react';
import { notFound, useParams } from 'next/navigation';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { exampleTokens, tokenPriceHistory } from '@/lib/data';
import type { TokenDetails } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import TokenIcon from '@/components/ui/token-icon';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;


function InfoRow({ label, value, valueClassName }: { label: string; value: React.ReactNode, valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className={`text-sm font-medium ${valueClassName}`}>{value}</div>
    </div>
  );
}

function TokenOfferingPage({ params }: { params: { tokenId: string } }) {
  const [token, setToken] = useState<TokenDetails | null>(null);
  const [loading, setLoading] = useState(true);

   const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
  };

  const networkExplorerMap: { [key: string]: { name: string; url: string } } = {
    spark: { name: 'Sparkscan', url: 'https://sparkscan.io' },
    liquid: { name: 'Liquid Explorer', url: 'https://mempool.space/liquid' },
    rgb: { name: 'RGB Explorer', url: 'https://rgb.tech' },
    taproot: { name: 'Taproot Explorer', url: 'https://mempool.space' },
  };

  useEffect(() => {
    const { tokenId } = params;
    
    const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    const allTokens: TokenDetails[] = [...exampleTokens, ...storedTokens].map(t => ({
      ...t,
      decimals: t.decimals ?? 0,
      isFreezable: t.isFreezable ?? false,
      publicKey: t.publicKey ?? `02f...${t.id.slice(-10)}`,
    }));

    const foundToken = allTokens.find(t => t.id === tokenId);
    
    if (foundToken) {
      // @ts-ignore
      setToken(foundToken);
    }
    
    setLoading(false);
  }, [params]);

  if (loading) {
    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <p>Loading token details...</p>
        </div>
    );
  }

  if (!token) {
    notFound();
  }

  // Example static data based on the image
  const offeringData = {
    marketCap: 174700028.571,
    circulating: 1455833.571,
  };

  const explorer = networkExplorerMap[token.network] || { name: 'Explorer', url: '#'};


  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/marketplace"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    {token.tokenName} Offering
                </h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <TokenIcon token={token} className="h-12 w-12" />
                            <div>
                                <CardTitle>{token.tokenName}</CardTitle>
                                <CardDescription className="text-primary font-bold">{token.tokenTicker}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow label="Market Cap" value={`${offeringData.marketCap.toLocaleString('en-US', {maximumFractionDigits: 3})} USDT`} valueClassName="font-mono" />
                        <InfoRow label="Circulating" value={`${offeringData.circulating.toLocaleString('en-US', {maximumFractionDigits: 3})} ${token.tokenTicker}`} valueClassName="font-mono" />
                        <InfoRow label="Max. Supply" value={`${token.maxSupply.toLocaleString('en-US')} ${token.tokenTicker}`} valueClassName="font-mono" />
                        <InfoRow label="Network" value={networkMap[token.network] || token.network} />
                        <InfoRow label="Decimals" value={token.decimals} />
                        <InfoRow label="Is Freezable" value={token.isFreezable ? 'Yes' : 'No'} />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2 flex flex-col">
                    <CardHeader>
                        <CardTitle>Price History</CardTitle>
                        <CardDescription>Price of {token.tokenTicker} over time.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                         <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={tokenPriceHistory}
                                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                                >
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                                        domain={['dataMin - 10 > 0 ? dataMin - 10 : 0', 'dataMax + 10']}
                                    />
                                    <Tooltip
                                        cursor={{
                                            stroke: 'hsl(var(--border))',
                                            strokeWidth: 2,
                                            strokeDasharray: '3 3',
                                        }}
                                        content={<ChartTooltipContent />}
                                    />
                                    <Line
                                        dataKey="price"
                                        type="monotone"
                                        stroke="hsl(var(--chart-1))"
                                        strokeWidth={2}
                                        dot={true}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                            <a href={explorer.url} target="_blank" rel="noopener noreferrer">
                                <Globe className="mr-2 h-4 w-4" />
                                View on {explorer.name}
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function TokenDetailsUsePage({ params }: { params: Promise<{ tokenId: string }> }) {
  const resolvedParams = use(params);
  return <TokenOfferingPage params={resolvedParams} />;
}
