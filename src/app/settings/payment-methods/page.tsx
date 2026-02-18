'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Banknote, Bitcoin, Plus, DollarSign, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type BankAccount = {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  accountType: 'Checking' | 'Savings';
  alias?: string;
};

type BtcAddress = {
  id: string;
  address: string;
  alias: string;
  type: 'On-chain' | 'Lightning';
};

type StablecoinAddress = {
  id: string;
  coin: 'USDT' | 'USDC';
  network: 'Tron' | 'Ethereum' | 'Polygon';
  address: string;
  alias: string;
};

const initialBankAccounts: BankAccount[] = [
  { id: 'ba1', bankName: 'Banco Agrícola', accountHolder: 'Jane Smith', accountNumber: '**** **** **** 1234', accountType: 'Checking', alias: 'Main Account' },
];

const initialBtcAddresses: BtcAddress[] = [
  { id: 'btc1', address: 'bc1p...cnz', alias: 'My Cold Wallet', type: 'On-chain' },
];

const initialStablecoinAddresses: StablecoinAddress[] = [
  { id: 'sc1', coin: 'USDT', network: 'Tron', address: 'TX1q...8ik9', alias: 'Tron Payouts' },
];

export default function PaymentMethodsPage() {
  const { toast } = useToast();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [btcAddresses, setBtcAddresses] = useState<BtcAddress[]>(initialBtcAddresses);
  const [stablecoinAddresses, setStablecoinAddresses] = useState<StablecoinAddress[]>(initialStablecoinAddresses);
  
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  // Form states
  const [bankForm, setBankForm] = useState({ bankName: 'banco-agricola', accountHolder: '', accountNumber: '', accountType: 'Checking' as const, alias: '' });
  const [btcForm, setBtcForm] = useState({ address: '', alias: '', type: 'On-chain' as const });
  const [stablecoinForm, setStablecoinForm] = useState({ coin: 'USDT' as const, network: 'Tron' as const, address: '', alias: '' });

  const handleAddBankAccount = () => {
    if (!bankForm.accountHolder || !bankForm.accountNumber) {
        toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill all required fields.' });
        return;
    }
    const newAccount: BankAccount = {
        id: `ba-${Date.now()}`,
        bankName: bankForm.bankName === 'banco-agricola' ? 'Banco Agrícola' : 'Citi Bank',
        accountHolder: bankForm.accountHolder,
        accountNumber: `**** **** **** ${bankForm.accountNumber.slice(-4)}`,
        accountType: bankForm.accountType,
        alias: bankForm.alias || `${bankForm.bankName} Account`,
    };
    setBankAccounts(prev => [...prev, newAccount]);
    setDialogOpen(null);
    toast({ title: "Bank account added successfully." });
  };
  
  const handleDelete = (type: 'bank' | 'btc' | 'stablecoin', id: string) => {
    if (type === 'bank') setBankAccounts(prev => prev.filter(item => item.id !== id));
    if (type === 'btc') setBtcAddresses(prev => prev.filter(item => item.id !== id));
    if (type === 'stablecoin') setStablecoinAddresses(prev => prev.filter(item => item.id !== id));
    toast({ title: "Item removed successfully." });
  };


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
                    <Link href="/settings"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Payment Methods
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-6">
                <AccordionItem value="bank-accounts" className="border-b-0">
                  <Card>
                    <AccordionTrigger className="p-6 hover:no-underline text-left">
                        <div className="flex items-center gap-4">
                            <Banknote className="h-6 w-6" />
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold leading-none tracking-tight">Bank Accounts</h3>
                                <p className="text-sm text-muted-foreground">Manage your linked bank accounts for payouts.</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0">
                        <CardContent>
                          {bankAccounts.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Alias</TableHead>
                                        <TableHead>Bank</TableHead>
                                        <TableHead>Account</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bankAccounts.map(acc => (
                                        <TableRow key={acc.id}>
                                            <TableCell className="font-medium">{acc.alias}</TableCell>
                                            <TableCell>{acc.bankName}</TableCell>
                                            <TableCell className="font-mono">{acc.accountNumber}</TableCell>
                                            <TableCell className="text-right">
                                              <AlertDialog>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                      <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-red-600">
                                                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                      </AlertDialogTrigger>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <AlertDialogContent>
                                                  <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This will permanently delete this bank account.</AlertDialogDescription>
                                                  </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete('bank', acc.id)}>Delete</AlertDialogAction>
                                                  </AlertDialogFooter>
                                                </AlertDialogContent>
                                              </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                          ) : (
                             <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                                <p>No bank accounts added yet.</p>
                             </div>
                          )}
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Dialog open={dialogOpen === 'bank'} onOpenChange={(open) => setDialogOpen(open ? 'bank' : null)}>
                              <DialogTrigger asChild>
                                <Button><Plus className="mr-2 h-4 w-4" /> Add Bank Account</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add New Bank Account</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="bankName">Bank Name</Label>
                                    <Select value={bankForm.bankName} onValueChange={(value) => setBankForm(prev => ({ ...prev, bankName: value }))}>
                                      <SelectTrigger id="bankName"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="banco-agricola">Banco Agrícola</SelectItem>
                                        <SelectItem value="citi-bank">Citi Bank</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                   <div className="space-y-2">
                                      <Label htmlFor="alias">Alias (Optional)</Label>
                                      <Input id="alias" value={bankForm.alias} onChange={(e) => setBankForm(prev => ({ ...prev, alias: e.target.value }))} placeholder="e.g. My Savings" />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="accountHolder">Account Holder Name</Label>
                                      <Input id="accountHolder" value={bankForm.accountHolder} onChange={(e) => setBankForm(prev => ({ ...prev, accountHolder: e.target.value }))} />
                                  </div>
                                   <div className="space-y-2">
                                      <Label htmlFor="accountNumber">Account Number</Label>
                                      <Input id="accountNumber" value={bankForm.accountNumber} onChange={(e) => setBankForm(prev => ({ ...prev, accountNumber: e.target.value }))} />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="accountType">Account Type</Label>
                                      <Select value={bankForm.accountType} onValueChange={(value: 'Checking' | 'Savings') => setBankForm(prev => ({ ...prev, accountType: value }))}>
                                        <SelectTrigger id="accountType"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Checking">Checking</SelectItem>
                                          <SelectItem value="Savings">Savings</SelectItem>
                                        </SelectContent>
                                      </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                  <Button onClick={handleAddBankAccount}>Save</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                <AccordionItem value="bitcoin" className="border-b-0">
                  <Card>
                    <AccordionTrigger className="p-6 hover:no-underline text-left">
                        <div className="flex items-center gap-4">
                            <Bitcoin className="h-6 w-6" />
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold leading-none tracking-tight">Bitcoin</h3>
                                <p className="text-sm text-muted-foreground">Configure your Bitcoin addresses for receiving payments.</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0">
                       <CardContent>
                           <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                                <p>No Bitcoin addresses configured yet.</p>
                           </div>
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Button disabled>
                                <Plus className="mr-2 h-4 w-4" />
                                Configure Bitcoin
                            </Button>
                        </CardFooter>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                <AccordionItem value="stablecoins" className="border-b-0">
                    <Card>
                        <AccordionTrigger className="p-6 hover:no-underline text-left">
                            <div className="flex items-center gap-4">
                                <DollarSign className="h-6 w-6" />
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold leading-none tracking-tight">Stablecoins</h3>
                                    <p className="text-sm text-muted-foreground">Manage your stablecoin addresses and payout preferences.</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0">
                             <CardContent>
                                <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                                    <p>No stablecoin addresses configured yet.</p>
                                </div>
                            </CardContent>
                             <CardFooter className="justify-end">
                                <Button disabled>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Configure Stablecoins
                                </Button>
                            </CardFooter>
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
