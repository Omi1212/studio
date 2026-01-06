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
                  {crypto.icon ? (
                    <div className="flex items-center justify-center h-full w-full bg-muted rounded-full">
                       {crypto.ticker === 'BTC' ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-orange-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 1.25a10.75 10.75 0 1 0 10.75 10.75A10.76 10.76 0 0 0 12 1.25zm5.12 14.06h-1.9a.63.63 0 0 1-.61-.49l-.42-1.63h-4.6l-.21.84a.63.63 0 0 1-.6.5H7.78a.31.31 0 0 1-.3-.39l2.7-10.75a.32.32 0 0 1 .3-.24h4.48a.31.31 0 0 1 .3.39zm-2.4-3.56L13.6 7.42h-2.8l-1.12 4.33zm.88 5.75c.4 0 .73-.21.9-.52l.21-.61h2a.31.31 0 0 1 .3.4.31.31 0 0 1 0 .09 2.5 2.5 0 0 1-2.22 1.48 2.89 2.89 0 0 1-3.23-2.1.63.63 0 0 0-.6-.5h-1a.63.63 0 0 1-.6-.5.63.63 0 0 1 .62-.75h1a.63.63 0 0 0 .6-.5 2.89 2.89 0 0 1 3.23-2.1 2.5 2.5 0 0 1 2.22 1.48.31.31 0 0 1 0 .09.31.31 0 0 1-.3.4h-2l-.21-.61c-.17-.31-.5-.52-.9-.52a1.28 1.28 0 0 0-1.39 1.28v.84a1.28 1.28 0 0 0 1.39 1.28z" />
                        </svg>
                      ) : (
                         <AvatarFallback className="bg-muted text-foreground">{crypto.ticker}</AvatarFallback>
                      )}
                    </div>
                  ) : (
                    <AvatarFallback>{crypto.ticker}</AvatarFallback>
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
