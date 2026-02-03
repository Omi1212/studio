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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User, TokenDetails } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenuItem, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '../ui/dropdown-menu';
import TokenIcon from '../ui/token-icon';
import { MoreVertical, Plus, Trash2, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Card } from '../ui/card';

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

    const { toast } = useToast();

    const handleTokenAdd = (tokenId: string) => {
        if (!selectedTokenIds.includes(tokenId)) {
            setSelectedTokenIds(prev => [...prev, tokenId]);
        }
    };

    const handleTokenRemove = (tokenId: string) => {
        setSelectedTokenIds(prev => prev.filter(id => id !== tokenId));
    };

    const handleSave = () => {
        onUpdate(agent.id, selectedTokenIds);
        setIsOpen(false);
        toast({
            title: "Assignments Updated",
            description: `Token assignments for ${agent.name} have been saved.`,
        });
    };
    
    const assigned = useMemo(() => {
        return allTokens.filter(token => selectedTokenIds.includes(token.id));
    }, [allTokens, selectedTokenIds]);

    const unassigned = useMemo(() => {
        const filtered = allTokens.filter(token => !selectedTokenIds.includes(token.id));
        if (!searchQuery) {
            return filtered;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return filtered.filter(token =>
            token.tokenName.toLowerCase().includes(lowercasedQuery) ||
            token.tokenTicker.toLowerCase().includes(lowercasedQuery)
        );
    }, [allTokens, selectedTokenIds, searchQuery]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Manage Tokens
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Manage Token Assignments</DialogTitle>
                    <DialogDescription>
                        Select which tokens {agent.name} should be able to manage.
                    </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="max-h-72 -mx-6 px-6">
                    <div className="space-y-3 py-2 pr-1">
                        {assigned.length > 0 ? (
                            assigned.map(token => (
                                <Card key={token.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <TokenIcon token={token} className="h-8 w-8" />
                                        <div>
                                            <p className="font-semibold">{token.tokenName}</p>
                                            <p className="text-sm text-muted-foreground">{token.tokenTicker} on {networkMap[token.network] || token.network}</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => handleTokenRemove(token.id)} className="text-red-500">
                                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </Card>
                            ))
                        ) : (
                             <div className="text-center text-muted-foreground py-10">
                                <p>No tokens assigned yet.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="link"
                            className="p-0 h-auto justify-start text-primary"
                            onClick={() => setSearchQuery('')}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Another Token
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-0 w-96" align="start">
                        <div className="p-2 border-b">
                            <Input
                                autoFocus
                                placeholder="Search tokens..."
                                className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <ScrollArea className="max-h-64">
                            {unassigned.length > 0 ? (
                                unassigned.map(token => (
                                    <DropdownMenuItem key={token.id} onSelect={() => handleTokenAdd(token.id)} className="p-2 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <TokenIcon token={token} className="h-8 w-8" />
                                            <div>
                                                <p className="font-semibold text-sm">{token.tokenName}</p>
                                                <p className="text-xs text-muted-foreground">{token.tokenTicker}</p>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center p-4">No other tokens to add.</p>
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
