
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TokenDetails } from '@/lib/types';
import { CircleDollarSign, Lock, CheckCircle2 } from 'lucide-react';

interface SupplyCardsProps {
    token: TokenDetails;
}

export default function SupplyCards({ token }: SupplyCardsProps) {

    const supplyData = [
        {
            title: "Circulating supply",
            value: "0.00",
            icon: CircleDollarSign,
        },
        {
            title: "Total unblocked",
            value: "0.00",
            icon: CheckCircle2,
        },
        {
            title: "Total blocked",
            value: "0.00",
            icon: Lock,
        },
    ]


  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {supplyData.map((item) => (
            <Card key={item.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">{item.value}</div>
                </CardContent>
            </Card>
        ))}
    </div>
  );
}
