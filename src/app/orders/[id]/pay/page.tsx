'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { ordersData, investorsData, exampleTokens } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Landmark, Copy, Eye, ArrowUpFromLine, ArrowDownToLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { Order, TokenDetails } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import TokenIcon from '@/components/ui/token-icon';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PaymentMethods from '@/components/orders/payment-methods';

const BtcIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M12.3 4.3a1 1 0 0 0-1.1.2l-3 3.3a1 1 0 0 0 .8 1.6h2.2c.4 0 .7.5.5.8l-3.3 6.6a1 1 0 0 0 1.6.8l3-3.3a1 1 0 0 0-.8-1.6H10c-.4 0-.7-.5-.5-.8l3.3-6.6a1 1 0 0 0-.5-.8z"/>
        <path d="M7 14h1.4c.8 0 1.5.7 1.5 1.5v1.4c0 .8-.7 1.5-1.5 1.5H7z"/>
        <path d="M14 7h1.4c.8 0 1.5.7 1.5 1.5v1.4c0 .8-.7 1.5-1.5 1.5H14z"/>
    </svg>
)

const SparkIcon = () => (
     <svg width="24" height="24" viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8"><path fillRule="evenodd" clipRule="evenodd" d="M39.68 24.656L40.836 0H26.398l1.156 24.656-23.092-8.718L0 29.668l23.807 6.52L8.38 55.457l11.68 8.487 13.558-20.628 13.558 20.627 11.68-8.486L43.43 36.188l23.804-6.52-4.461-13.73-23.092 8.718zM33.617 33v.001z" fill="currentColor"></path></svg>
)

const UsdtIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4h-6"/>
        <path d="M12 6v12"/>
    </svg>
)

export default function PayOrderPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [token, setToken] = useState<TokenDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const { id } = params;
    const storedOrders: Order[] = JSON.parse(localStorage.getItem('orders') || JSON.stringify(ordersData));
    const foundOrder = storedOrders.find(o => o.id === id);
    
    if (foundOrder) {
      setOrder(foundOrder);
      const allTokens = [...exampleTokens, ...JSON.parse(localStorage.getItem('createdTokens') || '[]')];
      const foundToken = allTokens.find(t => t.id === foundOrder.tokenId);
      if(foundToken) setToken(foundToken);
    }
    setLoading(false);
  }, [params]);

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order || !token) {
    notFound();
  }

  const total = order.amount * order.price;
  const fees = total * 0.01; // Example 1% fee
  const finalTotal = total + fees;

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
             <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/orders"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-xl sm:text-2xl font-headline font-semibold">
                    Payment
                </h1>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                            <h2 className="text-2xl font-semibold">Order created and waiting to be confirmed.</h2>
                            <p className="text-muted-foreground mt-2">The order number is #{order.id}</p>
                            <p className="mt-6 text-muted-foreground">To confirm your order, please complete your payment using one of the available payment methods offered.</p>
                            <div className="flex justify-center gap-4 my-6">
                               <BtcIcon />
                               <SparkIcon />
                               <Landmark className="h-8 w-8" />
                               <UsdtIcon />
                            </div>
                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <DialogTrigger asChild>
                                    <Button size="lg">Continue to payment</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-4xl">
                                   <PaymentMethods order={order} token={token} onPaymentConfirmed={() => setIsModalOpen(false)} />
                                </DialogContent>
                            </Dialog>
                            <p className="text-sm text-muted-foreground mt-6">Once the payment is completed, your order will be fully confirmed.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                           <TokenIcon token={token} className="w-16 h-16"/>
                           <div>
                                <h3 className="font-semibold text-lg">{order.amount.toLocaleString()} {token.tokenTicker}</h3>
                                <p className="text-muted-foreground">{token.tokenName}</p>
                           </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader><CardTitle>Charges</CardTitle></CardHeader>
                        <CardContent className="space-y-4 text-sm">
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Investment</span>
                                <span className="font-mono">${total.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Platform Fee (1%)</span>
                                <span className="font-mono">${fees.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Taxes</span>
                                <span className="font-mono">$0.00</span>
                            </div>
                            <Separator />
                             <div className="flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span className="font-mono">${finalTotal.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount Paid</span>
                                <span className="font-mono">$0.00</span>
                            </div>
                             <div className="flex justify-between font-bold text-base">
                                <span>Balance Due</span>
                                <span className="font-mono">${finalTotal.toFixed(2)}</span>
                            </div>
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
