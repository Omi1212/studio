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
import { ArrowLeft, Check, X, Edit, User as UserIcon, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
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
import type { User } from '@/lib/types';
import { countries } from '@/lib/countries';


type WhitelistRequest = User & {
    joinedDate: string;
};

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

function getStatusBadge(status: WhitelistRequest['kycStatus']) {
  switch (status) {
    case 'verified':
      return <Badge variant="outline" className="text-green-400 border-green-400">Accepted</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

export default function RequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [request, setRequest] = useState<WhitelistRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    if (!id) return;
    setLoading(true);
    fetch(`/api/investors/${id}`)
        .then(res => {
            if (res.ok) return res.json();
            throw new Error("Request not found");
        })
        .then(data => {
            setRequest({ ...data, joinedDate: data.joinedDate || new Date().toISOString() });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
  }, [params]);
  
  const handleUpdateStatus = async (status: 'verified' | 'rejected') => {
    if (!request) return;

    try {
      const response = await fetch(`/api/investors/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kycStatus: status }),
      });
      if (!response.ok) throw new Error('Failed to update request');
      
      const updatedRequest = await response.json();
      setRequest(updatedRequest);

      toast({
          title: `Request ${status === 'verified' ? 'Approved' : 'Rejected'}`,
          description: `The request for "${request.name}" has been updated.`
      });
      router.push('/whitelisting-requests');

    } catch (error) {
      console.error(error);
      toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not update the request.'
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
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading request details...</p>
      </div>
    );
  }

  if (!request) {
    notFound();
  }
  
  const countryObj = countries.find(c => c.value === request.country || c.label === request.country);
  const countryDisplay = countryObj ? countryObj.label : request.country;


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
                        <Link href="/whitelisting-requests"><ArrowLeft /></Link>
                    </Button>
                    <h1 className="text-3xl font-headline font-semibold">
                        Request Details
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/whitelisting-requests/${request.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                    </Button>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                    <Card className="lg:col-span-3">
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 text-4xl">
                                <AvatarFallback>{getInitials(request.name)}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl pt-2">{request.name}</CardTitle>
                            <CardDescription>User Level {request.kycLevel || 0}</CardDescription>
                            <div className="flex items-center gap-2">
                                {getStatusBadge(request.kycStatus)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InfoRowWithIcon icon={UserIcon} label="Username" value={request.name.toLowerCase().replace(/\s+/g, '')} />
                            <InfoRowWithIcon icon={Phone} label="Phone Number" value={request.phone} />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-7">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <PersonalInfoRow label="Country of Residence" value={countryDisplay || 'Not set'} />
                            <PersonalInfoRow label="City" value={request.city || 'Not set'} />
                            <PersonalInfoRow label="Legal Name" value={request.legalName || 'Not set'} />
                            <PersonalInfoRow label="Date of Birth" value={request.dob || 'Not set'} />
                            <PersonalInfoRow label="Identification Documents" value={request.idDoc || 'Not set'} />
                            <PersonalInfoRow label="Address" value={request.address || 'Not set'} />
                            <PersonalInfoRow label="Email Address" value={maskEmail(request.email)} />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {request.joinedDate && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Request Date</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{new Date(request.joinedDate).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold font-mono truncate" title={request.walletAddress}>{request.walletAddress}</p>
                        </CardContent>
                    </Card>
                </div>


            {request.kycStatus === 'pending' && (
             <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                                <X className="mr-2 h-4 w-4" /> Reject Request
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to reject this request?</AlertDialogTitle>
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
                    <Button className="w-full" onClick={() => handleUpdateStatus('verified')}>
                        <Check className="mr-2 h-4 w-4" /> Approve Request
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
