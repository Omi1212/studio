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
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Clock, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { Transfer } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

function InfoRow({ label, value, onCopy }: { label: string; value: string; onCopy?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <p className="font-mono text-sm font-medium break-all">{value}</p>
        {onCopy && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCopy}>
                <Copy className="h-4 w-4" />
            </Button>
        )}
      </div>
    </div>
  );
}

function AddressInfo({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
      <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <div className="flex items-center gap-2">
              <p className="font-mono text-sm break-all">{value}</p>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onCopy}>
                  <Copy className="h-4 w-4" />
              </Button>
          </div>
      </div>
  );
}


export default function TransferDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransfer = async () => {
      const { txId } = params;
      if (!txId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/transfers/${txId}`);
        if(response.ok) {
            const data = await response.json();
            setTransfer(data);
        } else {
            setTransfer(null);
        }
      } catch (error) {
        console.error("Failed to fetch transfer details:", error);
        setTransfer(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransfer();
  }, [params]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: `${fieldName} has been copied.`,
    });
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading transfer details...</p>
      </div>
    );
  }

  if (!transfer) {
    notFound();
  }

  const getAmountClass = (type: Transfer['type']) => {
    switch (type) {
      case 'Mint': return 'text-green-500';
      case 'Burn': return 'text-red-500';
      default: return 'text-foreground';
    }
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
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/transfers"><ArrowLeft /></Link>
                    </Button>
                    <h1 className="text-xl sm:text-2xl font-headline font-semibold break-all">
                        Transaction Details
                    </h1>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                             <h2 className="text-lg font-semibold text-muted-foreground">TRANSACTION ID</h2>
                             <Badge variant="outline" className="text-green-400 border-green-400 self-start sm:self-center">Confirmed</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-mono text-sm break-all">{transfer.txId}</p>
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => copyToClipboard(transfer.txId, 'Transaction ID')}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <h3 className="text-sm font-semibold">Timestamp</h3>
                            </div>
                            <p className="font-medium">{new Date(transfer.date).toLocaleString()}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="p-6 space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Tag className="h-4 w-4" />
                                <h3 className="text-sm font-semibold">Type</h3>
                            </div>
                            <p className="font-medium">{transfer.type === 'Transfer' ? 'Token Transfer' : transfer.type}</p>
                        </CardContent>
                    </Card>
                </div>
                
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-muted-foreground">Details</h3>
                         <div className="flex flex-col md:flex-row items-center gap-4">
                            <AddressInfo 
                                label="From"
                                value={transfer.from}
                                onCopy={() => copyToClipboard(transfer.from, 'From Address')}
                            />
                             <AddressInfo
                                label="To"
                                value={transfer.to}
                                onCopy={() => copyToClipboard(transfer.to, 'To Address')}
                            />
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                             <div>
                                <p className="text-muted-foreground mb-1">Amount</p>
                                <p className={cn("font-mono font-semibold", getAmountClass(transfer.type))}>
                                    {transfer.amount.toLocaleString()} ${transfer.tokenTicker}
                                </p>
                            </div>
                             <div className="text-right">
                                <p className="text-muted-foreground mb-1">Value (USD)</p>
                                <p className="font-mono font-semibold">$0.00</p>
                            </div>
                        </div>
                        <Separator />
                         <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground mb-1">Created At</p>
                                <p className="font-mono">{new Date(transfer.date).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-muted-foreground mb-1">Updated At</p>
                                <p className="font-mono">{new Date(transfer.date).toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
