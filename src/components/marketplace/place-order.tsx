
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowDown, Wallet, ArrowDownUp } from 'lucide-react';
import type { TokenDetails } from '@/lib/types';
import TokenIcon from '../ui/token-icon';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ordersData } from '@/lib/data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface PlaceOrderProps {
    token: TokenDetails;
    price: number;
    isSubscribed: boolean;
}

const UsdtIcon = () => (
    <svg width="24" height="24" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <circle fill="#26A17B" cx="19" cy="19" r="19"/>
            <path d="M24.06 14.188h-3.35v-1.94c0-.248-.008-.49-.024-.728-.016-.237-.032-.45-.048-.636h-4.272c-.016.185-.032.4-.048.636-.016.238-.024.48-.024.728v1.94h-3.35V12.25h11.16v1.938zM12.918 25.5v-1.938h3.35v-5.916h-3.35v-1.938h11.16v1.938h-3.51v5.916h3.51v1.938H12.918z" fill="#FFF"/>
        </g>
    </svg>
)

export default function PlaceOrder({ token, price, isSubscribed }: PlaceOrderProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [isSwapped, setIsSwapped] = useState(false);
    const [amountA, setAmountA] = useState(''); // Top field
    const [amountB, setAmountB] = useState(''); // Bottom field
    const [lastEdited, setLastEdited] = useState<'A' | 'B'>('A');

    const [userBalance] = useState(50000); // Static balance for demo

    const tokenA = isSwapped ? token : { tokenName: 'Tether', tokenTicker: 'USDT' };
    const tokenB = isSwapped ? { tokenName: 'Tether', tokenTicker: 'USDT' } : token;
    
    const balanceA = isSwapped ? 0 : userBalance; // Assuming 0 balance for the offered token

    useEffect(() => {
        if (price > 0) {
            if (lastEdited === 'A') {
                const numA = parseFloat(amountA);
                if (!isNaN(numA)) {
                    const resultB = isSwapped ? numA * price : numA / price;
                    setAmountB(resultB.toLocaleString('en-US', { maximumFractionDigits: 6, useGrouping: false }));
                } else {
                    setAmountB('');
                }
            } else if (lastEdited === 'B') {
                const numB = parseFloat(amountB);
                if (!isNaN(numB)) {
                    const resultA = isSwapped ? numB / price : numB * price;
                    setAmountA(resultA.toLocaleString('en-US', { maximumFractionDigits: 2, useGrouping: false }));
                } else {
                    setAmountA('');
                }
            }
        }
    }, [amountA, amountB, isSwapped, price, lastEdited]);

    const handleAmountAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmountA(e.target.value);
        setLastEdited('A');
    };

    const handleAmountBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmountB(e.target.value);
        setLastEdited('B');
    };

    const handlePercentage = (percentage: number) => {
        if (!isSwapped) {
            const amount = userBalance * (percentage / 100);
            setAmountA(amount.toString());
            setLastEdited('A');
        }
    };
    
    const handleSwap = () => {
        setIsSwapped(!isSwapped);
        setAmountA(amountB);
        setAmountB(amountA);
    };

    const handlePlaceOrder = () => {
        const usdtAmount = isSwapped ? parseFloat(amountB) : parseFloat(amountA);
        const tokenAmount = isSwapped ? parseFloat(amountA) : parseFloat(amountB);

        if (!usdtAmount || usdtAmount <= 0) {
            toast({
                variant: "destructive",
                title: "Invalid Amount",
                description: "Please enter a valid amount to place an order.",
            });
            return;
        }

        if (usdtAmount > userBalance) {
             toast({
                variant: "destructive",
                title: "Insufficient Balance",
                description: `Your balance of ${userBalance.toLocaleString()} USDT is not enough.`,
            });
            return;
        }

        toast({
            title: "Order Placed Successfully!",
            description: `Your order for ${tokenAmount.toLocaleString()} ${token.tokenTicker} has been submitted.`,
        });

        const newOrder = {
             id: `order-${Math.random().toString(36).substring(2, 9)}`,
            investorId: 'inv-001',
            investorName: 'Alice Johnson',
            tokenId: token.id,
            tokenTicker: token.tokenTicker,
            type: 'Buy',
            amount: tokenAmount,
            price: price,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('orders') || JSON.stringify(ordersData));
        localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

        router.push('/orders');
    }

    const OrderButton = (
        <Button className="w-full" onClick={handlePlaceOrder} disabled={!isSubscribed}>
            Place Order
        </Button>
    )

    return (
        <Card className="relative">
            <CardContent className="p-6 space-y-4">
                {/* Field A */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-2">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            <span>Balance: {balanceA.toLocaleString()} {tokenA.tokenTicker}</span>
                        </div>
                        {!isSwapped && (
                            <div className="flex items-center gap-2">
                                <button onClick={() => handlePercentage(25)} className="hover:text-primary">25%</button>
                                <button onClick={() => handlePercentage(50)} className="hover:text-primary">50%</button>
                                <button onClick={() => handlePercentage(100)} className="hover:text-primary">Max</button>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                             <p className="text-sm text-muted-foreground">You Pay</p>
                            <Input
                                type="number"
                                placeholder="0.0"
                                value={amountA}
                                onChange={handleAmountAChange}
                                className="text-3xl font-bold border-none shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-muted p-2 rounded-full">
                            {isSwapped ? <TokenIcon token={tokenA} className="h-6 w-6" /> : <UsdtIcon />}
                            <span className="font-semibold">{tokenA.tokenTicker}</span>
                        </div>
                    </div>
                </div>

                {/* Swap Icon */}
                <div className="flex justify-center -my-6 z-10">
                    <Button variant="outline" size="icon" className="flex-center h-8 w-8 rounded-full bg-muted border" onClick={handleSwap}>
                        <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>

                {/* Field B */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-2">
                    <div className="flex justify-between items-end">
                       <div>
                            <p className="text-sm text-muted-foreground">You Receive</p>
                             <Input
                                type="number"
                                placeholder="0.0"
                                value={amountB}
                                onChange={handleAmountBChange}
                                className="text-3xl font-bold border-none shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-muted p-2 rounded-full">
                            {isSwapped ? <UsdtIcon /> : <TokenIcon token={tokenB} className="h-6 w-6" />}
                            <span className="font-semibold">{tokenB.tokenTicker}</span>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">1 {token.tokenTicker} ≈ ${price.toFixed(4)} USDT</p>
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
            </CardContent>
        </Card>
    );
}
