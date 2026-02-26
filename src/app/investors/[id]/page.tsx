
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
import { ArrowLeft, Snowflake, ShieldCheck, User as UserIcon, Phone, KeyRound, Trash2, ChevronDown, Briefcase, ClipboardList, ShoppingBag, ArrowRightLeft, ExternalLink } from 'lucide-react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import InvestorPortfolio from '@/components/investors/investor-portfolio';
import InvestorOrders from '@/components/investors/investor-orders';
import InvestorSubscriptions from '@/components/investors/investor-subscriptions';
import InvestorTransactions from '@/components/investors/investor-transactions';

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

function InfoRowWithIcon({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) {
  return (
    <div className="flex items-center gap-4">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || 'Not provided'}</p>
      </div>
    </div>
  )
}

function PersonalInfoRow({ label, value, actionLabel, onActionClick }: { label: string; value: React.ReactNode; actionLabel?: string; onActionClick?: () => void; }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2">
            <p className="text-sm text-muted-foreground mb-1 sm:mb-0">{label}</p>
            <div className="flex items-center gap-4">
                {actionLabel && (
                    <Button variant="link" className="text-sm p-0 h-auto text-primary hover:underline" onClick={onActionClick}>
                        {actionLabel}
                    </Button>
                )}
                <div className="text-sm font-medium text-right break-all">{value}</div>
            </div>
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

  const maskEmail = (email: string) => {
      if (!email) return '';
      const [local, domain] = email.split('@');
      if (local.length > 3) {
          return `${local.substring(0, 2)}***@${domain}`;
      }
      return email;
  }

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
                    <Skeleton className="h-9 w-32" />
                </div>
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                        <Skeleton className="lg:col-span-3 h-64" />
                        <Skeleton className="lg:col-span-7 h-64" />
                    </div>
                    <Skeleton className="h-96" />
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
                    <AlertDialog>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Actions <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Link href={`/investors/${investor.id}/edit`}>
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleToggleFreeze}>
                            {investor.isFrozen ? 'Unfreeze Investor' : 'Freeze Investor'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleResetPassword}>
                            Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>
                                    Cancel Access
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                        </DropdownMenu>
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
            
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                    <Card className="lg:col-span-3">
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 text-4xl">
                                <AvatarFallback>{getInitials(investor.name)}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl pt-2">{investor.name}</CardTitle>
                            <CardDescription>User Level {investor.kycLevel || 0}</CardDescription>
                            <div className="flex items-center gap-2 pt-2">
                                {getStatusBadge(investor.kycStatus)}
                                {investor.isFrozen && <Badge variant="secondary" className="bg-sky-600/20 text-sky-400 border-sky-400/50">Frozen</Badge>}
                            </div>
                            <div className="pt-4">
                                <Button asChild variant="outline">
                                    <a href={`https://kyc-platform.example.com/user/${investor.id}`} target="_blank" rel="noopener noreferrer">
                                        View KYC Platform
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InfoRowWithIcon icon={UserIcon} label="Username" value={investor.name.toLowerCase().replace(/\s+/g, '')} />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-7">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <PersonalInfoRow label="Country of Residence" value={countryDisplay || 'Not set'} actionLabel="Change" />
                            <PersonalInfoRow label="City" value={investor.city || 'Not set'} />
                            <PersonalInfoRow label="Legal Name" value={investor.legalName || 'Not set'} />
                            <PersonalInfoRow label="Date of Birth" value={investor.dob || 'Not set'} />
                            <PersonalInfoRow label="Identification Documents" value={investor.idDoc || 'Not set'} />
                            <PersonalInfoRow label="Address" value={investor.address || 'Not set'} />
                            <PersonalInfoRow label="Email Address" value={maskEmail(investor.email)} />
                            <PersonalInfoRow label="Phone Number" value={investor.phone || 'Not provided'} />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {investor.joinedDate && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Joined Date</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{new Date(investor.joinedDate).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold font-mono truncate" title={investor.walletAddress}>{`${investor.walletAddress.slice(0, 7)}...${investor.walletAddress.slice(-4)}`}</p>
                        </CardContent>
                    </Card>
                    {investor.totalInvested !== undefined && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold font-mono">${investor.totalInvested.toLocaleString()}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Accordion type="single" collapsible className="w-full space-y-6" defaultValue="portfolio">
                    <AccordionItem value="portfolio" className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <Briefcase className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Portfolio</h3>
                                        <p className="text-sm text-muted-foreground">Current asset holdings for this investor.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <InvestorPortfolio investor={investor} />
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="subscriptions" className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                 <div className="flex items-center gap-4">
                                    <ClipboardList className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Asset Subscriptions</h3>
                                        <p className="text-sm text-muted-foreground">Assets this investor is subscribed to or has pending requests for.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <InvestorSubscriptions investor={investor} />
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="orders" className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                 <div className="flex items-center gap-4">
                                    <ShoppingBag className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Order History</h3>
                                        <p className="text-sm text-muted-foreground">All buy and sell orders placed by this investor.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <InvestorOrders investorId={investor.id} />
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="transactions" className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <ArrowRightLeft className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Transaction History</h3>
                                        <p className="text-sm text-muted-foreground">All transactions associated with this investor.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <InvestorTransactions investor={investor} />
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                </Accordion>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
