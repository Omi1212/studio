'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Order, TokenDetails, PaymentDetails } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TokenIcon from '../ui/token-icon';
import { ArrowLeft, Landmark, Copy, Eye } from 'lucide-react';
import React from 'react';

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

function BankDetails({ orderReference, onPay, amount }: { orderReference: string; amount: number; onPay: (details: Partial<Omit<PaymentDetails, 'transactionId'>>) => void }) {
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
            title: 'Copied!',
            description: `Copied to clipboard.`,
        });
    };
    
    const handlePayClick = () => {
        onPay({
            method: 'Bank Transfer',
            bankName: currentBankDetails.Bank,
            accountNumber: currentBankDetails['Account Number'],
            reference: currentBankDetails.Reference,
        });
    };

    return (
        <Card className="bg-muted/30 flex flex-col h-full">
            <CardHeader>
                <CardTitle className="text-center text-lg font-semibold">Copy bank details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
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
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total:</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium font-mono text-primary">${amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                 <Alert>
                    <AlertDescription>
                        Please use the invoice number as a reference for your transfer. Once the transfer is complete, it may take some time to be reflected.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter>
                 <Button className="w-full" onClick={handlePayClick}>I&apos;ve made the payment</Button>
            </CardFooter>
        </Card>
    );
}

function BitcoinPaymentDetails({ orderReference, amount, onPay }: { orderReference: string; amount: number; onPay: (details: Partial<Omit<PaymentDetails, 'transactionId'>>) => void; }) {
    const { toast } = useToast();
    const [paymentType, setPaymentType] = useState('lightning');
    const [isAddressVisible, setIsAddressVisible] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

    const lightningAddress = 'lnbc1190n1p5kujxfpp59mejv93rk75hctd5t398fkfsncgzdk3c9d5y9mav5nelde4dul3qdp2v3shyanfde6xjctwdd5kjgzsfafjq5mpd3jhxgpsxycqzpuxqrwzqsp5u88azqdmchu3vz92hfh0zs0a53k9wh2vezrnejwem0fw5892mf0s9qxpqysgqratk74qpdt23smxz9zpl8n8tdx8rxakp5r9nehrktw4eskr9vfa9dj9rcld8krf0ra875ep4tucg2ven0v7zs2v35huwvzhh3lapcfqp7z72zt';
    const onChainAddress = 'bc1pmn8m4u2pqvkwpxfx7ygc7sl4c3httujfdrnqsyeuvn9qt4uklz6s57tcnz';

    const fullAddress = paymentType === 'lightning' ? lightningAddress : onChainAddress;

    useEffect(() => {
        const generateQrCode = async () => {
            try {
                const url = await QRCode.toDataURL(fullAddress, {
                    errorCorrectionLevel: 'L',
                    margin: 1,
                    scale: 8,
                });
                setQrCodeDataUrl(url);
            } catch (err) {
                console.error(err);
                setQrCodeDataUrl(''); // clear on error
            }
        };

        if (fullAddress) {
            generateQrCode();
        }
    }, [fullAddress]);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied!',
            description: `${field} copied to clipboard.`,
        });
    };

    const truncatedAddress = isAddressVisible ? fullAddress : `${fullAddress.slice(0,15)}...${fullAddress.slice(-15)}`;
    
    const satsAmount = (amount / 65000) * 100000000;
    
    const handlePayClick = () => {
        onPay({
            method: 'Bitcoin',
            network: paymentType === 'lightning' ? 'Lightning' : 'On-chain',
            cryptoAddress: fullAddress,
        });
    };

    return (
        <Card className="bg-muted/30">
            <CardHeader>
                <CardTitle className="text-center text-lg font-semibold">Pay to</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Tabs value={paymentType} onValueChange={setPaymentType} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="lightning">Lightning</TabsTrigger>
                        <TabsTrigger value="on-chain">On-chain</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex justify-center p-4">
                     <div className="relative border-2 border-orange-500 rounded-lg p-2 bg-white">
                        {qrCodeDataUrl ? (
                            <img
                                src={qrCodeDataUrl}
                                alt="QR Code"
                                className="rounded-md"
                                width={220}
                                height={220}
                            />
                        ) : (
                            <div className="w-[220px] h-[220px] flex items-center justify-center bg-gray-200 rounded-md">
                                <p>Generating QR...</p>
                            </div>
                        )}
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-orange-500 p-2 rounded-full flex items-center justify-center text-white">
                                <BtcIcon />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-2 text-sm">
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total</span>
                        <div className="flex flex-col items-end">
                            <span className="font-medium font-mono text-orange-500">${amount.toFixed(2)}</span>
                            <span className="font-medium font-mono text-muted-foreground">{satsAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} SATS</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Pay to</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium font-mono break-all">{truncatedAddress}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsAddressVisible(!isAddressVisible)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                 <Button variant="outline" className="w-full" onClick={() => copyToClipboard(fullAddress, 'Address')}>Copy</Button>
                 <Button className="w-full" onClick={handlePayClick}>Open In Wallet</Button>
            </CardFooter>
        </Card>
    );
}

function SparkPaymentDetails({ orderReference, amount, onPay }: { orderReference: string; amount: number; onPay: (details: Partial<Omit<PaymentDetails, 'transactionId'>>) => void; }) {
    const { toast } = useToast();
    const [isAddressVisible, setIsAddressVisible] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

    const sparkAddress = 'spark1pgss8grzdccq54hwecptpevgzqnf5uut7qp865zkvlpdfeeuw578x23q6n7dvn';

    useEffect(() => {
        const generateQrCode = async () => {
            try {
                const url = await QRCode.toDataURL(sparkAddress, {
                    errorCorrectionLevel: 'L',
                    margin: 1,
                    scale: 8,
                });
                setQrCodeDataUrl(url);
            } catch (err) {
                console.error(err);
                setQrCodeDataUrl('');
            }
        };

        if (sparkAddress) {
            generateQrCode();
        }
    }, [sparkAddress]);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied!',
            description: `${field} copied to clipboard.`,
        });
    };
    
    const handlePayClick = () => {
        onPay({
            method: 'Bitcoin Spark',
            cryptoAddress: sparkAddress
        });
    };

    const truncatedAddress = isAddressVisible ? sparkAddress : `${sparkAddress.slice(0,15)}...${sparkAddress.slice(-15)}`;
    
    return (
        <Card className="bg-muted/30">
            <CardHeader>
                <CardTitle className="text-center text-lg font-semibold">Pay to</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-center p-4">
                     <div className="relative border-2 border-primary rounded-lg p-2 bg-white">
                        {qrCodeDataUrl ? (
                            <img
                                src={qrCodeDataUrl}
                                alt="QR Code"
                                className="rounded-md"
                                width={220}
                                height={220}
                            />
                        ) : (
                            <div className="w-[220px] h-[220px] flex items-center justify-center bg-gray-200 rounded-md">
                                <p>Generating QR...</p>
                            </div>
                        )}
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-primary p-2 rounded-full flex items-center justify-center text-white">
                                <SparkIcon />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-2 text-sm">
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total</span>
                        <div className="flex flex-col items-end">
                            <span className="font-medium font-mono text-primary">${amount.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Pay to</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium font-mono break-all">{truncatedAddress}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsAddressVisible(!isAddressVisible)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                 <Button variant="outline" className="w-full" onClick={() => copyToClipboard(sparkAddress, 'Address')}>Copy</Button>
                 <Button className="w-full" onClick={handlePayClick}>Open In Wallet</Button>
            </CardFooter>
        </Card>
    );
}

function StablecoinPaymentDetails({ orderReference, amount, onPay }: { orderReference: string; amount: number; onPay: (details: Partial<Omit<PaymentDetails, 'transactionId'>>) => void; }) {
    const { toast } = useToast();
    const [stablecoin, setStablecoin] = useState('usdt');
    const [network, setNetwork] = useState('tron');
    const [isAddressVisible, setIsAddressVisible] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

    const addresses = {
        usdt: {
            tron: 'TX1qaz2wsxhn7ujm8ik9TX1qaz2wsxhn7ujm8ik9',
            ethereum: '0x1234567890123456789012345678901234567890',
            polygon: '0x0987654321098765432109876543210987654321',
        },
        usdc: {
            tron: 'TRC20USDCAddressTRC20USDCAddressTRC20USDC',
            ethereum: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            polygon: '0xfedcbafedcbafedcbafedcbafedcbafedcbafed',
        }
    };

    const currentAddress = addresses[stablecoin as keyof typeof addresses][network as keyof typeof addresses.usdt];

    useEffect(() => {
        const generateQrCode = async () => {
            if (!currentAddress) return;
            try {
                const url = await QRCode.toDataURL(currentAddress, {
                    errorCorrectionLevel: 'L',
                    margin: 1,
                    scale: 8,
                });
                setQrCodeDataUrl(url);
            } catch (err) {
                console.error(err);
                setQrCodeDataUrl('');
            }
        };

        generateQrCode();
    }, [currentAddress]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied!',
            description: `Address copied to clipboard.`,
        });
    };

    const truncatedAddress = isAddressVisible ? currentAddress : `${currentAddress.slice(0,10)}...${currentAddress.slice(-10)}`;
    
    const handlePayClick = () => {
        onPay({
            method: 'Stablecoin',
            stablecoin: stablecoin.toUpperCase() as 'USDT' | 'USDC',
            network: network,
            cryptoAddress: currentAddress,
        });
    };

    return (
        <Card className="bg-muted/30">
            <CardHeader>
                <CardTitle className="text-center text-lg font-semibold">Scan QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Tabs value={stablecoin} onValueChange={setStablecoin} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="usdt">USDT</TabsTrigger>
                        <TabsTrigger value="usdc">USDC</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex justify-center p-4">
                     <div className="relative border-2 border-primary rounded-lg p-2 bg-white">
                        {qrCodeDataUrl ? (
                            <img
                                src={qrCodeDataUrl}
                                alt="QR Code"
                                className="rounded-md"
                                width={220}
                                height={220}
                            />
                        ) : (
                            <div className="w-[220px] h-[220px] flex items-center justify-center bg-gray-200 rounded-md">
                                <p>Generating QR...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4 pt-2 text-sm">
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-medium font-mono text-primary">${amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Network</span>
                        <Select value={network} onValueChange={setNetwork}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tron">Tron (TRC20)</SelectItem>
                                <SelectItem value="ethereum">Ethereum (ERC20)</SelectItem>
                                <SelectItem value="polygon">Polygon</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Pay to</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium font-mono break-all">{truncatedAddress}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsAddressVisible(!isAddressVisible)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                 <Button variant="outline" className="w-full" onClick={() => copyToClipboard(currentAddress)}>Copy</Button>
                 <Button className="w-full" onClick={handlePayClick}>Open In Wallet</Button>
            </CardFooter>
        </Card>
    );
}

function InvestmentSummary({ order, token }: { order: Order; token: TokenDetails }) {
    const investmentAmount = order.amount * order.price;
    const platformFee = 0; // As per image
    const finalAmount = investmentAmount + platformFee;

    return (
        <div className="space-y-6 h-full flex flex-col">
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-lg">Investment details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Token</span>
                        <div className="flex items-center gap-2">
                            <TokenIcon token={token} className="h-5 w-5" />
                            <span className="font-medium">{token.tokenTicker}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Token price</span>
                        <span className="font-mono">${order.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Investment</span>
                        <span className="font-mono">${investmentAmount.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-muted/30 flex-1">
                <CardHeader>
                    <CardTitle className="text-lg">Purchase summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Tokens to be minted</span>
                        <span className="font-mono">{order.amount} {token.tokenTicker}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total amount</span>
                        <span className="font-mono">${investmentAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Platform fee</span>
                        <span className="font-mono">$0 / 0%</span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center font-bold text-base">
                        <span>Final amount</span>
                        <span className="font-mono">${finalAmount.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface PaymentMethodsProps {
    order: Order;
    token: TokenDetails;
    onPaymentConfirmed: () => void;
}

const generateTxId = (method: string, network?: string): string => {
    const randomHex = [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    if (method === 'Bitcoin' || method === 'Stablecoin') {
        if (network === 'ethereum' || network === 'polygon') return `0x${randomHex}`;
        return randomHex; // For BTC on-chain and Tron
    }
    if (method === 'Bitcoin Spark') {
        return randomHex.slice(0, 32);
    }
    // Lightning invoice is passed as cryptoAddress, txid is different. A real app would get it after payment.
    // For demo, we just generate a random one.
    return randomHex;
};

export default function PaymentMethods({ order, token, onPaymentConfirmed }: PaymentMethodsProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [activePaymentMethod, setActivePaymentMethod] = useState('');

    const investmentAmount = order.amount * order.price;

    const paymentOptions = [
        { id: 'btc', label: 'Bitcoin', icon: <BtcIcon /> },
        { id: 'bank', label: 'Bank Transfers', icon: <Landmark /> },
        { id: 'spark', label: 'Bitcoin Spark', icon: <SparkIcon /> },
        { id: 'usdt', label: 'Stablecoin', icon: <UsdtIcon /> },
    ];

    const handleContinue = () => {
        if (selectedPaymentMethod) {
            setActivePaymentMethod(selectedPaymentMethod);
            setStep(2);
            setSelectedPaymentMethod(''); // Deselect after continuing
        }
    };
    
    const handleBack = () => {
        setStep(1);
        setActivePaymentMethod('');
        setSelectedPaymentMethod('');
    };

    const handlePaymentMade = async (details: Partial<Omit<PaymentDetails, 'transactionId'>>) => {
        try {
            let txId: string | undefined;
            if (details.method !== 'Bank Transfer') {
                txId = generateTxId(details.method!, details.network);
            }

            const paymentDetails: PaymentDetails = {
                ...details,
                transactionId: txId,
            } as PaymentDetails;
            
            const response = await fetch(`/api/orders/${order.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'pending', paymentDetails }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status.');
            }

            toast({
                title: "Payment Submitted",
                description: "Your payment is being processed. The order status will be updated shortly.",
            });
            if (onPaymentConfirmed) {
                onPaymentConfirmed();
            }
            router.push('/orders');
        } catch (error: any) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Could not submit payment confirmation.',
            });
        }
    };

    const renderRightColumn = () => {
        if (step === 1) {
            return <InvestmentSummary order={order} token={token} />;
        }

        switch (activePaymentMethod) {
            case 'bank':
                return <BankDetails orderReference={order.id} onPay={handlePaymentMade} amount={investmentAmount} />;
            case 'btc':
                return <BitcoinPaymentDetails orderReference={order.id} amount={investmentAmount} onPay={handlePaymentMade} />;
            case 'spark':
                return <SparkPaymentDetails orderReference={order.id} amount={investmentAmount} onPay={handlePaymentMade} />;
            case 'usdt':
                return <StablecoinPaymentDetails orderReference={order.id} amount={investmentAmount} onPay={handlePaymentMade} />;
            default:
                 return <InvestmentSummary order={order} token={token} />;
        }
    };
    
    return (
        <>
            <DialogHeader className="text-center pb-4 relative">
                <DialogTitle className="flex justify-center items-center h-full">
                     {step === 2 && (
                        <Button variant="ghost" size="icon" className="absolute left-0" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <span className="text-lg font-semibold">
                        Checkout
                        {step === 2 && activePaymentMethod && ` / ${paymentOptions.find(p => p.id === activePaymentMethod)?.label}`}
                    </span>
                </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2 flex flex-col">
                    <div className="space-y-2">
                        {paymentOptions.map(option => (
                            <div
                                key={option.id}
                                onClick={() => setSelectedPaymentMethod(option.id)}
                                className={cn(
                                    "flex items-center gap-4 rounded-md border-2 p-4 cursor-pointer transition-colors hover:bg-muted/50",
                                    selectedPaymentMethod === option.id ? "border-primary bg-primary/10" : "border-muted"
                                )}
                            >
                                {React.cloneElement(option.icon, { className: "h-10 w-10" })}
                                <span className="font-medium text-lg">{option.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className='mt-auto pt-4'>
                        <Button className="w-full" onClick={handleContinue} disabled={!selectedPaymentMethod}>
                            Continue
                        </Button>
                    </div>
                </div>
                <div>
                    {renderRightColumn()}
                </div>
            </div>
        </>
    );
}
