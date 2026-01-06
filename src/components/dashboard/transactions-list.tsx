import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { transactionData } from '@/lib/data';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TransactionsList({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="font-headline">Transaction history</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
        {transactionData.map((transaction) => (
          <div
            key={transaction.id}
            className="grid grid-cols-3 sm:grid-cols-4 items-center gap-4 text-sm"
          >
            <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
              <div
                className={cn(
                  'flex-center h-8 w-8 rounded-full bg-muted',
                  transaction.direction === 'in'
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {transaction.direction === 'in' ? (
                  <ArrowDownLeft className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </div>
              <div className="grid gap-0.5">
                <p className="font-medium">{transaction.type}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {transaction.address}
                </p>
              </div>
            </div>
            <p className="hidden sm:block text-muted-foreground text-center">
              {transaction.date}
            </p>
            <p
              className={cn(
                'font-medium text-right',
                transaction.direction === 'in'
                  ? 'text-green-500'
                  : 'text-red-500'
              )}
            >
              {transaction.direction === 'in' ? '+' : '-'}
              {transaction.amount.toLocaleString()} {transaction.currency}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}