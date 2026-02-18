
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

type SparkAddress = {
  id: string;
  address: string;
  alias: string;
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

const initialSparkAddresses: SparkAddress[] = [
    { id: 'spk1', address: 'spark1pgss...q6n7dvn', alias: 'Main Spark Wallet' },
];

const initialStablecoinAddresses: StablecoinAddress[] = [
  { id: 'sc1', coin: 'USDT', network: 'Tron', address: 'TX1q...m8ik9', alias: 'Tron Payouts' },
];

const SparkIcon = () => (
     <svg width="24" height="24" viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"><path fillRule="evenodd" clipRule="evenodd" d="M39.68 24.656L40.836 0H26.398l1.156 24.656-23.092-8.718L0 29.668l23.807 6.52L8.38 55.457l11.68 8.487 13.558-20.628 13.558 20.627 11.68-8.486L43.43 36.188l23.804-6.52-4.461-13.73-23.092 8.718zM33.617 33v.001z" fill="currentColor"></path></svg>
)

export default function PaymentMethodsPage() {
  const { toast } = useToast();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [btcAddresses, setBtcAddresses] = useState<BtcAddress[]>(initialBtcAddresses);
  const [sparkAddresses, setSparkAddresses] = useState<SparkAddress[]>(initialSparkAddresses);
  const [stablecoinAddresses, setStablecoinAddresses] = useState<StablecoinAddress[]>(initialStablecoinAddresses);
  
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  // Form states
  const [bankForm, setBankForm] = useState({ bankName: 'banco-agricola', accountHolder: '', accountNumber: '', accountType: 'Checking' as const, alias: '' });
  const [btcForm, setBtcForm] = useState({ address: '', alias: '', type: 'On-chain' as const });
  const [sparkForm, setSparkForm] = useState({ address: '', alias: '' });
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
  
  const handleAddBtcAddress = () => {
      if(!btcForm.address || !btcForm.alias) {
          toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill all required fields.' });
          return;
      }
      const newAddress: BtcAddress = {
          id: `btc-${Date.now()}`,
          address: `${btcForm.address.slice(0, 4)}...${btcForm.address.slice(-4)}`,
          alias: btcForm.alias,
          type: btcForm.type
      }
      setBtcAddresses(prev => [...prev, newAddress]);
      setDialogOpen(null);
      toast({ title: "Bitcoin address added successfully." });
  }

    const handleAddSparkAddress = () => {
        if (!sparkForm.address || !sparkForm.alias) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill all required fields.' });
            return;
        }
        const newAddress: SparkAddress = {
            id: `spark-${Date.now()}`,
            address: `${sparkForm.address.slice(0, 7)}...${sparkForm.address.slice(-4)}`,
            alias: sparkForm.alias
        };
        setSparkAddresses(prev => [...prev, newAddress]);
        setDialogOpen(null);
        toast({ title: "Spark address added successfully." });
    };

    const handleAddStablecoinAddress = () => {
        if (!stablecoinForm.address || !stablecoinForm.alias) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill all required fields.' });
            return;
        }
        const newAddress: StablecoinAddress = {
            id: `sc-${Date.now()}`,
            coin: stablecoinForm.coin,
            network: stablecoinForm.network,
            address: `${stablecoinForm.address.slice(0, 4)}...${stablecoinForm.address.slice(-4)}`,
            alias: stablecoinForm.alias
        };
        setStablecoinAddresses(prev => [...prev, newAddress]);
        setDialogOpen(null);
        toast({ title: "Stablecoin address added successfully." });
    };
  
  const handleDelete = (type: 'bank' | 'btc' | 'spark' | 'stablecoin', id: string) => {
    if (type === 'bank') setBankAccounts(prev => prev.filter(item => item.id !== id));
    if (type === 'btc') setBtcAddresses(prev => prev.filter(item => item.id !== id));
    if (type === 'spark') setSparkAddresses(prev => prev.filter(item => item.id !== id));
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
                    Withdrawal Methods
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
                                <p className="text-sm text-muted-foreground">Manage bank accounts for fiat currency withdrawals.</p>
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
                                  <DialogTitle>Add Bank Account</DialogTitle>
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
                                <p className="text-sm text-muted-foreground">Manage addresses for withdrawing Bitcoin.</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0">
                       <CardContent>
                          {btcAddresses.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Alias</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Address</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {btcAddresses.map(acc => (
                                  <TableRow key={acc.id}>
                                    <TableCell className="font-medium">{acc.alias}</TableCell>
                                    <TableCell>{acc.type}</TableCell>
                                    <TableCell className="font-mono">{acc.address}</TableCell>
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
                                            <AlertDialogDescription>This will permanently delete this Bitcoin address.</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete('btc', acc.id)}>Delete</AlertDialogAction>
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
                                <p>No Bitcoin addresses configured yet.</p>
                           </div>
                          )}
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Dialog open={dialogOpen === 'btc'} onOpenChange={(open) => setDialogOpen(open ? 'btc' : null)}>
                                <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Bitcoin Address</Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Add Bitcoin Withdrawal Address</DialogTitle></DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="btc-alias">Alias</Label>
                                            <Input id="btc-alias" value={btcForm.alias} onChange={e => setBtcForm(p => ({...p, alias: e.target.value}))} placeholder="e.g. My hardware wallet"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="btc-type">Type</Label>
                                            <Select value={btcForm.type} onValueChange={(v: 'On-chain' | 'Lightning') => setBtcForm(p => ({...p, type: v}))}>
                                                <SelectTrigger id="btc-type"><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="On-chain">On-chain</SelectItem>
                                                    <SelectItem value="Lightning">Lightning</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="btc-address">Address</Label>
                                            <Input id="btc-address" value={btcForm.address} onChange={e => setBtcForm(p => ({...p, address: e.target.value}))} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                        <Button onClick={handleAddBtcAddress}>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
                
                <AccordionItem value="spark" className="border-b-0">
                  <Card>
                    <AccordionTrigger className="p-6 hover:no-underline text-left">
                        <div className="flex items-center gap-4">
                            <SparkIcon />
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold leading-none tracking-tight">Bitcoin Spark</h3>
                                <p className="text-sm text-muted-foreground">Manage your addresses for withdrawing via Spark.</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0">
                        <CardContent>
                          {sparkAddresses.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Alias</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sparkAddresses.map(acc => (
                                        <TableRow key={acc.id}>
                                            <TableCell className="font-medium">{acc.alias}</TableCell>
                                            <TableCell className="font-mono">{acc.address}</TableCell>
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
                                                    <AlertDialogDescription>This will permanently delete this Spark address.</AlertDialogDescription>
                                                  </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete('spark', acc.id)}>Delete</AlertDialogAction>
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
                                   <p>No Spark addresses configured yet.</p>
                               </div>
                           )}
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Dialog open={dialogOpen === 'spark'} onOpenChange={(open) => setDialogOpen(open ? 'spark' : null)}>
                                <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Spark Address</Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Add Spark Withdrawal Address</DialogTitle></DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="spark-alias">Alias</Label>
                                            <Input id="spark-alias" value={sparkForm.alias} onChange={e => setSparkForm(p => ({...p, alias: e.target.value}))} placeholder="e.g. My primary wallet"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="spark-address">Address</Label>
                                            <Input id="spark-address" value={sparkForm.address} onChange={e => setSparkForm(p => ({...p, address: e.target.value}))} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                        <Button onClick={handleAddSparkAddress}>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
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
                                    <p className="text-sm text-muted-foreground">Manage your addresses for withdrawing stablecoins.</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0">
                             <CardContent>
                                {stablecoinAddresses.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Alias</TableHead>
                                                <TableHead>Coin</TableHead>
                                                <TableHead>Network</TableHead>
                                                <TableHead>Address</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stablecoinAddresses.map(acc => (
                                                <TableRow key={acc.id}>
                                                    <TableCell className="font-medium">{acc.alias}</TableCell>
                                                    <TableCell>{acc.coin}</TableCell>
                                                    <TableCell>{acc.network}</TableCell>
                                                    <TableCell className="font-mono">{acc.address}</TableCell>
                                                    <TableCell className="text-right">
                                                        <AlertDialog>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <AlertDialogTrigger asChild>
                                                                        <DropdownMenuItem className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                                                    </AlertDialogTrigger>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>This will permanently delete this Stablecoin address.</AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete('stablecoin', acc.id)}>Delete</AlertDialogAction>
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
                                    <p>No stablecoin addresses configured yet.</p>
                                </div>
                                )}
                            </CardContent>
                             <CardFooter className="justify-end">
                                <Dialog open={dialogOpen === 'stablecoin'} onOpenChange={(open) => setDialogOpen(open ? 'stablecoin' : null)}>
                                    <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Stablecoin Address</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader><DialogTitle>Add Stablecoin Withdrawal Address</DialogTitle></DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="sc-alias">Alias</Label>
                                                <Input id="sc-alias" value={stablecoinForm.alias} onChange={e => setStablecoinForm(p => ({...p, alias: e.target.value}))} placeholder="e.g. My payroll address"/>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="sc-coin">Coin</Label>
                                                    <Select value={stablecoinForm.coin} onValueChange={(v: 'USDT' | 'USDC') => setStablecoinForm(p => ({...p, coin: v}))}>
                                                        <SelectTrigger id="sc-coin"><SelectValue/></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="USDT">USDT</SelectItem>
                                                            <SelectItem value="USDC">USDC</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="sc-network">Network</Label>
                                                    <Select value={stablecoinForm.network} onValueChange={(v: 'Tron' | 'Ethereum' | 'Polygon') => setStablecoinForm(p => ({...p, network: v}))}>
                                                        <SelectTrigger id="sc-network"><SelectValue/></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Tron">Tron</SelectItem>
                                                            <SelectItem value="Ethereum">Ethereum</SelectItem>
                                                            <SelectItem value="Polygon">Polygon</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sc-address">Address</Label>
                                                <Input id="sc-address" value={stablecoinForm.address} onChange={e => setStablecoinForm(p => ({...p, address: e.target.value}))}/>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                            <Button onClick={handleAddStablecoinAddress}>Save</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
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
