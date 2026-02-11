'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Banknote, Bitcoin, Plus, DollarSign, Zap } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function SettingsInput({ id, label, description, placeholder, value }: { id: string, label: string, description?: string, placeholder?: string, value?: string }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            <Input id={id} placeholder={placeholder} defaultValue={value} />
        </div>
    );
}


export default function PaymentMethodsPage() {
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
            
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Banknote className="h-6 w-6" />
                        <CardTitle>Bank Accounts</CardTitle>
                    </div>
                    <CardDescription>
                        Manage your linked bank accounts for payouts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                        <p>No bank accounts added yet.</p>
                   </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Bank Account
                    </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Bitcoin className="h-6 w-6" />
                        <CardTitle>Bitcoin</CardTitle>
                    </div>
                    <CardDescription>
                        Configure your Bitcoin addresses for receiving payments.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <SettingsInput 
                        id="btc-address"
                        label="On-chain BTC Address"
                        placeholder="bc1..."
                    />
                    <SettingsInput 
                        id="btc-xpub"
                        label="Bitcoin xPub / zPub"
                        description="Used for generating new addresses for each invoice."
                        placeholder="xpub..."
                    />
                     <SettingsInput 
                        id="lightning-address"
                        label="Lightning Address / LNURL"
                        placeholder="name@provider.com"
                    />
                </CardContent>
                <CardFooter>
                    <Button>Save Bitcoin Settings</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Zap className="h-6 w-6" />
                        <CardTitle>Other Networks</CardTitle>
                    </div>
                    <CardDescription>
                        Configure addresses for other supported networks.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <SettingsInput 
                        id="spark-address"
                        label="Spark Address"
                        placeholder="spark1..."
                    />
                      <SettingsInput 
                        id="liquid-usdt-address"
                        label="Liquid USDT Address"
                        placeholder="lq1..."
                    />
                </CardContent>
                 <CardFooter>
                    <Button>Save Network Settings</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                     <div className="flex items-center gap-3">
                        <DollarSign className="h-6 w-6" />
                        <CardTitle>Stablecoins</CardTitle>
                    </div>
                    <CardDescription>
                       Manage your stablecoin addresses and payout preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <SettingsInput 
                        id="erc20-address"
                        label="ERC-20 USDT/USDC Address"
                        placeholder="0x..."
                    />
                    <SettingsInput 
                        id="polygon-address"
                        label="Polygon Stablecoin Address"
                        placeholder="0x..."
                    />
                    <Separator />
                     <div className="space-y-2">
                        <Label htmlFor="payout-method">Stablecoin Payout Method</Label>
                        <p className="text-sm text-muted-foreground">Choose how you want to receive stablecoin payouts.</p>
                        <Select defaultValue="automatic">
                            <SelectTrigger id="payout-method">
                                <SelectValue placeholder="Select a method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="automatic">Automatic</SelectItem>
                                <SelectItem value="manual">Manual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button>Save Stablecoin Settings</Button>
                </CardFooter>
              </Card>

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
