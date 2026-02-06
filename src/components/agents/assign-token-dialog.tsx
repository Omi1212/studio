'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
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
import type { User, TokenDetails } from '@/lib/types';
import { DropdownMenuItem, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';
import TokenIcon from '../ui/token-icon';
import { MoreVertical, Trash2, Search, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';

interface AssignTokenDialogProps {
    agent: User;
    allTokens: TokenDetails[];
    assignedTokenIds: string[];
    onUpdate: (agentId: string, tokenIds: string[]) => void;
}

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
};

export function AssignTokenDialog({ agent, allTokens, assignedTokenIds, onUpdate }: AssignTokenDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        if (isOpen) {
            setSelectedTokenIds(assignedTokenIds);
            setSearchQuery('');
        }
    }, [isOpen, assignedTokenIds]);

    const handleTokenAdd = (tokenId: string) => {
        if (tokenId && !selectedTokenIds.includes(tokenId)) {
            setSelectedTokenIds(prev => [...prev, tokenId]);
        }
    };

    const handleTokenRemove = (tokenId: string) => {
        setSelectedTokenIds(prev => prev.filter(id => id !== tokenId));
    };

    const handleSave = () => {
        onUpdate(agent.id, selectedTokenIds);
        setIsOpen(false);
    };
    
    const assigned = useMemo(() => {
        return allTokens.filter(token => selectedTokenIds.includes(token.id));
    }, [allTokens, selectedTokenIds]);

    const unassigned = useMemo(() => {
        let filtered = allTokens.filter(token => !selectedTokenIds.includes(token.id));
        if (searchQuery) {
            filtered = filtered.filter(token => 
                token.tokenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.tokenTicker.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    }, [allTokens, selectedTokenIds, searchQuery]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Manage Tokens
                </DropdownMenuItem>
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
                        {assigned.map(token => (
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
                                                This will unassign the token "{token.tokenName}" from {agent.name}. They will no longer be able to manage it.
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
                         {assigned.length === 0 && (
                             <div className="text-center text-muted-foreground py-10">
                                <p>No tokens assigned yet.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="link" className="p-0 h-auto text-primary">
                            + Add Another Token
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                        <div className="p-2">
                             <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search tokens..." 
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Available Tokens</DropdownMenuLabel>
                         <ScrollArea className="max-h-48">
                            {unassigned.length > 0 ? (
                                unassigned.map(token => (
                                <DropdownMenuItem key={token.id} onSelect={() => handleTokenAdd(token.id)}>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <TokenIcon token={token} className="h-6 w-6" />
                                            <span>{token.tokenName} ({token.tokenTicker})</span>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                                ))
                            ) : (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                    {searchQuery ? "No tokens match your search." : "No other tokens to add."}
                                </div>
                            )}
                        </ScrollArea>
                    </DropdownMenuContent>
                </DropdownMenu>
                
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
