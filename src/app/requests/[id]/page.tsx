
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
import { exampleTokens, issuersData } from '@/lib/data';
import type { TokenDetails, Issuer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import TokenIcon from '@/components/ui/token-icon';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type CombinedRequest = TokenDetails & { issuer?: Issuer };

function getStatusBadge(status: TokenDetails['status']) {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="text-green-400 border-green-400">Approved</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground w-40 shrink-0">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}


function RequestDetailsPage({ params }: { params: { id: string } }) {
  const [request, setRequest] = useState<CombinedRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  
  const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
  };

  useEffect(() => {
    const { id } = params;
    const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    const allTokens: TokenDetails[] = [...exampleTokens, ...storedTokens];
    const foundToken = allTokens.find(t => t.id === id);
    
    if (foundToken) {
      const issuer = issuersData.find(i => i.id === foundToken.issuerId);
      setRequest({ ...foundToken, issuer });
    }
    
    setLoading(false);
  }, [params]);

  const updateRequestStatus = (id: string, status: 'active' | 'rejected') => {
    if (!request) return;

    const allTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    const updatedTokens = allTokens.map((token: TokenDetails) => 
        token.id === id ? { ...token, status } : token
    );
    localStorage.setItem('createdTokens', JSON.stringify(updatedTokens));

    setRequest(prev => prev ? { ...prev, status } : null);

    toast({
        title: `Request ${status === 'active' ? 'Approved' : 'Rejected'}`,
        description: `The token "${request.tokenName}" has been ${status === 'active' ? 'approved' : 'rejected'}.`
    });
    router.push('/requests');
  };

  if (loading) {
    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <p>Loading request details...</p>
        </div>
    );
  }

  if (!request) {
    notFound();
  }

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
                    <Link href="/requests"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Token Request Details
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
             <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <TokenIcon token={request} className="h-12 w-12" />
                            <div>
                                <CardTitle className="text-2xl">{request.tokenName}</CardTitle>
                                <CardDescription className="text-primary font-bold">{request.tokenTicker}</CardDescription>
                            </div>
                        </div>
                         {getStatusBadge(request.status)}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoRow label="Network" value={networkMap[request.network] || request.network} />
                    <InfoRow label="Max Supply" value={<span className="font-mono">{request.maxSupply.toLocaleString()}</span>} />
                    <InfoRow label="Decimals" value={request.decimals} />
                    <InfoRow label="Is Freezable" value={request.isFreezable ? 'Yes' : 'No'} />
                    <InfoRow label="Destination Address" value={<span className="font-mono">{request.destinationAddress}</span>} />
                </CardContent>
            </Card>

            {request.issuer && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Issuer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 text-xl">
                                <AvatarFallback>{request.issuer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{request.issuer.name}</p>
                                <p className="text-sm text-muted-foreground">{request.issuer.email}</p>
                            </div>
                        </div>
                        <InfoRow label="Issuer Wallet" value={<span className="font-mono">{request.issuer.walletAddress}</span>} />
                    </CardContent>
                </Card>
            )}

            {request.status === 'pending' && (
             <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-2">
                    <Button variant="destructive" className="w-full" onClick={() => updateRequestStatus(request.id, 'rejected')}>
                        <X className="mr-2 h-4 w-4" /> Reject Request
                    </Button>
                    <Button className="w-full" onClick={() => updateRequestStatus(request.id, 'active')}>
                        <Check className="mr-2 h-4 w-4" /> Approve Request
                    </Button>
                </CardContent>
             </Card>
            )}

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function RequestDetailsUsePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <RequestDetailsPage params={resolvedParams} />;
}
