'use client';

import { useState, useEffect } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User, TokenDetails } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenuItem } from '../ui/dropdown-menu';

interface AssignTokenDialogProps {
    agent: User;
    allTokens: TokenDetails[];
    assignedTokenIds: string[];
    onUpdate: (agentId: string, tokenIds: string[]) => void;
}

export function AssignTokenDialog({ agent, allTokens, assignedTokenIds, onUpdate }: AssignTokenDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    // Initialize local state when dialog opens
    const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setSelectedTokenIds(assignedTokenIds);
        }
    }, [isOpen, assignedTokenIds]);

    const { toast } = useToast();

    const handleCheckboxChange = (tokenId: string, checked: boolean) => {
        setSelectedTokenIds(prev => 
            checked ? [...prev, tokenId] : prev.filter(id => id !== tokenId)
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
    
    // Sort tokens to show assigned ones first
    const sortedTokens = [...allTokens].sort((a, b) => {
        const aIsAssigned = assignedTokenIds.includes(a.id);
        const bIsAssigned = assignedTokenIds.includes(b.id);
        if (aIsAssigned === bIsAssigned) return a.tokenName.localeCompare(b.tokenName);
        return aIsAssigned ? -1 : 1;
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Manage Tokens
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Tokens to {agent.name}</DialogTitle>
                    <DialogDescription>
                        Select the tokens this agent can manage.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-72">
                    <div className="grid gap-4 py-4 pr-4">
                        {sortedTokens.length > 0 ? (
                             sortedTokens.map(token => (
                                <div key={token.id} className="flex items-center space-x-3">
                                    <Checkbox
                                        id={`token-${agent.id}-${token.id}`}
                                        checked={selectedTokenIds.includes(token.id)}
                                        onCheckedChange={(checked) => handleCheckboxChange(token.id, !!checked)}
                                    />
                                    <Label
                                        htmlFor={`token-${agent.id}-${token.id}`}
                                        className="font-medium"
                                    >
                                        {token.tokenName} ({token.tokenTicker})
                                    </Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center">No active tokens available to assign.</p>
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
