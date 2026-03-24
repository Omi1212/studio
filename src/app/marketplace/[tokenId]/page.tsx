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
import type { AssetDetails, SubscriptionStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, FileText } from 'lucide-react';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

function AssetOfferingPage({ params }: { params: { tokenId: string } }) {
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('none');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

   const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    ark: 'Arkade Assets',
    taproot: 'Taproot Assets',
  };

  const networkExplorerMap: { [key: string]: { name: string; url: string } } = {
    spark: { name: 'Sparkscan', url: 'https://sparkscan.io' },
    liquid: { name: 'Liquid Explorer', url: 'https://mempool.space/liquid' },
    rgb: { name: 'RGB Explorer', url: 'https://rgb.tech' },
    ark: { name: 'Arkade Assets', url: '#' },
    taproot: { name: 'Taproot Explorer', url: 'https://mempool.space' },
  };

  useEffect(() => {
    const { tokenId: assetId } = params;
    setLoading(true);
    
    Promise.all([
      fetch(`/api/assets/${assetId}`).then(res => res.ok ? res.json() : null),
      fetch('/api/asset-price-history').then(res => res.ok ? res.json() : { data: [] }),
      fetch('/api/investors/inv-001/subscriptions').then(res => res.ok ? res.json() : {}),
    ]).then(([assetData, priceHistoryData, subscriptionsData]) => {
      if (assetData) {
        setAsset({
          ...assetData,
          network: Array.isArray(assetData.network) ? assetData.network : [assetData.network].filter(Boolean),
          decimals: assetData.decimals ?? 0,
          isFreezable: assetData.isFreezable ?? false,
        });
        
        // Load subscription status from API
        setSubscriptionStatus(subscriptionsData[assetId] || 'none');
      }
      setPriceHistory(priceHistoryData.data || []);
    }).catch(err => {
      console.error("Failed to fetch page data:", err);
      setAsset(null);
    }).finally(() => {
      setLoading(false);
    });

  }, [params]);

  
  const handleSubscribe = async () => {
    if (!asset) return;

    setSubscriptionStatus('pending');

    try {
        const response = await fetch('/api/investors/inv-001/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assetId: asset.id, status: 'pending' }),
        });
        if (!response.ok) throw new Error('Failed to update subscription');

        toast({ title: 'Whitelisting Request Sent!', description: "Your request to be whitelisted for this asset is now pending approval." });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not send request.' });
        setSubscriptionStatus('none'); // Revert on error
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

  const offeringData = {
    marketCap: 174700028.571,
    circulating: 1455833.571,
    price: asset.price || 0.12, // Use asset price or default
  };

  const explorer = (asset.network.length > 0 && networkExplorerMap[asset.network[0]]) || { name: 'Explorer', url: '#'};


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
                    {asset.assetName} Offering
                </h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-1">
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
                        <InfoRow label="Networks" value={(asset.network || []).map(n => networkMap[n] || n).join(', ')} />
                        <InfoRow label="Market Cap" value={`${offeringData.marketCap.toLocaleString('en-US', {maximumFractionDigits: 3})} USDT`} valueClassName="font-mono" />
                        <InfoRow label="Circulating" value={`${offeringData.circulating.toLocaleString('en-US', {maximumFractionDigits: 3})} ${asset.assetTicker}`} valueClassName="font-mono" />
                        <InfoRow label="Max. Supply" value={`${asset.maxSupply.toLocaleString('en-US')} ${asset.assetTicker}`} valueClassName="font-mono" />
                    </CardContent>
                    <CardFooter className="flex-col items-stretch space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                            <a href={explorer.url} target="_blank" rel="noopener noreferrer">
                                <Globe className="mr-2 h-4 w-4" />
                                View on {explorer.name}
                            </a>
                        </Button>
                        <Button variant="secondary" className="w-full">
                            <FileText className="mr-2 h-4 w-4" />
                            View Asset Documents
                        </Button>
                    </CardFooter>
                </Card>

                 <Card>
                  <CardHeader>
                      <CardTitle>Invest in {asset.assetName}</CardTitle>
                      <CardDescription>
                          To invest in this asset, you must first be subscribed to the offering.
                          Once your subscription is approved, you can place an order.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <InfoRow label="Current Price" value={`$${offeringData.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`} />
                      <InfoRow 
                          label="Subscription" 
                          value={
                              subscriptionStatus === 'approved' ? 'Approved' :
                              subscriptionStatus === 'pending' ? 'Pending Approval' :
                              'Not Subscribed'
                          }
                          valueClassName={
                              subscriptionStatus === 'approved' ? 'text-green-500' :
                              subscriptionStatus === 'pending' ? 'text-yellow-500' :
                              'text-red-500'
                          }
                      />
                  </CardContent>
                  <CardFooter>
                    {subscriptionStatus === 'approved' ? (
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full">
                                    Invest
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-lg'>
                                <PlaceOrder
                                    asset={asset}
                                    price={offeringData.price}
                                    isSubscribed={true}
                                    onOrderPlaced={() => setIsModalOpen(false)}
                                    assetName={asset.assetName}
                                />
                            </DialogContent>
                        </Dialog>
                    ) : subscriptionStatus === 'pending' ? (
                        <Button className="w-full" disabled>
                            Pending Approval
                        </Button>
                    ) : (
                        <Button className="w-full" onClick={handleSubscribe}>
                            Subscribe
                        </Button>
                    )}
                  </CardFooter>
                </Card>

            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Price History</CardTitle>
                    <CardDescription>Price of {asset.assetTicker} over time.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                      <ChartContainer config={chartConfig} className="h-[250px] w-full">
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

             <Card>
                <CardHeader>
                    <CardTitle>Tokens</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Network</TableHead>
                        <TableHead>Token Standard</TableHead>
                        <TableHead>Token Supply</TableHead>
                        <TableHead>Circulating Supply</TableHead>
                        <TableHead>Holders</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(asset.network || []).map((net) => {
                        const tokenStandardMap: { [key: string]: string } = {
                            spark: 'SPK-20',
                            liquid: 'L-ASSET',
                            rgb: 'RGB-20',
                            ark: 'ARK-20',
                            taproot: 'TAP',
                        };
                        const tokenStandard = tokenStandardMap[net] || 'Unknown';

                        const tokenSupply = Math.floor(asset.maxSupply / (asset.network.length || 1));
                        const circulatingSupply = Math.floor(tokenSupply * 0.85); // Mock 85% circulating
                        const holders = (parseInt(asset.id.replace(/\D/g, '').slice(-4) || '100', 10)) * (asset.network.length > 1 ? 2 : 1) + 150 + Math.floor(Math.random() * 50);

                        return (
                        <TableRow key={net}>
                            <TableCell>{networkMap[net] || net}</TableCell>
                            <TableCell>{tokenStandard}</TableCell>
                            <TableCell className="font-mono">{tokenSupply.toLocaleString()}</TableCell>
                            <TableCell className="font-mono">{circulatingSupply.toLocaleString()}</TableCell>
                            <TableCell className="font-mono">{holders.toLocaleString()}</TableCell>
                        </TableRow>
                        )})}
                    </TableBody>
                  </Table>
                </CardContent>
            </Card>

          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function AssetDetailsUsePage({ params }: { params: Promise<{ tokenId: string }> }) {
  const resolvedParams = use(params);
  return <AssetOfferingPage params={resolvedParams} />;
}
