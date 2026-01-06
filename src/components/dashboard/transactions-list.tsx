import {
  Card,
  CardContent,
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
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase">
              <tr className="border-b">
                <th className="px-4 sm:px-6 py-3 font-medium text-left">Transaction</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-left hidden sm:table-cell">Date</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
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
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {transaction.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-muted-foreground hidden sm:table-cell">{transaction.date}</td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                     <p
                      className={cn(
                        'font-medium',
                        transaction.direction === 'in'
                          ? 'text-green-500'
                          : 'text-red-500'
                      )}
                    >
                      {transaction.direction === 'in' ? '+' : '-'}
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
