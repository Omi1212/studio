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
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User, TokenDetails } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenuItem, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '../ui/dropdown-menu';
import TokenIcon from '../ui/token-icon';
import { Check, Search, MoreVertical, Plus, Trash2 } from 'lucide-react';
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

    const { toast } = useToast();

    const handleAssignmentChange = (tokenId: string, shouldAssign: boolean) => {
        setSelectedTokenIds(prev => 
            shouldAssign ? [...prev, tokenId] : prev.filter(id => id !== tokenId)
        );
    };

    const handleSave = () => {
        onUpdate(agent.id, selectedTokenIds);
        setIsOpen(false);
        toast({
            title: "Assignments Updated",
            description: `Token assignments for ${agent.name} have been saved.`,
        });
    };
    
    const filteredTokens = useMemo(() => {
        let sortedTokens = [...allTokens].sort((a, b) => {
            const aIsAssigned = assignedTokenIds.includes(a.id);
            const bIsAssigned = assignedTokenIds.includes(b.id);
            if (aIsAssigned === bIsAssigned) return a.tokenName.localeCompare(b.tokenName);
            return aIsAssigned ? -1 : 1;
        });

        if (!searchQuery) {
            return sortedTokens;
        }

        const lowercasedQuery = searchQuery.toLowerCase();
        return sortedTokens.filter(token => 
            token.tokenName.toLowerCase().includes(lowercasedQuery) ||
            token.tokenTicker.toLowerCase().includes(lowercasedQuery)
        );
    }, [allTokens, assignedTokenIds, searchQuery]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Manage Tokens
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Assign Tokens to {agent.name}</DialogTitle>
                    <DialogDescription>
                        Select the tokens this agent can manage.
                    </DialogDescription>
                </DialogHeader>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tokens..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <ScrollArea className="max-h-96 -mr-4">
                    <div className="grid gap-3 py-4 pr-4">
                        {filteredTokens.length > 0 ? (
                             filteredTokens.map(token => {
                                const isAssigned = selectedTokenIds.includes(token.id);
                                return (
                                <div key={token.id} className="flex items-center gap-4 rounded-md border-2 border-muted bg-popover p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                                    <TokenIcon token={token} className="h-8 w-8" />
                                    <div className="flex-1">
                                        <p className="font-semibold">{token.tokenName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {token.tokenTicker} on {networkMap[token.network] || token.network}
                                        </p>
                                    </div>
                                    {isAssigned && <Check className="h-5 w-5 text-green-500" />}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => handleAssignmentChange(token.id, !isAssigned)}>
                                                {isAssigned ? (
                                                    <><Trash2 className="mr-2 h-4 w-4" /> Remove</>
                                                ) : (
                                                    <><Plus className="mr-2 h-4 w-4" /> Add</>
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                             )})
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">No tokens found.</p>
                        )}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
