
'use client';

import { useState, useEffect, useMemo } from 'react';
import { usersData, exampleTokens } from '@/lib/data';
import type { User, TokenDetails } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import TokenIcon from '@/components/ui/token-icon';
import { AssignTokenDialog } from './assign-token-dialog';
import { Badge } from '../ui/badge';

type Agent = User;
type Assignments = Record<string, string[]>; // agentId: tokenId[]

export default function AssignmentView() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [activeTokens, setActiveTokens] = useState<TokenDetails[]>([]);
    const [assignments, setAssignments] = useState<Assignments>({});
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch agents
        const allUsers: User[] = JSON.parse(localStorage.getItem('users') || JSON.stringify(usersData));
        setAgents(allUsers.filter(user => user.role === 'agent'));

        // Fetch active tokens
        const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
        const allTokens: TokenDetails[] = [...exampleTokens, ...storedTokens];
        setActiveTokens(allTokens.filter(token => token.status === 'active'));

        // Fetch assignments
        const storedAssignments = JSON.parse(localStorage.getItem('agentTokenAssignments') || '{}');
        setAssignments(storedAssignments);

        setLoading(false);
    }, []);
    
    const handleUpdateAssignments = (agentId: string, tokenIds: string[]) => {
        const newAssignments = { ...assignments, [agentId]: tokenIds };
        setAssignments(newAssignments);
        localStorage.setItem('agentTokenAssignments', JSON.stringify(newAssignments));
    };
    
    const assignedTokensForSelectedAgent = useMemo(() => {
        if (!selectedAgent) return [];
        const tokenIds = assignments[selectedAgent.id] || [];
        return activeTokens.filter(token => tokenIds.includes(token.id));
    }, [selectedAgent, assignments, activeTokens]);

    if (loading) {
        return <Card className="h-64 animate-pulse bg-muted/50"></Card>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Agents</CardTitle>
                    <CardDescription>Select an agent to manage their token assignments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {agents.map(agent => (
                            <li key={agent.id}>
                                <Button
                                    variant={selectedAgent?.id === agent.id ? 'secondary' : 'ghost'}
                                    className="w-full justify-start h-auto py-2"
                                    onClick={() => setSelectedAgent(agent)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{agent.name}</p>
                                            <p className="text-xs text-muted-foreground">{agent.email}</p>
                                        </div>
                                    </div>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <div className="md:col-span-2">
                {selectedAgent ? (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Assigned Tokens for {selectedAgent.name}</CardTitle>
                                <CardDescription>This agent can manage workspace for these tokens.</CardDescription>
                            </div>
                            <AssignTokenDialog 
                                agent={selectedAgent}
                                allTokens={activeTokens}
                                assignedTokenIds={assignments[selectedAgent.id] || []}
                                onUpdate={handleUpdateAssignments}
                            />
                        </CardHeader>
                        <CardContent>
                            {assignedTokensForSelectedAgent.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {assignedTokensForSelectedAgent.map(token => (
                                        <div key={token.id} className="border rounded-lg p-3 flex items-center gap-3">
                                             <TokenIcon token={token} className="h-8 w-8" />
                                            <div>
                                                <p className="font-medium text-sm">{token.tokenName}</p>
                                                <p className="text-primary text-xs font-semibold">{token.tokenTicker}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-12">
                                    <p>No tokens assigned to this agent.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Select an agent to see their assignments.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
