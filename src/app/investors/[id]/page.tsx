
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
import { investorsData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Snowflake } from 'lucide-react';
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

type Investor = typeof investorsData[0];

function getStatusBadge(status: Investor['status']) {
  switch (status) {
    case 'whitelisted':
      return <Badge variant="outline" className="text-green-400 border-green-400">Whitelisted</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'restricted':
      return <Badge variant="destructive">Restricted</Badge>;
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

  useEffect(() => {
    const { id } = params;
    const storedInvestors: Investor[] = JSON.parse(localStorage.getItem('investors') || '[]');
    const foundInvestor = storedInvestors.find(inv => inv.id === id);
    
    if (foundInvestor) {
      setInvestor(foundInvestor);
    }
    setLoading(false);
  }, [params]);

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
                    <Button variant="outline" asChild>
                        <Link href={`/investors/${investor.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={!investor.isFrozen}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the investor "{investor.name}".
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
                    <InfoRow label="Wallet Address" value={<span className="font-mono">{investor.walletAddress}</span>} />
                    <InfoRow label="Joined Date" value={new Date(investor.joinedDate).toLocaleDateString()} />
                    <InfoRow label="Total Invested" value={<span className="font-mono">${investor.totalInvested.toLocaleString()}</span>} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                    {investor.holdings && investor.holdings.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Token</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {investor.holdings.map(holding => (
                                <TableRow key={holding.tokenId}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <TokenIcon token={{...holding}} className="h-8 w-8" />
                                            <div>
                                                <p className="font-medium">{holding.tokenName}</p>
                                                <p className="text-sm text-primary">{holding.tokenTicker}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{holding.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-mono">${(holding.amount * holding.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    ) : (
                         <div className="text-center text-muted-foreground py-8">
                            This investor does not hold any tokens yet.
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
