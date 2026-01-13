
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
import { ArrowLeft, Check, X, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type WhitelistRequest = typeof investorsData[0];

function getStatusBadge(status: WhitelistRequest['status']) {
  switch (status) {
    case 'whitelisted':
      return <Badge variant="outline" className="text-green-400 border-green-400">Whitelisted</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
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

export default function RequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [request, setRequest] = useState<WhitelistRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    const storedInvestors: WhitelistRequest[] = JSON.parse(localStorage.getItem('investors') || JSON.stringify(investorsData));
    const foundRequest = storedInvestors.find(inv => inv.id === id);
    
    if (foundRequest) {
      setRequest(foundRequest);
    }
    setLoading(false);
  }, [params]);
  
  const handleUpdateStatus = (status: 'whitelisted' | 'rejected') => {
    if (!request) return;
    const updatedRequest = { ...request, status: status === 'whitelisted' ? 'whitelisted' : 'pending' }; // Assuming reject keeps it pending for now
    
    const storedInvestors: WhitelistRequest[] = JSON.parse(localStorage.getItem('investors') || '[]');
    const updatedInvestors = storedInvestors.map(inv => inv.id === request.id ? updatedRequest : inv);
    localStorage.setItem('investors', JSON.stringify(updatedInvestors));

    toast({
        title: `Request ${status === 'whitelisted' ? 'Approved' : 'Rejected'}`,
        description: `The request for "${request.name}" has been updated.`
    });
    router.push('/whitelisting-requests');
  };

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
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 text-2xl">
                            <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{request.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(request.status)}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoRow label="Email" value={request.email} />
                    <InfoRow label="Wallet Address" value={<span className="font-mono">{request.walletAddress}</span>} />
                    <InfoRow label="Request Date" value={new Date(request.joinedDate).toLocaleDateString()} />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full" onClick={() => handleUpdateStatus('rejected')}>
                        <X className="mr-2 h-4 w-4" /> Reject Request
                    </Button>
                    <Button className="w-full" onClick={() => handleUpdateStatus('whitelisted')}>
                        <Check className="mr-2 h-4 w-4" /> Approve Request
                    </Button>
                </CardContent>
             </Card>

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
