

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
import { investorsData, exampleTokens } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Snowflake, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TokenIcon from '@/components/ui/token-icon';
import { cn } from '@/lib/utils';
import type { TokenDetails } from '@/lib/types';

type Investor = typeof investorsData[0];

function getStatusBadge(status: Investor['status']) {
  switch (status) {
    case 'accepted':
      return <Badge variant="outline" className="text-green-400 border-green-400">Whitelisted</Badge>;
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

export default function InvestorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState<TokenDetails | null>(null);
  const [filteredTransactions, setFilteredTransactions] = useState<Investor['transactions']>([]);

  useEffect(() => {
    const { id } = params;
    const storedInvestors: Investor[] = JSON.parse(localStorage.getItem('investors') || '[]');
    const defaultInvestorData = investorsData.find(inv => inv.id === id);
    const storedInvestorData = storedInvestors.find(inv => inv.id === id);

    let finalInvestor: Investor | null = null;

    if (defaultInvestorData) {
      finalInvestor = { ...defaultInvestorData };
      if (storedInvestorData) {
        finalInvestor = { ...finalInvestor, ...storedInvestorData };
      }
    } else if (storedInvestorData) {
        finalInvestor = storedInvestorData;
    }
    
    if (finalInvestor) {
      setInvestor(finalInvestor);
    }
    
    setLoading(false);

    const handleTokenChange = () => {
        const storedTokenId = localStorage.getItem('selectedTokenId');
        if (storedTokenId) {
            const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
            const allTokens: TokenDetails[] = [...exampleTokens, ...storedTokens];
            const foundToken = allTokens.find(t => t.id === storedTokenId);
            setSelectedToken(foundToken || null);
        } else {
            setSelectedToken(null);
        }
    };

    handleTokenChange();
    window.addEventListener('tokenChanged', handleTokenChange);

    return () => {
        window.removeEventListener('tokenChanged', handleTokenChange);
    };

  }, [params]);

  useEffect(() => {
    if (selectedToken && investor?.transactions) {
      const filtered = investor.transactions.filter(tx => tx.token.id === selectedToken.id);
      setFilteredTransactions(filtered);
    } else if (investor?.transactions) {
      setFilteredTransactions(investor.transactions);
    } else {
      setFilteredTransactions([]);
    }
  }, [investor, selectedToken]);


  const handleToggleFreeze = () => {
    if (!investor) return;
    const updatedInvestor = { ...investor, isFrozen: !investor.isFrozen };
    setInvestor(updatedInvestor);

    const storedInvestors: Investor[] = JSON.parse(localStorage.getItem('investors') || '[]');
    const updatedInvestors = storedInvestors.map(inv => inv.id === investor.id ? updatedInvestor : inv);
    localStorage.setItem('investors', JSON.stringify(updatedInvestors));

    toast({
        title: `Address ${updatedInvestor.isFrozen ? 'Frozen' : 'Unfrozen'}`,
        description: `The wallet address for "${investor.name}" has been ${updatedInvestor.isFrozen ? 'frozen' : 'unfrozen'}.`,
    });
  }

  const handleDelete = () => {
    if (!investor) return;
    const storedInvestors: Investor[] = JSON.parse(localStorage.getItem('investors') || '[]');
    const updatedInvestors = storedInvestors.filter(inv => inv.id !== investor.id);
    localStorage.setItem('investors', JSON.stringify(updatedInvestors));
    toast({
        title: "Investor Deleted",
        description: `"${investor.name}" has been deleted.`,
    });
    router.push('/investors');
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading investor details...</p>
      </div>
    );
  }

  if (!investor) {
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
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/investors"><ArrowLeft /></Link>
                    </Button>
                    <h1 className="text-3xl font-headline font-semibold">
                        Investor Details
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant={investor.isFrozen ? "secondary" : "outline"} onClick={handleToggleFreeze}>
                        <Snowflake className="mr-2 h-4 w-4" /> {investor.isFrozen ? 'Unfreeze' : 'Freeze'} Address
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Investor
                             </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the investor "{investor.name}" and all associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 text-2xl">
                            <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{investor.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(investor.status)}
                                {investor.isFrozen && <Badge variant="secondary" className="bg-sky-600/20 text-sky-400 border-sky-400/50">Frozen</Badge>}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoRow label="Email" value={investor.email} />
                    <InfoRow label="Wallet Address" value={<span className="font-mono">{investor.walletAddress.slice(0, 7)}...{investor.walletAddress.slice(-4)}</span>} />
                    <InfoRow label="Joined Date" value={new Date(investor.joinedDate).toLocaleDateString()} />
                    <InfoRow label="Total Invested" value={<span className="font-mono">${investor.totalInvested.toLocaleString()}</span>} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Transaction History {selectedToken && `for ${selectedToken.tokenTicker}`}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredTransactions.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction</TableHead>
                                <TableHead>Token</TableHead>
                                <TableHead className="hidden sm:table-cell">Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right hidden md:table-cell">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={cn(
                                                'flex-center h-8 w-8 rounded-full bg-muted shrink-0',
                                                tx.type === 'Buy' ? 'text-green-500' : 'text-red-500'
                                                )}
                                            >
                                                {tx.type === 'Buy' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                            </div>
                                            <span className="font-medium">{tx.type}</span>
                                        </div>
                                    </TableCell>
                                     <TableCell>
                                        <div className="flex items-center gap-2">
                                            <TokenIcon token={tx.token} className="h-6 w-6" />
                                            <span className="font-medium text-primary">{tx.token.tokenTicker}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {tx.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className={cn("text-right font-mono hidden md:table-cell", tx.type === 'Buy' ? 'text-green-500' : 'text-red-500')}>
                                       {tx.type === 'Buy' ? '+' : '-'} ${(tx.amount * tx.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    ) : (
                         <div className="text-center text-muted-foreground py-8">
                            This investor has no transaction history for the selected token.
                        </div>
                    )}
                </CardContent>
            </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

    
