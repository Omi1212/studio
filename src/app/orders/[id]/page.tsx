

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
import { ordersData, investorsData, exampleTokens } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { Order } from '@/lib/types';
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
} from "@/components/ui/alert-dialog"

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

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    const storedOrders: Order[] = JSON.parse(localStorage.getItem('orders') || JSON.stringify(ordersData));
    const foundOrder = storedOrders.find(o => o.id === id);
    
    if (foundOrder) {
      setOrder(foundOrder);
    }
    setLoading(false);
  }, [params]);
  
  const handleUpdateStatus = (status: 'completed' | 'rejected') => {
    if (!order) return;
    
    const storedOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = storedOrders.map(o => o.id === order.id ? { ...o, status } : o);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Also update the local state to re-render the component
    setOrder({ ...order, status });

    toast({
        title: `Order ${status === 'completed' ? 'Accepted' : 'Rejected'}`,
        description: `The order #${order.id} has been updated.`
    });
    router.push('/orders');
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    notFound();
  }

  const investor = investorsData.find(i => i.id === order.investorId);
  const token = exampleTokens.find(t => t.id === order.tokenId);
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

            {order.status === 'pending' && (
             <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-2">
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
