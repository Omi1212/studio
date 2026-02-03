'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usersData, exampleTokens } from '@/lib/data';
import type { User, TokenDetails } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AssignTokenDialog } from './assign-token-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, ClipboardList, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Link from 'next/link';

type Agent = User;
type Assignments = Record<string, string[]>; // agentId: tokenId[]

const ITEMS_PER_PAGE = 10;

function getStatusBadge(status: User['status']) {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>;
    case 'inactive':
      return <Badge variant="destructive">Inactive</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

export default function AgentList() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [activeTokens, setActiveTokens] = useState<TokenDetails[]>([]);
    const [assignments, setAssignments] = useState<Assignments>({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
    const paginatedAgents = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAgents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAgents, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
        }
    };

    if (loading) {
        return (
          <div className="space-y-4">
            <h1 className="text-3xl font-headline font-semibold">Agents</h1>
            <Card className="h-64 animate-pulse bg-muted/50"></Card>
          </div>
        );
    }
    
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        return (
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-headline font-semibold">Agents</h1>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
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
            </div>
        
            {paginatedAgents.length === 0 ? (
                <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
                    <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No agents found</h2>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery ? "Try adjusting your search." : "There are no agents to display."}
                    </p>
                </div>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agent</TableHead>
                                <TableHead className="text-center">Assigned Tokens</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedAgents.map(agent => {
                                const assignedTokenIds = assignments[agent.id] || [];
                                return (
                                    <TableRow key={agent.id} onClick={() => router.push(`/agents/${agent.id}`)} className="cursor-pointer">
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
                                        <TableCell className="hidden sm:table-cell">{getStatusBadge(agent.status)}</TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/agents/${agent.id}`}>View Details</Link>
                                                        </DropdownMenuItem>
                                                         <AssignTokenDialog 
                                                            agent={agent}
                                                            allTokens={activeTokens}
                                                            assignedTokenIds={assignedTokenIds}
                                                            onUpdate={handleUpdateAssignments}
                                                        />
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    {renderPagination()}
                </Card>
            )}
        </div>
    );
}
