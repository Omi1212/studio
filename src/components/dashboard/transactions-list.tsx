import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { transactionData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export default function TransactionsList({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Recent Transactions</CardTitle>
          <CardDescription>
            You have {transactionData.length} recent transactions.
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm">
          View all
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionData.slice(0, 5).map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://picsum.photos/seed/${transaction.id}/40/40`}
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {transaction.user.split(' ')[0][0]}
                        {transaction.user.split(' ')[1][0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                      <p className="font-medium">{transaction.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                    <Badge
                      variant={
                        transaction.status === 'Completed'
                          ? 'default'
                          : 'secondary'
                      }
                      className={
                        transaction.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : ''
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
