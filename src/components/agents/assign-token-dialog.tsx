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
import { MoreVertical, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
    
    useEffect(() => {
        if (isOpen) {
            setSelectedTokenIds(assignedTokenIds);
        }
    }, [isOpen, assignedTokenIds]);

    const { toast } = useToast();

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
        toast({
            title: "Assignments Updated",
            description: `Token assignments for ${agent.name} have been saved.`,
        });
    };
    
    const assigned = useMemo(() => {
        return allTokens.filter(token => selectedTokenIds.includes(token.id));
    }, [allTokens, selectedTokenIds]);

    const unassigned = useMemo(() => {
        return allTokens.filter(token => !selectedTokenIds.includes(token.id));
    }, [allTokens, selectedTokenIds]);


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
                
                <div className="space-y-2 pt-2">
                    <Label htmlFor="add-token-select">Add a token</Label>
                    <Select onValueChange={handleTokenAdd} value="">
                        <SelectTrigger id="add-token-select" className="w-full">
                            <SelectValue placeholder="Select a token to add..." />
                        </SelectTrigger>
                        <SelectContent>
                            {unassigned.length > 0 ? (
                                unassigned.map(token => (
                                    <SelectItem key={token.id} value={token.id}>
                                        <div className="flex items-center gap-2">
                                            <TokenIcon token={token} className="h-6 w-6" />
                                            <span>{token.tokenName} ({token.tokenTicker})</span>
                                        </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="p-2 text-center text-sm text-muted-foreground">No other tokens to add.</div>
                            )}
                        </SelectContent>
                    </Select>
                </div>
                
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
