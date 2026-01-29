
'use client';

import { useState, useEffect, useMemo } from 'react';
import { usersData, exampleTokens } from '@/lib/data';
import type { User, TokenDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AssignTokenDialog } from './assign-token-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Agent = User;
type Assignments = Record<string, string[]>; // agentId: tokenId[]

export default function AssignmentView() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [activeTokens, setActiveTokens] = useState<TokenDetails[]>([]);
    const [assignments, setAssignments] = useState<Assignments>({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredAgents = useMemo(() => {
        if (!searchQuery) return agents;
        const lowercasedQuery = searchQuery.toLowerCase();
        return agents.filter(agent => 
            agent.name.toLowerCase().includes(lowercasedQuery) ||
            agent.email.toLowerCase().includes(lowercasedQuery)
        );
    }, [agents, searchQuery]);

    if (loading) {
        return <Card className="h-96 animate-pulse bg-muted/50"></Card>;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Manage Agent Permissions</CardTitle>
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search agents..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Agent</TableHead>
                            <TableHead className="text-center">Assigned Tokens</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAgents.length > 0 ? filteredAgents.map(agent => {
                            const assignedTokenIds = assignments[agent.id] || [];
                            return (
                                <TableRow key={agent.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{agent.name}</p>
                                                <p className="text-sm text-muted-foreground">{agent.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">{assignedTokenIds.length}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <AssignTokenDialog 
                                            agent={agent}
                                            allTokens={activeTokens}
                                            assignedTokenIds={assignedTokenIds}
                                            onUpdate={handleUpdateAssignments}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No agents found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
