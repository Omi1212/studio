'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Order, AssetDetails } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import AssetIcon from '../ui/asset-icon';

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

export default function InvestorOrders({ investorId }: { investorId: string }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [assets, setAssets] = useState<AssetDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`/api/orders?investorId=${investorId}`).then(res => res.json()),
            fetch('/api/assets?perPage=999').then(res => res.json())
        ]).then(([ordersData, assetsData]) => {
            setOrders(ordersData.data || []);
            setAssets(assetsData.data || []);
        }).catch(console.error)
        .finally(() => setLoading(false));
    }, [investorId]);

    if (loading) {
        return <p className="text-center text-muted-foreground py-8">Loading orders...</p>;
    }
    
    if (orders.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                This investor has no orders.
            </div>
        );
    }
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead className="hidden sm:table-cell text-right">Amount</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Total</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map(order => {
                    const asset = assets.find(a => a.id === order.assetId);
                    const total = order.amount * order.price;
                    const targetUrl = order.status === 'waiting payment' ? `/orders/${order.id}/pay` : `/orders/${order.id}`;

                    return (
                        <TableRow key={order.id} onClick={() => router.push(targetUrl)} className="cursor-pointer">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className={cn('flex-center h-8 w-8 rounded-full bg-muted shrink-0', order.type === 'Buy' ? 'text-green-500' : 'text-red-500')}>
                                        {order.type === 'Buy' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="font-medium">{order.type} Order</p>
                                        <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {asset && (
                                    <div className="flex items-center gap-2">
                                        <AssetIcon asset={asset} className="h-6 w-6" />
                                        <span className="font-medium">{asset.assetTicker}</span>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-right font-mono">{order.amount.toLocaleString()}</TableCell>
                            <TableCell className={cn("hidden md:table-cell text-right font-mono", order.type === 'Buy' ? 'text-green-500' : 'text-red-500')}>
                                {order.type === 'Buy' ? '+' : '-'}${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                             <TableCell className="text-right">{getStatusBadge(order.status)}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
