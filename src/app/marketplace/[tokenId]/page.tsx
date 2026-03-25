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
import type { AssetDetails, SubscriptionStatus, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, FileText, Info, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import AssetIcon from '@/components/ui/asset-icon';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PlaceOrder from '@/components/marketplace/place-order';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssetDetailsView from '@/components/workspace/token-details-view';
import TokensTable from '@/components/workspace/tokens-table';
import AssetDocuments from '@/components/workspace/AssetDocuments';
import Image from 'next/image';
import * as React from 'react';

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const BtcIcon = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none" className="text-orange-400">
        <path fill="currentColor" d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16z"/>
        <path fill="#FFF" d="M22.083 16.51c.64-.383 1.03-1.103 1.03-1.895 0-1.12-.662-2.1-1.82-2.48l.385-1.543-1.02-.255-.373 1.494c-.263-.066-.528-.13-.795-.195l.378-1.51-1.02-.255-.378 1.51c-.22-.05-.434-.098-.646-.145l.002.008-1.58-1.23-1.017-.25L13.928 12.8c-.106.026-.204.053-.31.082l.006-.024-1.11-.277-.254 1.02 1.11.276s.01.027.016.04c-.01.002-.02.004-.03.007l-1.68 1.41c-.088.02-.19.015-.262-.01l.01.006-.695-.173-.255 1.02.694.173c.125.03.25.064.373.098l-1.28 5.122c-.09.23-.28.384-.506.41l.002.008-1.396.35-.255 1.02 1.396-.35c.245-.06.44-.22.52-.46l1.28-5.122c.28.082.55.155.81.218l-1.288 5.15c-.092.37.132.746.5.838l1.398.35.255-1.02-1.397-.35c-.244-.062-.438-.22-.518-.46l1.287-5.145c.78.216 1.52.38 2.22.488l-1.306 5.22c-.084.34.13.67.46.75l1.396.35.255-1.02-1.396-.35c-.246-.06-.44-.22-.52-.46l1.306-5.22c3.15-.62 5.13-2.65 5.11-5.11zm-3.51 3.123c-.417 1.66-2.92 2.51-4.9 2.97l.95-3.8c.417-.11.84-.23 1.25-.36 1.98-.62 2.95-.94 3.03-1.63.07-.63-.6-1.12-1.72-1.42l.54-2.16c2.42.6 3.65 2.15 3.4 4.09zm-5.74-4.2c-.37-.09-1.22-.29-1.22-.29l.71-2.83c1.55.39 2.37 1.1 2.21 2.21-.13.88-1.05 1.43-2.14 1.73l.44-1.82z"/>
    </svg>
);


function KpiCard({ title, value, subValue, icon }: { title: string; value: React.ReactNode; subValue?: string, icon?: React.ReactNode }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="text-xs text-muted-foreground mb-1">{title}</div>
      <div className="text-lg font-bold flex items-center gap-2">{icon}{value}</div>
      {subValue && <div className="text-xs text-muted-foreground">{subValue}</div>}
    </div>
  );
}

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    ark: 'Arkade Assets',
    taproot: 'Taproot Assets',
};

const networkIconMap: { [key: string]: React.ReactNode } = {
    spark: <svg width="24" height="24" viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M39.68 24.656L40.836 0H26.398l1.156 24.656-23.092-8.718L0 29.668l23.807 6.52L8.38 55.457l11.68 8.487 13.558-20.628 13.558 20.627 11.68-8.486L43.43 36.188l23.804-6.52-4.461-13.73-23.092 8.718zM33.617 33v.001z" fill="currentColor"></path></svg>,
    liquid: <Image src="https://liquid.net/_next/static/media/logo.28b5ba97.svg" alt="Liquid Network Logo" width={24} height={24} />,
    rgb: <Image src="https://rgb.tech/logo/rgb-symbol-color.svg" alt="RGB Protocol Logo" width={24} height={24} />,
    ark: <Image src="https://i.ibb.co/sdg2tRxK/imagen-2026-03-24-075321289.png" alt="Arkade Assets Logo" width={24} height={24} />,
    taproot: <Image src="https://docs.lightning.engineering/~gitbook/image?url=https%3A%2F%2F2545062540-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MIzyiDsFtJBYVyhr1nT%252Favatar-1602260100761.png%3Fgeneration%3D1602260100982225%26alt%3Dmedia&width=32&dpr=2&quality=100&sign=15d20b51&sv=2" alt="Taproot Assets Logo" width={24} height={24} />,
};


function AssetOfferingPage({ params }: { params: { tokenId: string } }) {
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<User['role'] | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('none');
  const [isInvestModalOpen, setIsInvestModalOpen] = React.useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const role = localStorage.getItem('userRole') as User['role'] | null;
    setUserRole(role);
    const { tokenId: assetId } = params;
    setLoading(true);
    
    Promise.all([
      fetch(`/api/assets/${assetId}`).then(res => res.ok ? res.json() : null),
      fetch('/api/asset-price-history').then(res => res.ok ? res.json() : { data: [] }),
      fetch('/api/investors/inv-001/subscriptions').then(res => res.ok ? res.json() : {})
    ]).then(([assetData, priceHistoryData, subsData]) => {
      if (assetData) {
        setAsset({
          ...assetData,
          network: Array.isArray(assetData.network) ? assetData.network : [assetData.network].filter(Boolean),
          decimals: assetData.decimals ?? 0,
          isFreezable: assetData.isFreezable ?? false,
        });
      }
      setPriceHistory(priceHistoryData.data || []);
      if (subsData && subsData[assetId]) {
        setSubscriptionStatus(subsData[assetId]);
      } else {
        setSubscriptionStatus('none');
      }
    }).catch(err => {
      console.error("Failed to fetch page data:", err);
      setAsset(null);
    }).finally(() => {
      setLoading(false);
    });

  }, [params]);

  const handleSubscribe = async () => {
    if (!asset) return;

    // Optimistic update
    setSubscriptionStatus('pending');

    try {
        const response = await fetch('/api/investors/inv-001/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assetId: asset.id, status: 'pending' }),
        });
        if (!response.ok) throw new Error('Failed to update subscription');

        toast({ title: 'Whitelisting Request Sent!', description: "Your request is now pending approval." });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not send request.' });
        // Revert state on error
        setSubscriptionStatus('none');
    }
  };
  
  const getActionButton = () => {
    if (subscriptionStatus === 'approved') {
        return <Button onClick={() => setIsInvestModalOpen(true)}>Invest</Button>
    } else if (subscriptionStatus === 'pending') {
        return <Button variant="outline" disabled>Pending</Button>;
    } else {
        return <Button variant="outline" onClick={handleSubscribe}>Subscribe</Button>;
    }
  };


  if (loading) {
    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <p>Loading asset details...</p>
        </div>
    );
  }

  if (!asset) {
    notFound();
  }

  return (
    <Dialog open={isInvestModalOpen} onOpenChange={setIsInvestModalOpen}>
        <SidebarProvider>
        <Sidebar className="border-r">
            <SidebarNav />
        </Sidebar>
        <SidebarInset>
            <div className="flex flex-col min-h-dvh">
            <HeaderDynamic />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/marketplace"><ArrowLeft /></Link>
                        </Button>
                        <h1 className="text-3xl font-headline font-semibold">
                        {asset.assetTicker} Offering
                        </h1>
                    </div>
                    {getActionButton()}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <AssetIcon asset={asset} className="h-12 w-12" />
                                    <div>
                                        <CardTitle>{asset.assetName}</CardTitle>
                                        <CardDescription className="text-primary font-bold">{asset.assetTicker}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <KpiCard title="Market Cap" value="$5.74M" icon={<BtcIcon />} />
                                <KpiCard title="24h Volume" value="$0.00" icon={<BtcIcon />} />
                                <KpiCard title="Floor Price" value="8 sats" />
                                <KpiCard title="Holders" value="966" />
                                <KpiCard title="Total Trades" value="54" />
                                <KpiCard title="Networks" value={
                                    <div className="flex items-center gap-2">
                                        {(asset.network || []).map(net => (
                                            <div key={net} className="h-6 w-6 flex items-center justify-center" title={networkMap[net] || net}>
                                                {networkIconMap[net] || null}
                                            </div>
                                        ))}
                                    </div>
                                } />
                            </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="lg:col-span-3">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-2xl font-bold">0.0 sats/{asset.assetTicker}</p>
                                <p className="text-sm text-muted-foreground">$0.0000 <span className="text-green-500">+0.00%</span></p>
                            </div>
                            <div className="flex gap-1">
                                <Tabs defaultValue="candles">
                                    <TabsList>
                                        <TabsTrigger value="candles">Candles</TabsTrigger>
                                        <TabsTrigger value="line">Line</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                <Tabs defaultValue="24h">
                                    <TabsList>
                                        <TabsTrigger value="24h">24h</TabsTrigger>
                                        <TabsTrigger value="7d">7d</TabsTrigger>
                                        <TabsTrigger value="30d">30d</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[250px] w-full">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={priceHistory}
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
                </Card>

                </div>
                
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tokens">Tokens</TabsTrigger>
                    <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                    <TabsTrigger value="fees">Fees</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-6">
                    <AssetDetailsView asset={asset} view="workspace" userRole={userRole} />
                    </TabsContent>
                    <TabsContent value="tokens" className="mt-6">
                    <TokensTable asset={asset} />
                    </TabsContent>
                    <TabsContent value="liquidity" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                        <p>Liquidity content goes here.</p>
                        </CardContent>
                    </Card>
                    </TabsContent>
                    <TabsContent value="reports" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                        <p>Reports content goes here.</p>
                        </CardContent>
                    </Card>
                    </TabsContent>
                    <TabsContent value="data" className="mt-6">
                    <AssetDocuments asset={asset} />
                    </TabsContent>
                    <TabsContent value="fees" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                        <p>Fees content goes here.</p>
                        </CardContent>
                    </Card>
                    </TabsContent>
                </Tabs>
            </main>
            </div>
        </SidebarInset>
        </SidebarProvider>
        {asset && (
            <DialogContent>
                <PlaceOrder 
                    asset={asset}
                    price={asset.price || 0}
                    isSubscribed={subscriptionStatus === 'approved'}
                    onOrderPlaced={() => setIsInvestModalOpen(false)}
                    assetName={asset.assetName}
                />
            </DialogContent>
        )}
    </Dialog>
  );
}


export default function AssetDetailsUsePage({ params }: { params: Promise<{ tokenId: string }> }) {
  const resolvedParams = use(params);
  return <AssetOfferingPage params={resolvedParams} />;
}
