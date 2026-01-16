'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { TokenDetails } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ordersData } from '@/lib/data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

interface PlaceOrderProps {
    token: TokenDetails;
    price: number;
    isSubscribed: boolean;
    onOrderPlaced: () => void;
}

export default function PlaceOrder({ token, price, isSubscribed, onOrderPlaced }: PlaceOrderProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [quantity, setQuantity] = useState('');
    const [investmentAmount, setInvestmentAmount] = useState(0);
    const [prospectusConfirmed, setProspectusConfirmed] = useState(false);
    const [orderInfoConfirmed, setOrderInfoConfirmed] = useState(false);
    
    const minLimit = 1;
    const maxLimit = 250;

    useEffect(() => {
        const numQuantity = parseFloat(quantity);
        if (!isNaN(numQuantity) && price > 0) {
            setInvestmentAmount(numQuantity * price);
        } else {
            setInvestmentAmount(0);
        }
    }, [quantity, price]);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numValue = parseFloat(value);
        if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
           setQuantity(value);
        }
    };

    const handlePlaceOrder = () => {
        const tokenAmount = parseFloat(quantity);

        if (!tokenAmount || tokenAmount <= 0) {
            toast({
                variant: "destructive",
                title: "Invalid Quantity",
                description: "Please enter a valid quantity to place an order.",
            });
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
        
        // Assuming user has enough balance, as it's not specified in the new modal.

        toast({
            title: "Order Placed Successfully!",
            description: `Your order for ${tokenAmount.toLocaleString()} ${token.tokenTicker} has been submitted.`,
        });

        const newOrder = {
             id: `order-${Math.random().toString(36).substring(2, 9)}`,
            investorId: 'inv-001', // Hardcoded for demo
            investorName: 'Alice Johnson', // Hardcoded for demo
            tokenId: token.id,
            tokenTicker: token.tokenTicker,
            type: 'Buy' as const,
            amount: tokenAmount,
            price: price,
            date: new Date().toISOString(),
            status: 'pending' as const
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('orders') || JSON.stringify(ordersData));
        localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

        onOrderPlaced();
        router.push('/orders');
    }

    const isOrderButtonDisabled = !quantity || parseFloat(quantity) <= 0 || !prospectusConfirmed || !orderInfoConfirmed || !isSubscribed;

    const OrderButton = (
        <Button className="w-full" onClick={handlePlaceOrder} disabled={isOrderButtonDisabled}>
            Next
        </Button>
    )

    return (
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
                    <span>Min limit: {minLimit} {token.tokenTicker}</span>
                    <span>Price: ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span>Max limit: {maxLimit} {token.tokenTicker}</span>
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
                        className="pr-20 bg-muted/50"
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
    );
}
