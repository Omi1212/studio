

'use client';

import { useState, useEffect, useMemo } from 'react';
import { ordersData, exampleTokens, investorsData } from '@/lib/data';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreVertical, Search, Check, X, ShoppingBag, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import TokenIcon from '../ui/token-icon';

function getStatusBadge(status: Order['status']) {
  switch (status) {
    case 'completed':
      return <Badge variant="outline" className="text-green-400 border-green-400">Completed</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

function OrderTableRow({ order, onApprove, onReject }: { order: Order, onApprove: (id: string) => void, onReject: (id: string) => void }) {
  
  const token = exampleTokens.find(t => t.id === order.tokenId);
  const investor = investorsData.find(i => i.id === order.investorId);
  const total = order.amount * order.price;

  return (
    <TableRow>
      <TableCell className="hidden md:table-cell">
        {investor && (
             <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">{investor.name}</p>
                    <p className="text-sm text-muted-foreground">{investor.email}</p>
                </div>
            </div>
        )}
      </TableCell>
        <TableCell>
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                    'flex-center h-8 w-8 rounded-full bg-muted shrink-0',
                    order.type === 'Buy' ? 'text-green-500' : 'text-red-500'
                    )}
                >
                    {order.type === 'Buy' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{order.type} Order</span>
                  <span className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</span>
                </div>
            </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {token && (
            <div className="flex items-center gap-2">
                <TokenIcon token={token} className="h-6 w-6" />
                <span className="font-medium text-primary">{token.tokenTicker}</span>
            </div>
        )}
      </TableCell>
      <TableCell className="hidden sm:table-cell text-right">
        <p className="font-mono">{order.amount.toLocaleString()}</p>
        <p className="font-mono text-sm text-muted-foreground">@ ${order.price.toFixed(2)}</p>
      </TableCell>
      <TableCell className="hidden md:table-cell text-right">
        <p className={cn("font-mono font-medium", order.type === 'Buy' ? 'text-green-500' : 'text-red-500')}>
            {order.type === 'Buy' ? '+' : '-'}${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
        </p>
      </TableCell>
       <TableCell className="hidden sm:table-cell">{getStatusBadge(order.status)}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
            {order.status === 'pending' && (
                <>
                    <Button size="sm" variant="outline" onClick={() => onReject(order.id)}>Reject</Button>
                    <Button size="sm" onClick={() => onApprove(order.id)}>Accept</Button>
                </>
            )}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/orders/${order.id}`}>View Details</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}


export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const storedOrdersRaw = localStorage.getItem('orders');
    const allOrders = storedOrdersRaw ? JSON.parse(storedOrdersRaw) : ordersData;
    setOrders(allOrders);
    setLoading(false);
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
        filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.investorName.toLowerCase().includes(lowercasedQuery) ||
        order.tokenTicker.toLowerCase().includes(lowercasedQuery) ||
        order.id.toLowerCase().includes(lowercasedQuery)
      );
    }

    return filtered;
  }, [orders, searchQuery, statusFilter]);

  const updateOrderStatus = (id: string, status: 'completed' | 'rejected') => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem('orders') || JSON.stringify(ordersData));
    const updatedOrders = allOrders.map((order: Order) => order.id === id ? { ...order, status } : order);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);

    toast({
        title: `Order ${status === 'completed' ? 'Accepted' : 'Rejected'}`,
        description: `The order #${id} has been ${status}.`
    });
  }

  const handleApprove = (id: string) => {
    updateOrderStatus(id, 'completed');
  };
  
  const handleReject = (id: string) => {
    updateOrderStatus(id, 'rejected');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-headline font-semibold">Orders</h1>
        <Card className="h-64 animate-pulse bg-muted/50"></Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-semibold">Orders</h1>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search orders..."
                    className="pl-8 w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
             <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

       {filteredOrders.length === 0 ? (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
            <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' ? "Try adjusting your search or filter." : "There are no orders at this time."}
            </p>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Investor</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="hidden lg:table-cell">Token</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell text-right">Total</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => (
                  <OrderTableRow key={order.id} order={order} onApprove={handleApprove} onReject={handleReject} />
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
