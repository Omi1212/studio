
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowDown, Wallet } from 'lucide-react';
import type { TokenDetails } from '@/lib/types';
import TokenIcon from '../ui/token-icon';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface PlaceOrderProps {
    token: TokenDetails;
    price: number;
}

const UsdtIcon = () => (
    <svg width="24" height="24" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <circle fill="#26A17B" cx="19" cy="19" r="19"/>
            <path d="M24.06 14.188h-3.35v-1.94c0-.248-.008-.49-.024-.728-.016-.237-.032-.45-.048-.636h-4.272c-.016.185-.032.4-.048.636-.016.238-.024.48-.024.728v1.94h-3.35V12.25h11.16v1.938zM12.918 25.5v-1.938h3.35v-5.916h-3.35v-1.938h11.16v1.938h-3.51v5.916h3.51v1.938H12.918z" fill="#FFF"/>
        </g>
    </svg>
)

export default function PlaceOrder({ token, price }: PlaceOrderProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [usdtAmount, setUsdtAmount] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [userBalance] = useState(50000); // Static balance for demo

    useEffect(() => {
        if (usdtAmount && !isNaN(Number(usdtAmount)) && price > 0) {
            const calculatedTokenAmount = Number(usdtAmount) / price;
            setTokenAmount(calculatedTokenAmount.toLocaleString('en-US', { maximumFractionDigits: 6 }));
        } else if (usdtAmount === '') {
            setTokenAmount('');
        }
    }, [usdtAmount, price]);

    const handlePercentage = (percentage: number) => {
        const amount = userBalance * (percentage / 100);
        setUsdtAmount(amount.toString());
    };

    const handlePlaceOrder = () => {
        if (!usdtAmount || Number(usdtAmount) <= 0) {
            toast({
                variant: "destructive",
                title: "Invalid Amount",
                description: "Please enter a valid amount to place an order.",
            });
            return;
        }

        if (Number(usdtAmount) > userBalance) {
             toast({
                variant: "destructive",
                title: "Insufficient Balance",
                description: `Your balance of ${userBalance.toLocaleString()} USDT is not enough.`,
            });
            return;
        }

        console.log(`Placing order for ${tokenAmount} ${token.tokenTicker} with ${usdtAmount} USDT`);

        toast({
            title: "Order Placed Successfully!",
            description: `Your order for ${tokenAmount} ${token.tokenTicker} has been submitted.`,
        });

        // Add a new pending order to localStorage
        const newOrder = {
             id: `order-${Math.random().toString(36).substring(2, 9)}`,
            investorId: 'inv-001', // Example investor ID
            investorName: 'Alice Johnson', // Example investor name
            tokenId: token.id,
            tokenTicker: token.tokenTicker,
            type: 'Buy',
            amount: Number(usdtAmount) / price,
            price: price,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

        router.push('/orders');
    }

    return (
        <Card className="relative">
            <CardContent className="p-6 space-y-4">
                {/* You Pay Section */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-2">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            <span>Balance: {userBalance.toLocaleString()} USDT</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <button onClick={() => handlePercentage(25)} className="hover:text-primary">25%</button>
                            <button onClick={() => handlePercentage(50)} className="hover:text-primary">50%</button>
                            <button onClick={() => handlePercentage(100)} className="hover:text-primary">Max</button>
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                             <p className="text-sm text-muted-foreground">You Pay</p>
                            <Input
                                type="number"
                                placeholder="0.0"
                                value={usdtAmount}
                                onChange={(e) => setUsdtAmount(e.target.value)}
                                className="text-3xl font-bold border-none shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-muted p-2 rounded-full">
                            <UsdtIcon />
                            <span className="font-semibold">USDT</span>
                        </div>
                    </div>
                </div>

                {/* Swap Icon */}
                <div className="flex justify-center -my-6 z-10">
                    <div className="flex-center h-8 w-8 rounded-full bg-muted border">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>

                {/* You Receive Section */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-2">
                    <div className="flex justify-between items-end">
                       <div>
                            <p className="text-sm text-muted-foreground">You Receive</p>
                            <p className="text-3xl font-bold h-auto p-0">{tokenAmount || '0.0'}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-muted p-2 rounded-full">
                            <TokenIcon token={token} className="h-6 w-6" />
                            <span className="font-semibold">{token.tokenTicker}</span>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">1 {token.tokenTicker} ≈ ${price.toFixed(4)} USDT</p>
                </div>

                <Button className="w-full" onClick={handlePlaceOrder}>
                    Place Order
                </Button>
            </CardContent>
        </Card>
    );
}
