'use client';

import { useState, useEffect, useMemo } from 'react';
import type { User, TokenDetails } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import TokenIcon from '../ui/token-icon';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardList, MoreVertical, Trash2, Search, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AgentTokensProps {
    agent: User;
}

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
};

export default function AgentTokens({ agent }: AgentTokensProps) {
    const { toast } = useToast();
    const [allTokens, setAllTokens] = useState<TokenDetails[]>([]);
    const [assignedTokens, setAssignedTokens] = useState<TokenDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
    const [isAddingToken, setIsAddingToken] = useState(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch('/api/tokens?perPage=999').then(res => res.json()),
            fetch(`/api/agents/${agent.id}/assignments`).then(res => res.json())
        ]).then(([tokensResponse, agentTokenIds]) => {
            const activeTokens = (tokensResponse.tokens || []).filter((token: TokenDetails) => token.status === 'active');
            setAllTokens(activeTokens);
            
            const agentTokens = activeTokens.filter((token: TokenDetails) => agentTokenIds.includes(token.id));
            setAssignedTokens(agentTokens);
        }).catch(console.error)
        .finally(() => setLoading(false));
    }, [agent.id]);
    
    useEffect(() => {
        if (isDialogOpen) {
            setSelectedTokenIds(assignedTokens.map(t => t.id));
        } else {
            setIsAddingToken(false);
        }
    }, [isDialogOpen, assignedTokens]);

    const handleUpdateAssignments = async () => {
        try {
            const response = await fetch(`/api/agents/${agent.id}/assignments`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenIds: selectedTokenIds }),
            });
            if (!response.ok) throw new Error('Failed to update assignments');

            const updatedTokenIds = await response.json();
            const updatedAssignedTokens = allTokens.filter(token => updatedTokenIds.includes(token.id));
            setAssignedTokens(updatedAssignedTokens);
            
            toast({
                title: "Assignments Updated",
                description: `Token assignments for ${agent.name} have been updated.`,
            });
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not update assignments.'
            });
        }
    };

    const handleTokenAdd = (tokenId: string) => {
        if (tokenId && !selectedTokenIds.includes(tokenId)) {
            setSelectedTokenIds(prev => [...prev, tokenId]);
        }
        setIsAddingToken(false);
    };

    const handleTokenRemove = (tokenId: string) => {
        setSelectedTokenIds(prev => prev.filter(id => id !== tokenId));
    };

    const assignedInDialog = useMemo(() => {
        return allTokens.filter(token => selectedTokenIds.includes(token.id));
    }, [allTokens, selectedTokenIds]);
    
    const unassignedInDialog = useMemo(() => {
        return allTokens.filter(token => !selectedTokenIds.includes(token.id));
    }, [allTokens, selectedTokenIds]);


    if (loading) {
        return <Card className="h-64 animate-pulse bg-muted/50"></Card>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Assigned Tokens</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Manage Tokens</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Manage Token Assignments</DialogTitle>
                            <DialogDescription>
                                Select which tokens {agent.name} should be able to manage.
                            </DialogDescription>
                        </DialogHeader>

                        <ScrollArea className="max-h-72 -mx-6 px-6">
                            <div className="space-y-3 py-2 pr-1">
                                {assignedInDialog.map(token => (
                                    <Card key={token.id} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <TokenIcon token={token} className="h-8 w-8" />
                                            <div>
                                                <p className="font-semibold">{token.tokenName}</p>
                                                <p className="text-sm text-muted-foreground">{token.tokenTicker} on {networkMap[token.network] || token.network}</p>
                                            </div>
                                        </div>
                                        <AlertDialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                     <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will unassign the token &quot;{token.tokenName}&quot; from {agent.name}. They will no longer be able to manage it.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleTokenRemove(token.id)}>Confirm Remove</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </Card>
                                ))}
                                {assignedInDialog.length === 0 && (
                                    <div className="text-center text-muted-foreground py-10">
                                        <p>No tokens assigned yet.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        
                        {!isAddingToken && (
                             <Button variant="link" className="p-0 h-auto text-primary" onClick={() => setIsAddingToken(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Another Token
                            </Button>
                        )}
                        {isAddingToken && (
                             <div className="space-y-2 pt-2">
                                <Label>Add a token</Label>
                                <Select onValueChange={handleTokenAdd}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a token to add..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unassignedInDialog.length > 0 ? (
                                            unassignedInDialog.map(token => (
                                                <SelectItem key={token.id} value={token.id}>
                                                     <div className="flex items-center gap-2">
                                                        <TokenIcon token={token} className="h-6 w-6" />
                                                        <span>{token.tokenName} ({token.tokenTicker})</span>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                No other tokens to add.
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        
                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleUpdateAssignments}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {assignedTokens.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Token</TableHead>
                                <TableHead>Network</TableHead>
                                <TableHead className="text-right">Max Supply</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignedTokens.map(token => (
                                <TableRow key={token.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <TokenIcon token={token} className="h-8 w-8" />
                                            <div>
                                                <p className="font-medium">{token.tokenName}</p>
                                                <p className="text-sm text-primary">{token.tokenTicker}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{networkMap[token.network] || token.network}</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {token.maxSupply ? token.maxSupply.toLocaleString() : '--'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center">
                         <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-medium">No Tokens Assigned</p>
                        <p className="text-sm">This agent has no tokens assigned to them.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
