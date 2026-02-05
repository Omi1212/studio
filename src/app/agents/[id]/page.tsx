
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
import { ArrowLeft, Power, PowerOff } from 'lucide-react';
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
import type { User } from '@/lib/types';
import AgentTokens from '@/components/agents/agent-tokens';

function getStatusBadge(status: User['status']) {
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

export default function AgentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [agent, setAgent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;
    if (!id) return;
    setLoading(true);
    fetch(`/api/users/${id}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Agent not found');
      })
      .then((data: User) => {
        if (data && data.role === 'agent') {
            setAgent(data);
        } else {
            setAgent(null);
        }
      })
      .catch(err => {
        console.error(err);
        setAgent(null);
      })
      .finally(() => setLoading(false));
  }, [params]);

  const handleToggleStatus = () => {
    if (!agent) return;
    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    const updatedAgent = { ...agent, status: newStatus };
    setAgent(updatedAgent);
    
    // NOTE: This change is not persisted. This is for demonstration purposes only.
    // In a real application, you would make a PUT/PATCH request to your API to update the data.
    toast({
        title: "Status Updated (Not Persisted)",
        description: `Agent "${agent.name}" is now ${newStatus}.`,
    });
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>Loading agent details...</p>
      </div>
    );
  }

  if (!agent) {
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
                        <Link href="/agents"><ArrowLeft /></Link>
                    </Button>
                    <h1 className="text-3xl font-headline font-semibold">
                        Agent Details
                    </h1>
                </div>
                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <Button variant={agent.status === 'active' ? 'destructive' : 'outline'}>
                                {agent.status === 'active' ? 
                                    <><PowerOff className="mr-2 h-4 w-4" /> Set Inactive</> : 
                                    <><Power className="mr-2 h-4 w-4" /> Set Active</>
                                }
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This will change the status of the agent "{agent.name}" to {agent.status === 'active' ? 'Inactive' : 'Active'}.
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
                            <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{agent.name}</CardTitle>
                             <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(agent.status)}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoRow label="Email" value={agent.email} />
                    <InfoRow label="Role" value={<span className="capitalize">{agent.role}</span>} />
                    <InfoRow label="Wallet Address" value={<span className="font-mono">{agent.walletAddress}</span>} />
                </CardContent>
            </Card>
            <AgentTokens agent={agent} />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
