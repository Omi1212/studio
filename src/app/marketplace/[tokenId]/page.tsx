
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
import { exampleTokens, investorsData } from '@/lib/data';
import type { TokenDetails } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Banknote, Landmark, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import TokenIcon from '@/components/ui/token-icon';


function InfoRow({ label, value, valueClassName }: { label: string; value: React.ReactNode, valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className={`text-sm font-medium font-mono ${valueClassName}`}>{value}</div>
    </div>
  );
}

function TokenOfferingPage({ params }: { params: { tokenId: string } }) {
  const [token, setToken] = useState<TokenDetails | null>(null);
  const [loading, setLoading] = useState(true);

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
    startDate: '28-01-2025 14:03:00',
    endDate: '01-04-2025 01:00:00',
    amountRaised: 276120.0,
    softCap: 250000,
    hardCap: 1200000.0,
    previouslyRaised: 96297120.0,
    marketCap: 174700028.571,
    circulating: 1455833.571,
    maxSupplyRound: 0.0,
    minInvestment: 120.0,
    maxInvestment: 1200000.0,
    price: 120.0,
    investedSoFar: 120.0,
  };


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
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between text-sm text-muted-foreground gap-x-4 gap-y-1">
                                <span>Start Date: {offeringData.startDate}</span>
                                <span>End Date: {offeringData.endDate}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <Link href="#" className="text-primary hover:underline flex items-center gap-1">Escrow Contract <ExternalLink className="h-3 w-3" /></Link>
                                <Link href="#" className="text-primary hover:underline flex items-center gap-1">Digital Asset Contract <ExternalLink className="h-3 w-3" /></Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Amount raised in this offering</p>
                            <p className="text-4xl font-bold font-headline">{offeringData.amountRaised.toLocaleString('en-US', {minimumFractionDigits: 1})} USDT</p>
                            <div className="relative mt-2">
                                <Progress value={(offeringData.amountRaised / offeringData.hardCap) * 100} className="h-2" />
                                <div className="absolute h-4 w-1 bg-foreground -top-1" style={{ left: `${(offeringData.softCap / offeringData.hardCap) * 100}%` }}></div>
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>Soft Cap: {offeringData.softCap.toLocaleString()}</span>
                                    <span>{offeringData.hardCap.toLocaleString()} USDT</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">${offeringData.previouslyRaised.toLocaleString('en-US', {minimumFractionDigits: 1})} Amount previously raised</p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6 space-y-3">
                                <InfoRow label="Market Cap" value={`${offeringData.marketCap.toLocaleString('en-US', {maximumFractionDigits: 3})} USDT`} />
                                <InfoRow label="Circulating" value={`${offeringData.circulating.toLocaleString('en-US', {maximumFractionDigits: 3})} ${token.tokenTicker}`} />
                                <InfoRow label="Max. Supply for this Round" value={`${offeringData.maxSupplyRound.toLocaleString('en-US', {maximumFractionDigits: 1})} ${token.tokenTicker}`} />
                                <Separator />
                                <InfoRow label="Soft Cap" value={`${offeringData.softCap.toLocaleString('en-US', {maximumFractionDigits: 1})} USDT`} />
                                <InfoRow label="Hard cap" value={`${offeringData.hardCap.toLocaleString('en-US', {maximumFractionDigits: 1})} USDT`} />
                                <Separator />
                                <InfoRow label="Min Investment" value={`${offeringData.minInvestment.toLocaleString('en-US', {maximumFractionDigits: 1})} USDT`} />
                                <InfoRow label="Max Investment" value={`${offeringData.maxInvestment.toLocaleString('en-US', {maximumFractionDigits: 1})} USDT`} />
                                <InfoRow label="Price" value={`${offeringData.price.toLocaleString('en-US', {maximumFractionDigits: 1})} USDT`} valueClassName="text-primary" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Investment Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Amount invested so far</p>
                                <p className="text-3xl font-bold mt-1">{offeringData.investedSoFar.toLocaleString('en-US', {minimumFractionDigits: 1})} USDT</p>
                                <p className="text-sm text-muted-foreground mt-4">Amount in digital assets</p>
                                <p className="text-3xl font-bold mt-1">{(offeringData.investedSoFar / offeringData.price).toLocaleString('en-US', {minimumFractionDigits: 1})} {token.tokenTicker}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">
                                    My Reports <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
                <div className="xl:col-span-1">
                    <Card className="bg-muted/40">
                        <CardHeader>
                            <CardTitle>Select Payment Method</CardTitle>
                            <CardDescription>The digital asset holder can use the following payment methods:</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2"><Banknote className="h-4 w-4" /> Stablecoins in other blockchain networks</div>
                                <div className="flex items-center gap-2"><Landmark className="h-4 w-4" /> Bank Transfers straight to the account of the Issuer</div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium">Please take a look at all the options, and select the one that is best fit for you.</p>
                                <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                                    <li>If you pick the bank transfer option, please be ready to make the transfer and to provide the transaction ID so the Issuer can verify your transaction</li>
                                    <li>If you wish to pay with a stablecoin that is in a different blockchain, please be ready to make the transfer and provide the TX hash as proof</li>
                                </ul>
                            </div>
                            <Card className="bg-background">
                                <CardContent className="p-4 space-y-4">
                                     <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-muted-foreground">You pay</p>
                                            <p className="text-2xl font-bold">120</p>
                                        </div>
                                         <Button>Select investment method +</Button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-muted-foreground">You get</p>
                                            <p className="text-2xl font-bold">1.0</p>
                                        </div>
                                        <div className="flex items-center gap-2 font-bold">
                                            <TokenIcon token={token} className="h-6 w-6" />
                                            {token.tokenTicker}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </div>
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

    