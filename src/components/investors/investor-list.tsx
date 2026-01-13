
'use client';

import { useState, useEffect } from 'react';
import { investorsData } from '@/lib/data';
import type { ViewMode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreVertical, LayoutGrid, List, UserPlus, Edit, Trash2, Snowflake } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
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
import { useToast } from '@/hooks/use-toast';


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

function InvestorCard({ investor, onDelete, onToggleFreeze }: { investor: Investor, onDelete: (id: string) => void, onToggleFreeze: (id: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{investor.name}</CardTitle>
              <CardDescription>{investor.email}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onToggleFreeze(investor.id)}>
                <Snowflake className="mr-2 h-4 w-4" /> {investor.isFrozen ? 'Unfreeze' : 'Freeze'} Address
              </DropdownMenuItem>
               <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={!investor.isFrozen}>
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">Status</span>
          {getStatusBadge(investor.status)}
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">Invested</span>
          <span className="font-medium font-mono">${investor.totalInvested.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Wallet</span>
            <span className="font-medium font-mono truncate">{investor.walletAddress.slice(0, 7)}...{investor.walletAddress.slice(-4)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
           <Link href={`/investors/${investor.id}`}>View Details</Link>
        </Button>
      </CardFooter>
       <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the investor "{investor.name}" and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onDelete(investor.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </Card>
  );
}

function InvestorTableRow({ investor, onDelete, onToggleFreeze }: { investor: Investor, onDelete: (id: string) => void, onToggleFreeze: (id: string) => void }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{investor.name}</p>
            <p className="text-sm text-muted-foreground">{investor.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="font-mono">${investor.totalInvested.toLocaleString()}</span>
      </TableCell>
       <TableCell className="hidden lg:table-cell">
        <span className="font-mono">{investor.walletAddress.slice(0, 7)}...{investor.walletAddress.slice(-4)}</span>
      </TableCell>
      <TableCell className="hidden sm:table-cell">{getStatusBadge(investor.status)}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/investors/${investor.id}`}>View Details</Link>
            </DropdownMenuItem>
             <DropdownMenuItem onSelect={() => onToggleFreeze(investor.id)}>
              {investor.isFrozen ? 'Unfreeze' : 'Freeze'} Address
            </DropdownMenuItem>
             <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 focus:text-red-500" disabled={!investor.isFrozen}>
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the investor "{investor.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(investor.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </TableCell>
    </TableRow>
  );
}


export default function InvestorList({ view, setView }: { view: ViewMode, setView: (mode: ViewMode) => void }) {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    const storedInvestors = localStorage.getItem('investors');
    if (storedInvestors) {
      setInvestors(JSON.parse(storedInvestors));
    } else {
      setInvestors(investorsData);
      localStorage.setItem('investors', JSON.stringify(investorsData));
    }
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const updatedInvestors = investors.filter(inv => inv.id !== id);
    setInvestors(updatedInvestors);
    localStorage.setItem('investors', JSON.stringify(updatedInvestors));
  };
  
  const handleToggleFreeze = (id: string) => {
    const updatedInvestors = investors.map(inv => {
      if (inv.id === id) {
        return { ...inv, isFrozen: !inv.isFrozen };
      }
      return inv;
    });
    setInvestors(updatedInvestors);
    localStorage.setItem('investors', JSON.stringify(updatedInvestors));
    
    const targetInvestor = updatedInvestors.find(inv => inv.id === id);
    if(targetInvestor) {
        toast({
            title: `Address ${targetInvestor.isFrozen ? 'Frozen' : 'Unfrozen'}`,
            description: `The wallet address for "${targetInvestor.name}" has been ${targetInvestor.isFrozen ? 'frozen' : 'unfrozen'}.`,
        });
    }
  };


  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-headline font-semibold">Your Investors</h2>
        <Card className="h-64 animate-pulse bg-muted/50"></Card>
      </div>
    );
  }

  if (investors.length === 0) {
    return (
      <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
        <UserPlus className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No investors yet</h2>
        <p className="text-muted-foreground mb-4">Get started by adding your first investor.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Investors</h2>
        <div className="hidden sm:flex items-center gap-1 bg-muted p-1 rounded-lg">
          <Button
            variant={view === 'card' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView('card')}
            aria-label="Card View"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'table' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView('table')}
            aria-label="Table View"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {view === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {investors.map(investor => (
             <AlertDialog key={investor.id}>
                <InvestorCard investor={investor} onDelete={handleDelete} onToggleFreeze={handleToggleFreeze} />
             </AlertDialog>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor</TableHead>
                <TableHead className="hidden md:table-cell">Total Invested</TableHead>
                <TableHead className="hidden lg:table-cell">Wallet</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investors.map(investor => (
                <AlertDialog key={investor.id}>
                  <InvestorTableRow investor={investor} onDelete={handleDelete} onToggleFreeze={handleToggleFreeze} />
                </AlertDialog>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
