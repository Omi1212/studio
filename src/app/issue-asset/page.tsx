'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import ExistingAssets from '@/components/issue-asset/existing-assets';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { User, Company } from '@/lib/types';

export type ViewMode = 'card' | 'table';

export default function IssueAssetPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [complianceProvidersCount, setComplianceProvidersCount] = useState(0);

  const loadComplianceStatus = () => {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('compliance-provider-')) {
            count++;
        }
    }
    setComplianceProvidersCount(count);
  };

  useEffect(() => {
    const loadData = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser:User = JSON.parse(storedUser);
        setLoading(true);
        fetch(`/api/users/${parsedUser.id}`)
          .then(res => res.ok ? res.json() : parsedUser)
          .then(dbUser => {
            setUser(dbUser);
            if (dbUser.companyId) {
              fetch(`/api/companies/${dbUser.companyId}`)
                .then(res => res.ok ? res.json() : null)
                .then(companyData => setCompany(companyData))
                .finally(() => setLoading(false));
            } else {
              setLoading(false);
            }
          })
          .catch(() => {
            setUser(parsedUser);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    };
    
    loadData();
    loadComplianceStatus();
    window.addEventListener('companyChanged', loadData);
    window.addEventListener('complianceProvidersChanged', loadComplianceStatus);

    return () => {
      window.removeEventListener('companyChanged', loadData);
      window.removeEventListener('complianceProvidersChanged', loadComplianceStatus);
    };
  }, []);

  const isKybVerified = company?.kybStatus === 'verified';
  const canCreateAssets = !loading && user && user.role === 'issuer' && isKybVerified && complianceProvidersCount >= 3;


  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex justify-center">
              <div className="w-full max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-headline font-semibold">
                    Launchpad
                    </h1>
                    {canCreateAssets && (
                      <Button asChild>
                          <Link href="/issue-asset/new">
                              <Plus className="mr-2 h-4 w-4" />
                              Create New Asset
                          </Link>
                      </Button>
                    )}
                </div>
                <ExistingAssets view={viewMode} setView={setViewMode} canCreate={canCreateAssets} company={company} complianceProvidersCount={complianceProvidersCount} />
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
