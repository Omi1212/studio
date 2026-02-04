'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { usersData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AssignedAgentsProps {
    tokenId: string;
}

export default function AssignedAgents({ tokenId }: AssignedAgentsProps) {
    const [assignedAgents, setAssignedAgents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Fetch all users and filter for agents
        const allUsers: User[] = JSON.parse(localStorage.getItem('users') || JSON.stringify(usersData));
        const allAgents = allUsers.filter(user => user.role === 'agent');

        // Fetch agent-token assignments
        const storedAssignments: Record<string, string[]> = JSON.parse(localStorage.getItem('agentTokenAssignments') || '{}');

        // Find agents assigned to the current token
        const agentIdsForToken: string[] = [];
        for (const agentId in storedAssignments) {
            if (storedAssignments[agentId].includes(tokenId)) {
                agentIdsForToken.push(agentId);
            }
        }
        
        const agents = allAgents.filter(agent => agentIdsForToken.includes(agent.id));
        setAssignedAgents(agents);
        setLoading(false);

    }, [tokenId]);

    if (loading) {
        return <Card className="h-48 animate-pulse bg-muted/50"></Card>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Assigned Agents</CardTitle>
            </CardHeader>
            <CardContent>
                {assignedAgents.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agent</TableHead>
                                <TableHead className="hidden sm:table-cell">Wallet Address</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignedAgents.map(agent => (
                                <TableRow key={agent.id} onClick={() => router.push(`/agents/${agent.id}`)} className="cursor-pointer">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{agent.name}</p>
                                                <p className="text-sm text-muted-foreground">{agent.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell font-mono">
                                        {agent.walletAddress.slice(0,12)}...{agent.walletAddress.slice(-8)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center">
                         <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-medium">No Agents Assigned</p>
                        <p className="text-sm">This token has not been assigned to any agent.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
