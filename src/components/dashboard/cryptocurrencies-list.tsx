import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cryptoData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Star } from 'lucide-react';

export default function CryptocurrenciesList({ className }: { className?: string }) {
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
          {cryptoData.map((crypto) => (
            <div key={crypto.ticker} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {crypto.ticker === 'BTC' ? (
                     <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png" alt="Bitcoin logo" />
                  ) : crypto.icon ? (
                    <div className="flex items-center justify-center h-full w-full bg-muted rounded-full">
                        <AvatarFallback className="bg-muted text-foreground">{crypto.ticker}</AvatarFallback>
                    </div>
                  ) : (
                    <AvatarFallback>{crypto.ticker}</AvatarFallback>
                  )}
                   {crypto.ticker !== 'BTC' && <AvatarFallback className="bg-muted text-foreground">{crypto.ticker}</AvatarFallback>}
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
