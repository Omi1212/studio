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
import { ArrowLeft, Edit, KeyRound, Trash2, User as UserIcon, Snowflake, ShieldCheck, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import type { User } from '@/lib/types';
import { countries } from '@/lib/countries';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvestorPortfolio from '@/components/investors/investor-portfolio';
import InvestorSubscriptions from '@/components/investors/investor-subscriptions';
import InvestorOrders from '@/components/investors/investor-orders';
import InvestorTransactions from '@/components/investors/investor-transactions';
import { cn } from '@/lib/utils';


function getStatusBadge(status: User['kycStatus']) {
  switch (status) {
    case 'verified':
      return <Badge variant="outline" className="text-green-400 border-green-400"><ShieldCheck className="mr-2 h-4 w-4" /> KYC Verified</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400"><ShieldCheck className="mr-2 h-4 w-4" /> KYC Pending</Badge>;
    case 'rejected':
      return <Badge variant="destructive"><ShieldCheck className="mr-2 h-4 w-4" /> KYC Rejected</Badge>;
    default:
      return <Badge variant="secondary"><ShieldCheck className="mr-2 h-4 w-4" /> KYC Unknown</Badge>;
  }
}

function PersonalInfoRow({ label, value }: { label: string; value: React.ReactNode; }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2">
            <p className="text-sm text-muted-foreground mb-1 sm:mb-0">{label}</p>
            <div className="text-sm font-medium text-right break-all">{value}</div>
        </div>
    );
}

export default function InvestorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [investor, setInvestor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    if (!id) return;

    setLoading(true);
    fetch(`/api/investors/${id}`)
      .then(res => (res.ok ? res.json() : null))
      .then((investorData) => {
        setInvestor(investorData);
      })
      .catch(err => {
        console.error(err);
        setInvestor(null);
      })
      .finally(() => setLoading(false));
  }, [params]);


  const handleToggleFreeze = async () => {
    if (!investor) return;
    
    const newFrozenState = !investor.isFrozen;

    try {
      const response = await fetch(`/api/investors/${investor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFrozen: newFrozenState }),
      });
      if (!response.ok) throw new Error('Failed to update status');

      const updatedInvestor = await response.json();
      setInvestor(updatedInvestor);

      toast({
          title: `Investor ${updatedInvestor.isFrozen ? 'Frozen' : 'Unfrozen'}`,
          description: `The investor "${investor.name}" has been updated.`,
      });

    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update status.' });
    }
  }
  
  const handleResetPassword = () => {
    if (!investor) return;
    toast({
        title: 'Password Reset Sent',
        description: `A password reset link has been sent to ${investor.name}.`,
    });
  };

  const handleDeleteInvestor = async () => {
    if (!investor) return;
    try {
      const response = await fetch(`/api/investors/${investor.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to cancel access.');
      
      toast({
        title: 'Access Canceled',
        description: `The investor's access has been revoked.`,
      });
      router.push('/investors');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };


  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  if (loading) {
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
                    <Skeleton className="h-9 w-48" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Skeleton className="lg:col-span-1 h-96" />
                    <Skeleton className="lg:col-span-3 h-96" />
                </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!investor) {
    notFound();
  }
  
  const countryObj = countries.find(c => c.value === investor.country || c.label === investor.country);
  const countryDisplay = countryObj ? countryObj.label : investor.country;
  
  const ActionButton = ({ icon: Icon, label, onClick, className }: { icon: React.ElementType, label: string, onClick?: () => void, className?: string }) => (
    <Button variant="ghost" className={cn("w-full justify-start text-muted-foreground", className)} onClick={onClick}>
        <Icon className="mr-2 h-4 w-4" /> {label}
    </Button>
  );

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
                    <Link href="/investors"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Investor Details
                </h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="p-4 flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 text-4xl mb-4">
                        <AvatarFallback>{getInitials(investor.name)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{investor.name}</h2>
                    <p className="text-sm text-muted-foreground">{investor.email}</p>
                    <div className="flex items-center gap-2 pt-2">
                        {getStatusBadge(investor.kycStatus)}
                        {investor.isFrozen && <Badge variant="secondary" className="bg-sky-600/20 text-sky-400 border-sky-400/50">Frozen</Badge>}
                    </div>
                </div>

                <div className="px-4">
                    <Button variant="outline" className="w-full justify-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View KYC Platform
                    </Button>
                </div>
                
                <Separator />

                <div className="space-y-1">
                    <ActionButton icon={Edit} label="Update User" onClick={() => router.push(`/investors/${investor.id}/edit`)} />
                    <ActionButton icon={KeyRound} label="Reset Password" onClick={handleResetPassword} />
                    <ActionButton icon={Snowflake} label={investor.isFrozen ? 'Unfreeze Investor' : 'Freeze Investor'} onClick={handleToggleFreeze} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <ActionButton icon={Trash2} label="Cancel Access" className="text-red-500 hover:text-red-500" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to cancel access?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the investor &quot;{investor.name}&quot; and all associated data. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteInvestor} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Cancel Access</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
              </div>

              <div className="lg:col-span-3">
                <Tabs defaultValue="details">
                  <div className="w-full overflow-x-auto">
                    <TabsList className="inline-flex">
                      <TabsTrigger value="details">User Details</TabsTrigger>
                      <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                      <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                      <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="details" className="mt-6">
                    <Card>
                        <CardHeader><CardTitle>User Information</CardTitle></CardHeader>
                        <CardContent className="space-y-1">
                           <PersonalInfoRow label="Country of Residence" value={countryDisplay || 'Not set'} />
                            <PersonalInfoRow label="City" value={investor.city || 'Not set'} />
                            <PersonalInfoRow label="Legal Name" value={investor.legalName || 'Not set'} />
                            <PersonalInfoRow label="Date of Birth" value={investor.dob || 'Not set'} />
                            <PersonalInfoRow label="Identification Documents" value={investor.idDoc || 'Not set'} />
                            <PersonalInfoRow label="Address" value={investor.address || 'Not set'} />
                            <PersonalInfoRow label="Phone Number" value={investor.phone || 'Not provided'} />
                            <Separator className="my-2" />
                            <PersonalInfoRow label="Wallet Address" value={<span className="font-mono">{`${investor.walletAddress.slice(0, 7)}...${investor.walletAddress.slice(-4)}`}</span>} />
                            <PersonalInfoRow label="Joined Date" value={investor.joinedDate ? new Date(investor.joinedDate).toLocaleDateString() : 'N/A'} />
                        </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="portfolio" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Portfolio</CardTitle>
                            <CardDescription>An overview of the investor's holdings and total investment.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <InvestorPortfolio investor={investor} />
                        </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="subscriptions" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscriptions</CardTitle>
                            <CardDescription>All asset subscriptions for this investor.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <InvestorSubscriptions investor={investor} />
                        </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="orders" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders</CardTitle>
                            <CardDescription>Order history for this investor.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <InvestorOrders investorId={investor.id} />
                        </CardContent>
                    </Card>
                  </TabsContent>
                   <TabsContent value="transactions" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Transactions</CardTitle>
                            <CardDescription>Transaction history for this investor.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <InvestorTransactions investor={investor} />
                        </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
