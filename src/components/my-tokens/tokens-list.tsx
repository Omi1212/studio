'use client';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { tokenData } from '@/lib/data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronDown, Send } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TokensList() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%] px-6">Asset</TableHead>
              <TableHead className="w-[20%] text-right">Price</TableHead>
              <TableHead className="w-[25%] text-right">Balance</TableHead>
              <TableHead className="w-[20%] text-center px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokenData.map((token) => (
              <TableRow key={token.id}>
                <TableCell className="px-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{token.ticker.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{token.ticker}</p>
                      <p className="text-sm text-muted-foreground">{token.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${token.price.toFixed(4)}
                </TableCell>
                <TableCell className="text-right">
                  <p className="font-medium font-mono">{token.balance}</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    ${(token.balance * token.price).toFixed(2)}
                  </p>
                </TableCell>
                <TableCell className="px-6">
                  <div className="flex items-center justify-center gap-2">
                    <Button size="sm" variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Receive</DropdownMenuItem>
                        <DropdownMenuItem>Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
