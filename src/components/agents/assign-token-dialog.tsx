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
import type { User, AssetDetails } from '@/lib/types';
import { DropdownMenuItem, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';
import AssetIcon from '../ui/asset-icon';
import { MoreVertical, Trash2, Search, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';

interface AssignAssetDialogProps {
    agent: User;
    allAssets: AssetDetails[];
    assignedAssetIds: string[];
    onUpdate: (agentId: string, assetIds: string[]) => void;
}

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    ark: 'Ark',
    taproot: 'Taproot Assets',
};

export function AssignTokenDialog({ agent, allAssets, assignedAssetIds, onUpdate }: AssignAssetDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        if (isOpen) {
            setSelectedAssetIds(assignedAssetIds);
            setSearchQuery('');
        }
    }, [isOpen, assignedAssetIds]);

    const handleAssetAdd = (assetId: string) => {
        if (assetId && !selectedAssetIds.includes(assetId)) {
            setSelectedAssetIds(prev => [...prev, assetId]);
        }
    };

    const handleAssetRemove = (assetId: string) => {
        setSelectedAssetIds(prev => prev.filter(id => id !== assetId));
    };

    const handleSave = () => {
        onUpdate(agent.id, selectedAssetIds);
        setIsOpen(false);
    };
    
    const assigned = useMemo(() => {
        return allAssets.filter(asset => selectedAssetIds.includes(asset.id));
    }, [allAssets, selectedAssetIds]);

    const unassigned = useMemo(() => {
        let filtered = allAssets.filter(asset => !selectedAssetIds.includes(asset.id));
        if (searchQuery) {
            filtered = filtered.filter(asset => 
                asset.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.assetTicker.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    }, [allAssets, selectedAssetIds, searchQuery]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Manage Assets
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Manage Asset Assignments</DialogTitle>
                    <DialogDescription>
                        Select which assets {agent.name} should be able to manage.
                    </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="max-h-72 -mx-6 px-6">
                    <div className="space-y-3 py-2 pr-1">
                        {assigned.map(asset => (
                            <Card key={asset.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <AssetIcon asset={asset} className="h-8 w-8" />
                                    <div>
                                        <p className="font-semibold">{asset.assetName}</p>
                                        <p className="text-sm text-muted-foreground">{asset.assetTicker} on {(Array.isArray(asset.network) ? asset.network : [asset.network]).map(n => networkMap[n] || n).join(', ')}</p>
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
                                                This will unassign the asset "{asset.assetName}" from {agent.name}. They will no longer be able to manage it.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleAssetRemove(asset.id)}>Confirm Remove</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </Card>
                        ))}
                         {assigned.length === 0 && (
                             <div className="text-center text-muted-foreground py-10">
                                <p>No assets assigned yet.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="link" className="p-0 h-auto text-primary">
                            + Add Another Asset
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                        <div className="p-2">
                             <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search assets..." 
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Available Assets</DropdownMenuLabel>
                         <ScrollArea className="max-h-48">
                            {unassigned.length > 0 ? (
                                unassigned.map(asset => (
                                <DropdownMenuItem key={asset.id} onSelect={() => handleAssetAdd(asset.id)}>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <AssetIcon asset={asset} className="h-6 w-6" />
                                            <span>{asset.assetName} ({asset.assetTicker})</span>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                                ))
                            ) : (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                    {searchQuery ? "No assets match your search." : "No other assets to add."}
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
