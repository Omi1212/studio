

'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X, ArrowUpRight, ArrowDownLeft, ExternalLink, Copy, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { Order, User, TokenDetails } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import TokenIcon from '@/components/ui/token-icon';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function getStatusBadge(status: Order['status']) {
  switch (status) {
    case 'completed':
      return <Badge variant="outline" className="text-green-400 border-green-400">Completed</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'waiting payment':
      return <Badge variant="outline" className="text-blue-400 border-blue-400">Waiting Payment</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between">
      <p className="text-sm text-muted-foreground shrink-0">{label}</p>
      <div className="text-sm font-medium text-right">{value}</div>
    </div>
  );
}

function PaymentDetailsCard({ details }: { details: Order['paymentDetails'] }) {
    if (!details) {
        return null;
    }

    const getExplorer = () => {
        if (!details.transactionId || !details.method) return null;
        if (details.method === 'Bank Transfer') return null;

        switch (details.method) {
            case 'Bitcoin':
                if (details.network === 'On-chain') return { name: 'Mempool', url: `https://mempool.space/tx/${details.transactionId}` };
                return null;
            case 'Bitcoin Spark':
                return { name: 'Sparkscan', url: `https://sparkscan.io/tx/${details.transactionId}` };
            case 'Stablecoin':
                if (details.network === 'tron') return { name: 'TRONSCAN', url: `https://tronscan.org/#/transaction/${details.transactionId}` };
                if (details.network === 'ethereum') return { name: 'Etherscan', url: `https://etherscan.io/tx/${details.transactionId}` };
                if (details.network === 'polygon') return { name: 'Polygonscan', url: `https://polygonscan.com/tx/${details.transactionId}` };
                return null;
            default:
                return null;
        }
    }
    
    const explorer = getExplorer();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <InfoRow label="Payment Method" value={details.method} />
                {details.bankName && <InfoRow label="Bank" value={details.bankName} />}
                {details.accountNumber && <InfoRow label="Account Number" value={<span className="font-mono">{details.accountNumber}</span>} />}
                {details.reference && <InfoRow label="Reference" value={<span className="font-mono">{details.reference}</span>} />}
                {details.stablecoin && <InfoRow label="Stablecoin" value={details.stablecoin} />}
                {details.network && <InfoRow label="Network" value={details.network} />}
                {details.cryptoAddress && <InfoRow label="Payment Address" value={<span className="font-mono break-all">{`${details.cryptoAddress.slice(0, 7)}...${details.cryptoAddress.slice(-4)}`}</span>} />}
                {details.transactionId && (
                    <div className="flex items-start justify-between">
                         <p className="text-sm text-muted-foreground shrink-0">Transaction ID</p>
                         <div className="flex items-center gap-2 text-right">
                             <span className="font-mono text-sm break-all">{details.transactionId}</span>
                             {explorer && (
                                 <Button asChild variant="ghost" size="icon" className="h-5 w-5 shrink-0">
                                     <a href={explorer.url} target="_blank" rel="noopener noreferrer" title={`View on ${explorer.name}`}>
                                         <ExternalLink className="h-4 w-4" />
                                     </a>
                                 </Button>
                             )}
                         </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [investor, setInvestor] = useState<User | null>(null);
  const [token, setToken] = useState<TokenDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    if (!id) return;
    
    setLoading(true);
    fetch(`/api/orders/${id}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Order not found');
      })
      .then((orderData: Order) => {
        setOrder(orderData);
        return Promise.all([
          fetch(`/api/investors/${orderData.investorId}`).then(res => res.json()),
          fetch(`/api/tokens/${orderData.tokenId}`).then(res => res.json())
        ]);
      })
      .then(([investorData, tokenData]) => {
        setInvestor(investorData);
        setToken(tokenData);
      })
      .catch(err => {
        console.error(err);
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [params]);
  
  const handleUpdateStatus = async (status: 'completed' | 'rejected') => {
    if (!order) return;
    
    try {
        const response = await fetch(`/api/orders/${order.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update order status');
        }

        const updatedOrder = await response.json();
        setOrder(updatedOrder);

        toast({
            title: `Order ${status === 'completed' ? 'Accepted' : 'Rejected'}`,
            description: `The order #${order.id} has been updated.`
        });
        router.push('/orders');
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not update the order status.',
        });
    }
  };

  const handleSaveObservation = () => {
    const observationText = (document.getElementById('observation') as HTMLTextAreaElement)?.value;
    if (!observationText?.trim()) {
        toast({
            variant: "destructive",
            title: "Observation is empty",
            description: "Please write an observation before saving.",
        });
        return;
    }
    // In a real app, you would save this observation to your backend.
    toast({
        title: "Observation Saved",
        description: `Your observation for order #${order?.id} has been noted.`,
    });
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order || !investor || !token) {
    notFound();
  }

  const total = order.amount * order.price;

  return (
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
                        <Link href="/orders"><ArrowLeft /></Link>
                    </Button>
                    <h1 className="text-3xl font-headline font-semibold">
                        Order Details
                    </h1>
                </div>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                    'flex-center h-10 w-10 rounded-full bg-muted shrink-0',
                                    order.type === 'Buy' ? 'text-green-500' : 'text-red-500'
                                    )}
                                >
                                    {order.type === 'Buy' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{order.type} Order</CardTitle>
                                    <CardDescription>ID: {order.id}</CardDescription>
                                </div>
                            </div>
                            {getStatusBadge(order.status)}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow label="Order Date" value={new Date(order.date).toLocaleString()} />
                        <Separator />
                        {investor && (
                             <InfoRow label="Investor" value={
                                <Link href={`/investors/${investor.id}`} className="flex items-center gap-2 justify-end text-primary hover:underline">
                                    <span>{investor.name}</span>
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Link>
                             } />
                        )}
                        {token && (
                             <InfoRow label="Token" value={
                                <div className="flex items-center gap-2 justify-end">
                                    <span className="font-medium">{token.tokenName} ({token.tokenTicker})</span>
                                    <TokenIcon token={token} className="h-6 w-6" />
                                </div>
                             } />
                        )}
                        <Separator />
                        <InfoRow label="Amount" value={<span className="font-mono">{order.amount.toLocaleString()}</span>} />
                        <InfoRow label="Price per Token" value={<span className="font-mono">${order.price.toFixed(2)}</span>} />
                         <InfoRow label="Total Value" value={
                            <span className={cn("font-mono font-semibold", order.type === 'Buy' ? 'text-green-500' : 'text-red-500')}>
                                {order.type === 'Buy' ? '+' : '-'}${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </span>
                         } />
                    </CardContent>
                </Card>
                
                <PaymentDetailsCard details={order.paymentDetails} />

            {order.status === 'pending' && (
             <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Approve or reject this order. You can add an optional observation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="observation">Observation</Label>
                        <Textarea id="observation" placeholder="Add an observation for the investor..." />
                    </div>
                    <Button variant="secondary" className="w-full" onClick={handleSaveObservation}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Leave Observation
                    </Button>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full">
                                    <X className="mr-2 h-4 w-4" /> Reject Order
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to reject this order?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleUpdateStatus('rejected')}>Reject</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button className="w-full" onClick={() => handleUpdateStatus('completed')}>
                            <Check className="mr-2 h-4 w-4" /> Accept Order
                        </Button>
                    </div>
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
