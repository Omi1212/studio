'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Order, AssetDetails, User, Company } from '@/lib/types';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreVertical, Search, ShoppingBag, ArrowUpRight, ArrowDownLeft, Check, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import AssetIcon from '../ui/asset-icon';
import KybBanner from '@/components/dashboard/kyb-banner';
import IdentityProvidersBanner from '@/components/dashboard/identity-providers-banner';
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

const ITEMS_PER_PAGE = 10;

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
};

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

function OrderTableRow({ order, assets, investors, onApprove, onReject, userRole }: { order: Order, assets: AssetDetails[], investors: User[], onApprove: (id: string) => void, onReject: (id: string) => void, userRole: string | null }) {
  const router = useRouter();
  const asset = assets.find(t => t.id === order.assetId);
  const investor = investors.find(i => i.id === order.investorId);
  const total = order.amount * order.price;

  const targetUrl = order.status === 'waiting payment' ? `/orders/${order.id}/pay` : `/orders/${order.id}`;

  const networks = asset?.network ? (Array.isArray(asset.network) ? asset.network : [asset.network]) : [];
  const displayNetwork = networks.length > 0 ? networkMap[networks[0]] || networks[0] : 'N/A';
  const remainingCount = networks.length - 1;


  return (
    <TableRow onClick={() => router.push(targetUrl)} className="cursor-pointer">
      <TableCell>
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
        {asset && (
            <div className="flex items-center gap-2">
                <AssetIcon asset={asset} className="h-6 w-6" />
                <span className="font-medium text-primary">{asset.assetTicker}</span>
            </div>
        )}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
          <div className="flex items-center gap-2">
            <span>{displayNetwork}</span>
            {remainingCount > 0 && <Badge variant="secondary">+{remainingCount}</Badge>}
          </div>
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
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={targetUrl}>View Details</Link>
                </DropdownMenuItem>
                {order.status === 'pending' && (userRole === 'issuer' || userRole === 'agent') && (
                    <>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Check className="mr-2 h-4 w-4" /> Accept
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will mark the order as complete.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onApprove(order.id)}>Accept</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
                                    <X className="mr-2 h-4 w-4" /> Reject
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onReject(order.id)}>Reject</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}


export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [assets, setAssets] = useState<AssetDetails[]>([]);
  const [investors, setInvestors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [networkFilter, setNetworkFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<AssetDetails | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [assetCheckComplete, setAssetCheckComplete] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
    Promise.all([
      fetch('/api/assets').then(res => res.json()),
      fetch('/api/investors').then(res => res.json())
    ]).then(([assetsData, investorsData]) => {
      setAssets(assetsData.data || []);
      setInvestors(investorsData.data || []);
    }).catch(console.error);

    const loadCompany = () => {
      const selectedCompanyId = localStorage.getItem('selectedCompanyId');
      if (selectedCompanyId) {
          fetch(`/api/companies/${selectedCompanyId}`).then(res => res.json()).then(setCompany);
      } else {
          setCompany(null);
      }
    };

    loadCompany();
    window.addEventListener('companyChanged', loadCompany);

    return () => {
        window.removeEventListener('companyChanged', loadCompany);
    };
  }, []);

  useEffect(() => {
    if (assets.length === 0 && assetCheckComplete) return;

    const handleAssetChange = () => {
        const storedAssetId = localStorage.getItem('selectedAssetId');
        if (storedAssetId && assets.length > 0) {
            const foundAsset = assets.find(t => t.id === storedAssetId);
            setSelectedAsset(foundAsset || null);
        } else {
            setSelectedAsset(null);
        }
        setAssetCheckComplete(true);
    };

    handleAssetChange();
    window.addEventListener('assetChanged', handleAssetChange);

     return () => {
        window.removeEventListener('assetChanged', handleAssetChange);
    };
  }, [assets, assetCheckComplete]);

  useEffect(() => {
    if (!assetCheckComplete) {
        return;
    }
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage.toString(),
      perPage: ITEMS_PER_PAGE.toString(),
    });

    if (userRole === 'investor') {
        params.append('investorId', 'inv-001'); // Hardcoded for demo
    } else if ((userRole === 'issuer' || userRole === 'agent') && selectedAsset) {
        params.append('assetId', selectedAsset.id);
    } else if ((userRole === 'issuer' || userRole === 'agent') && !selectedAsset) {
        setOrders([]);
        setTotalOrders(0);
        setLoading(false);
        return;
    }

    if (statusFilter !== 'all') {
      params.append('status', statusFilter);
    }
    if (networkFilter !== 'all') {
      params.append('network', networkFilter);
    }
    if (searchQuery) {
      params.append('query', searchQuery);
    }

    const fetchOrders = async () => {
        try {
            const response = await fetch(`/api/orders?${params.toString()}`);
            const data = await response.json();
            setOrders(data.data);
            setTotalOrders(data.meta.total);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchOrders();
  }, [currentPage, searchQuery, statusFilter, networkFilter, selectedAsset, userRole, assetCheckComplete]);
  
  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const updateOrderStatus = async (id: string, status: 'completed' | 'rejected') => {
     try {
        const response = await fetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update order status');
        }

        const updatedOrder = await response.json();
        setOrders(prev => prev.map(order => order.id === id ? updatedOrder : order));

        toast({
            title: `Order ${status === 'completed' ? 'Accepted' : 'Rejected'}`,
            description: `The order #${id} has been updated.`
        });
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not update the order status.',
        });
    }
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

  if ((userRole === 'issuer' || userRole === 'agent') && !selectedAsset && assetCheckComplete) {
    const showKybBanner = company && company.kybStatus !== 'verified';
    const complianceProvidersCount = company?.complianceProviders?.length ?? 0;
    const showComplianceBanner = company && company.kybStatus === 'verified' && complianceProvidersCount < 3;
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-headline font-semibold">Orders</h1>
        </div>
        <div className="space-y-8">
            {showKybBanner && <KybBanner />}
            {showComplianceBanner && <IdentityProvidersBanner />}
        </div>
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4 mt-8">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No asset selected</h2>
          <p className="text-muted-foreground mb-4">Please select an asset from the sidebar to view orders.</p>
        </div>
      </div>
    );
  }
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-between items-center p-4">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  const pageTitle = userRole === 'investor' 
    ? "My Orders" 
    : `Orders ${selectedAsset ? `for ${selectedAsset.assetTicker}` : ''}`;


  const noOrdersMessage = () => {
      if ((userRole === 'issuer' || userRole === 'agent') && !selectedAsset) {
          return {
              title: "No asset selected or found",
              description: "Please select an asset from the sidebar to view its orders."
          }
      }
      if (searchQuery || statusFilter !== 'all' || networkFilter !== 'all') {
          return {
              title: "No Orders Found",
              description: "Try adjusting your search or filters."
          }
      }
      if (userRole === 'investor') {
          return {
              title: "You have no orders yet",
              description: "Your buy and sell orders will appear here."
          }
      }
      return {
          title: "No Orders Found",
          description: `There are no orders for ${selectedAsset?.assetTicker} at this time.`
      }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-semibold">{pageTitle}</h1>
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
                    <SelectItem value="waiting payment">Waiting Payment</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
            </Select>
            { (userRole === 'issuer' || userRole === 'agent') && selectedAsset && Array.isArray(selectedAsset.network) && selectedAsset.network.length > 1 ? (
              <Select value={networkFilter} onValueChange={setNetworkFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by network" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Networks</SelectItem>
                      {selectedAsset.network.map(net => (
                          <SelectItem key={net} value={net}>{networkMap[net] || net}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            ) : (userRole !== 'issuer' && userRole !== 'agent') ? (
              <Select value={networkFilter} onValueChange={setNetworkFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by network" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Networks</SelectItem>
                      <SelectItem value="spark">Spark</SelectItem>
                      <SelectItem value="liquid">Liquid</SelectItem>
                      <SelectItem value="rgb">RGB</SelectItem>
                      <SelectItem value="taproot">Taproot Assets</SelectItem>
                  </SelectContent>
              </Select>
            ) : null }
        </div>
      </div>

       {orders.length === 0 ? (
         <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{noOrdersMessage().title}</h2>
            <p className="text-muted-foreground mb-4">
                {noOrdersMessage().description}
            </p>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="hidden lg:table-cell">Asset</TableHead>
                <TableHead className="hidden lg:table-cell">Network</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell text-right">Total</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                  <OrderTableRow key={order.id} order={order} assets={assets} investors={investors} onApprove={handleApprove} onReject={handleReject} userRole={userRole} />
              ))}
            </TableBody>
          </Table>
          {renderPagination()}
        </Card>
      )}
    </div>
  )
}
