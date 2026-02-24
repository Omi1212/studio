

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
import { ArrowLeft, Edit, Power, PowerOff } from 'lucide-react';
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
import type { Issuer } from '@/lib/types';
import IssuerAssets from '@/components/issuer-management/issuer-assets';

function getStatusBadge(status: Issuer['status']) {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>;
    case 'inactive':
      return <Badge variant="destructive">Inactive</Badge>;
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

export default function IssuerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [issuer, setIssuer] = useState<Issuer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    if (!id) return;
    setLoading(true);
    fetch(`/api/issuers/${id}`)
        .then(res => {
            if (!res.ok) throw new Error('Issuer not found');
            return res.json();
        })
        .then(data => setIssuer(data))
        .catch(err => {
            console.error(err);
            setIssuer(null);
        })
        .finally(() => setLoading(false));
  }, [params]);

  const handleToggleStatus = async () => {
    if (!issuer) return;
    const newStatus = issuer.status === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetch(`/api/issuers/${issuer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');

      const updatedIssuer = await response.json();
      setIssuer(updatedIssuer);

      toast({
          title: "Status Updated",
          description: `Issuer "${issuer.name}" is now ${newStatus}.`,
      });

    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update status.' });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading issuer details...</p>
      </div>
    );
  }

  if (!issuer) {
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
                        <Link href="/issuer-management"><ArrowLeft /></Link>
                    </Button>
                    <h1 className="text-3xl font-headline font-semibold">
                        Issuer Details
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                       <Link href={`/issuer-management/${issuer.id}/edit`}><Edit className="mr-2 h-4 w-4"/>Edit</Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <Button variant={issuer.status === 'active' ? 'destructive' : 'outline'}>
                                {issuer.status === 'active' ? 
                                    <><PowerOff className="mr-2 h-4 w-4" /> Set Inactive</> : 
                                    <><Power className="mr-2 h-4 w-4" /> Set Active</>
                                }
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This will change the status of the issuer "{issuer.name}" to {issuer.status === 'active' ? 'Inactive' : 'Active'}.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleToggleStatus}>Confirm</AlertDialogAction>
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
                            <AvatarFallback>{issuer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{issuer.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(issuer.status)}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoRow label="Email" value={issuer.email} />
                    <InfoRow label="Wallet Address" value={<span className="font-mono">{issuer.walletAddress}</span>} />
                </CardContent>
            </Card>

            <IssuerAssets issuer={issuer} />

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
