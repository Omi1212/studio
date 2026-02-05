'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

type Crypto = {
    ticker: string;
    name: string;
    balance: number;
    value: number;
    icon: string | null;
    isToken: boolean;
};

export default function CryptocurrenciesList({ className }: { className?: string }) {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetch('/api/crypto')
        .then(res => res.json())
        .then(data => setCryptos(data))
        .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Skeleton className={cn("h-[400px]", className)} />;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-headline">Cryptocurrencies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <span>Asset</span>
          <span>Balance</span>
        </div>
        <div className="space-y-6">
          {cryptos.map((crypto) => (
            <div key={crypto.ticker} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {crypto.ticker === 'BTC' ? (
                     <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png" alt="Bitcoin logo" />
                  ) : crypto.icon ? (
                     <AvatarImage src={crypto.icon} alt={`${crypto.name} logo`} />
                  ) : (
                    <AvatarFallback className="bg-muted text-foreground">{crypto.ticker}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold">{crypto.ticker}</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {crypto.isToken && <Star className="h-3 w-3" />}
                    <span>{crypto.name}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium font-mono">{crypto.balance.toLocaleString('en-US')}</p>
                <p className="text-sm text-muted-foreground font-mono">~${crypto.value.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
