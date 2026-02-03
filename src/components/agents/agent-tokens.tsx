'use client';

import { useState, useEffect, useMemo } from 'react';
import type { User, TokenDetails } from '@/lib/types';
import { exampleTokens } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import TokenIcon from '../ui/token-icon';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardList, Check, Search } from 'lucide-react';
import { Input } from '../ui/input';

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
    const [assignments, setAssignments] = useState<Record<string, string[]>>({});
    const [allTokens, setAllTokens] = useState<TokenDetails[]>([]);
    const [assignedTokens, setAssignedTokens] = useState<TokenDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Fetch tokens and assignments
        const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
        const activeTokens = [...exampleTokens, ...storedTokens].filter(token => token.status === 'active');
        setAllTokens(activeTokens);

        const storedAssignments: Record<string, string[]> = JSON.parse(localStorage.getItem('agentTokenAssignments') || '{}');
        setAssignments(storedAssignments);
        
        const agentTokenIds = storedAssignments[agent.id] || [];
        const agentTokens = activeTokens.filter(token => agentTokenIds.includes(token.id));
        setAssignedTokens(agentTokens);
        setSelectedTokenIds(agentTokenIds);

        setLoading(false);
    }, [agent.id]);
    
    useEffect(() => {
        if (isDialogOpen) {
            setSelectedTokenIds(assignments[agent.id] || []);
            setSearchQuery('');
        }
    }, [isDialogOpen, assignments, agent.id]);

    const handleUpdateAssignments = () => {
        const newAssignments = { ...assignments, [agent.id]: selectedTokenIds };
        setAssignments(newAssignments);
        localStorage.setItem('agentTokenAssignments', JSON.stringify(newAssignments));

        const agentTokens = allTokens.filter(token => selectedTokenIds.includes(token.id));
        setAssignedTokens(agentTokens);

        toast({
            title: "Assignments Updated",
            description: `Token assignments for ${agent.name} have been saved.`,
        });
        setIsDialogOpen(false);
    };

    const handleCheckboxChange = (tokenId: string, checked: boolean) => {
        setSelectedTokenIds(prev => 
            checked ? [...prev, tokenId] : prev.filter(id => id !== tokenId)
        );
    };

    const filteredTokens = useMemo(() => {
        const sortedTokens = [...allTokens].sort((a, b) => {
            const aIsAssigned = (assignments[agent.id] || []).includes(a.id);
            const bIsAssigned = (assignments[agent.id] || []).includes(b.id);
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
    }, [allTokens, assignments, agent.id, searchQuery]);


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
                                    filteredTokens.map(token => (
                                        <div key={token.id}>
                                            <Checkbox
                                                id={`token-${agent.id}-${token.id}`}
                                                checked={selectedTokenIds.includes(token.id)}
                                                onCheckedChange={(checked) => handleCheckboxChange(token.id, !!checked)}
                                                className="sr-only peer"
                                            />
                                            <Label
                                                htmlFor={`token-${agent.id}-${token.id}`}
                                                className="flex items-center gap-4 rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                                            >
                                                <TokenIcon token={token} className="h-8 w-8" />
                                                <div className="flex-1">
                                                    <p className="font-semibold">{token.tokenName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {token.tokenTicker} on {networkMap[token.network] || token.network}
                                                    </p>
                                                </div>
                                                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground peer-data-[state=checked]:border-primary flex-shrink-0 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-primary opacity-0 transition-opacity peer-data-[state=checked]:opacity-100" />
                                                </div>
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">No tokens found.</p>
                                )}
                            </div>
                        </ScrollArea>
                        <DialogFooter>
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
