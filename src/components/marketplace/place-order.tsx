'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { TokenDetails } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ordersData } from '@/lib/data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Landmark, Copy } from 'lucide-react';
import TokenIcon from '../ui/token-icon';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from 'react';
import { DialogHeader, DialogTitle } from '../ui/dialog';


// Icons
const BtcIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M12.3 4.3a1 1 0 0 0-1.1.2l-3 3.3a1 1 0 0 0 .8 1.6h2.2c.4 0 .7.5.5.8l-3.3 6.6a1 1 0 0 0 1.6.8l3-3.3a1 1 0 0 0-.8-1.6H10c-.4 0-.7-.5-.5-.8l3.3-6.6a1 1 0 0 0-.5-.8z"/>
        <path d="M7 14h1.4c.8 0 1.5.7 1.5 1.5v1.4c0 .8-.7 1.5-1.5 1.5H7z"/>
        <path d="M14 7h1.4c.8 0 1.5.7 1.5 1.5v1.4c0 .8-.7 1.5-1.5 1.5H14z"/>
    </svg>
)

const SparkIcon = () => (
     <svg width="24" height="24" viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8"><path fillRule="evenodd" clipRule="evenodd" d="M39.68 24.656L40.836 0H26.398l1.156 24.656-23.092-8.718L0 29.668l23.807 6.52L8.38 55.457l11.68 8.487 13.558-20.628 13.558 20.627 11.68-8.486L43.43 36.188l23.804-6.52-4.461-13.73-23.092 8.718zM33.617 33v.001z" fill="currentColor"></path></svg>
)

const UsdtIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4h-6"/>
        <path d="M12 6v12"/>
    </svg>
)


interface PlaceOrderProps {
    token: TokenDetails;
    price: number;
    isSubscribed: boolean;
    onOrderPlaced?: () => void;
    step: number;
    onStepChange: (step: number) => void;
}

export default function PlaceOrder({ token, price, isSubscribed, onOrderPlaced, step, onStepChange }: PlaceOrderProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [quantity, setQuantity] = useState('');
    const [investmentAmount, setInvestmentAmount] = useState(0);
    const [prospectusConfirmed, setProspectusConfirmed] = useState(false);
    const [orderInfoConfirmed, setOrderInfoConfirmed] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderId, setOrderId] = useState('');
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);
    
    const minLimit = 1;
    const maxLimit = 250;

    const paymentOptions = [
        { id: 'btc', label: 'Bitcoin', icon: <BtcIcon /> },
        { id: 'bank', label: 'Bank Transfers', icon: <Landmark /> },
        { id: 'credit-card', label: 'Credit Card', icon: <Landmark /> },
        { id: 'usdt', label: 'Stablecoin', icon: <UsdtIcon /> },
    ]

    useEffect(() => {
        const numQuantity = parseFloat(quantity);
        if (!isNaN(numQuantity) && price > 0) {
            setInvestmentAmount(numQuantity * price);
        } else {
            setInvestmentAmount(0);
        }
    }, [quantity, price]);

     useEffect(() => {
        if (step === 1) {
            setShowPaymentDetails(false);
            setPaymentMethod('');
        }
    }, [step]);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numValue = parseFloat(value);
        if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
           setQuantity(value);
        }
    };

    const handlePlaceOrder = () => {
        toast({
            title: "Order Placed Successfully!",
            description: `Your order for ${parseFloat(quantity).toLocaleString()} ${token.tokenTicker} has been submitted.`,
        });

        const newOrder = {
             id: orderId,
            investorId: 'inv-001', // Hardcoded for demo
            investorName: 'Alice Johnson', // Hardcoded for demo
            tokenId: token.id,
            tokenTicker: token.tokenTicker,
            type: 'Buy' as const,
            amount: parseFloat(quantity),
            price: price,
            date: new Date().toISOString(),
            status: 'pending' as const
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('orders') || JSON.stringify(ordersData));
        localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

        localStorage.setItem('selectedTokenId', token.id);

        if (onOrderPlaced) {
            onOrderPlaced();
        }
        router.push('/orders');
    }

    const handleNextStep = () => {
        const tokenAmount = parseFloat(quantity);
         if (!tokenAmount || tokenAmount <= 0 || !prospectusConfirmed || !orderInfoConfirmed) {
            return;
        }
        if (tokenAmount < minLimit || tokenAmount > maxLimit) {
            toast({
                variant: "destructive",
                title: "Invalid Quantity",
                description: `Quantity must be between ${minLimit} and ${maxLimit} ${token.tokenTicker}.`,
            });
            return;
        }
        if (!orderId) {
            setOrderId(`INV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
        }
        onStepChange(2);
    }
    
    const handleContinueToPaymentDetails = () => {
        if (!paymentMethod) {
            toast({
                variant: "destructive",
                title: "Payment method required",
                description: "Please select a payment method to continue.",
            });
            return;
        }
        setShowPaymentDetails(true);
    };

    function BankDetails({ orderReference }: { orderReference: string }) {
        const { toast } = useToast();
        const [selectedBank, setSelectedBank] = useState('banco-agricola');
    
        const bankData = {
            'banco-agricola': {
                'Bank': 'Banco Agrícola',
                'Account Holder': 'Tiankii S.A. de C.V.',
                'Account Number': '123-456789-0',
                'Account Type': 'Corriente',
                'Reference': orderReference,
            },
            'citi-bank': {
                'Bank': 'Citi Bank',
                'Account Holder': 'Tiankii S.A. de C.V.',
                'Account Number': '987-654321-1',
                'Account Type': 'Corriente',
                'Reference': orderReference,
            }
        };
    
        const currentBankDetails = bankData[selectedBank as keyof typeof bankData];
    
        const copyToClipboard = (text: string) => {
            navigator.clipboard.writeText(text);
            toast({
                title: 'Copiado!',
                description: `Se ha copiado al portapapeles.`,
            });
        };
    
        return (
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-center text-lg font-semibold">Copy bank details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs value={selectedBank} onValueChange={setSelectedBank} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="banco-agricola">Banco Agrícola</TabsTrigger>
                            <TabsTrigger value="citi-bank">Citi Bank</TabsTrigger>
                        </TabsList>
                    </Tabs>
    
                    <div className="space-y-4 pt-2 text-sm">
                        {Object.entries(currentBankDetails).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center">
                                <span className="text-muted-foreground">{key}:</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium font-mono">{value}</span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(value)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
    
                     <Alert>
                        <AlertDescription>
                            Please use the invoice number as a reference for your transfer. Once the transfer is complete, it may take some time to be reflected.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }
    
    const renderStep1 = () => {
        const isOrderButtonDisabled = !quantity || parseFloat(quantity) <= 0 || !prospectusConfirmed || !orderInfoConfirmed || !isSubscribed;
        const OrderButton = (
            <Button className="w-full" onClick={handleNextStep} disabled={isOrderButtonDisabled}>
                Next
            </Button>
        )

        return (
          <>
            <DialogHeader className="text-center pb-4">
              <DialogTitle>Checkout</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="relative">
                        <Input
                            id="quantity"
                            type="number"
                            placeholder="100"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="pr-20"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-muted-foreground font-semibold">
                            {token.tokenTicker}
                        </span>
                    </div>
                     <div className="text-xs text-muted-foreground flex justify-between px-1">
                        <span>Price: ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                        <span>Min: {minLimit} {token.tokenTicker} / Max: {maxLimit} {token.tokenTicker}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="investment-amount">Investment Amount</Label>
                    <div className="relative">
                        <Input
                            id="investment-amount"
                            type="text"
                            value={`$${investmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            disabled
                            className="bg-muted/50"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <div className="flex items-start space-x-3">
                        <Checkbox id="prospectus" checked={prospectusConfirmed} onCheckedChange={(checked) => setProspectusConfirmed(!!checked)} className="mt-1" />
                        <Label htmlFor="prospectus" className="text-sm font-normal text-muted-foreground leading-snug">
                            I confirm I have read the offering's <a href="#" className="underline text-primary">Prospectus</a>.
                        </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                        <Checkbox id="order-info" checked={orderInfoConfirmed} onCheckedChange={(checked) => setOrderInfoConfirmed(!!checked)} className="mt-1"/>
                        <Label htmlFor="order-info" className="text-sm font-normal text-muted-foreground leading-snug">
                        I confirm the submitted order information is correct.
                        </Label>
                    </div>
                </div>
                
                {isSubscribed ? OrderButton : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="w-full">
                                    {OrderButton}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>You must be subscribed to this offering to place an order.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
          </>
        )
    }

    const renderStep2 = () => {
        const selectedOption = paymentOptions.find(o => o.id === paymentMethod);
        const breadcrumb = paymentMethod ? (
            <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-muted-foreground cursor-pointer" onClick={() => {setShowPaymentDetails(false); setPaymentMethod('')}}>Checkout</span>
                <span className="text-lg font-medium text-muted-foreground">/</span>
                <span className="text-lg font-semibold">{selectedOption?.label}</span>
            </div>
        ) : (
            <span className="text-lg font-semibold">Checkout</span>
        );
        return (
            <>
            <DialogHeader className="pb-4">
              <DialogTitle>{breadcrumb}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                        {paymentOptions.map(option => (
                             <div
                                key={option.id}
                                onClick={() => !showPaymentDetails && setPaymentMethod(option.id)}
                                className={cn(
                                    "flex items-center gap-4 rounded-md border-2 p-4 cursor-pointer transition-colors",
                                    paymentMethod === option.id ? "border-primary bg-primary/10" : "border-muted",
                                    showPaymentDetails ? "cursor-not-allowed opacity-50" : "hover:bg-muted/50"
                                )}
                             >
                                {React.cloneElement(option.icon, { className: "h-10 w-10" })}
                                <span className="font-medium text-lg">{option.label}</span>
                            </div>
                        ))}
                    </div>
                    {!showPaymentDetails ? (
                        <Button className="w-full mt-2 h-11" onClick={handleContinueToPaymentDetails} disabled={!paymentMethod}>Continue</Button>
                    ) : (
                        <Button className="w-full mt-2 h-11" onClick={handlePlaceOrder}>Confirm Purchase</Button>
                    )}
                </div>
                <div className="space-y-4">
                     {!showPaymentDetails ? (
                        <>
                            <Card className="bg-muted/30">
                                <CardHeader>
                                    <CardTitle className="text-base">Investment details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Token</span>
                                        <div className="flex items-center gap-2">
                                            <TokenIcon token={token} className="w-6 h-6" />
                                            <span className="font-medium">{token.tokenTicker}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Token price</span>
                                        <span className="font-mono">${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Investment</span>
                                        <span className="font-mono">${investmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/30">
                                <CardHeader>
                                    <CardTitle className="text-base">Purchase summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tokens to be minted</span>
                                        <span className="font-medium font-mono">{parseFloat(quantity).toLocaleString()} {token.tokenTicker}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total amount</span>
                                        <span className="font-mono">${investmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Platform fee</span>
                                        <span className="font-medium font-mono">$0 / 0%</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold">
                                        <span>Final amount</span>
                                        <span className="font-mono">${investmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                     ) : (
                        paymentMethod === 'bank' ? (
                            <BankDetails orderReference={orderId} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 border rounded-lg bg-muted/30">
                                <p className="text-muted-foreground">Payment details for {paymentMethod.toUpperCase()} would be shown here.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
            </>
        )
    }

    return step === 1 ? renderStep1() : renderStep2();
}
