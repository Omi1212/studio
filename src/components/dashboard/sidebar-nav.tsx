'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Users,
  Settings,
  ShieldCheck,
  LifeBuoy,
  CircleDollarSign,
  Briefcase,
  Building,
  ShoppingBag,
  ClipboardList,
  Rocket,
  ChevronsUpDown,
  Check,
  ChevronDown,
  MoreVertical,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import TokenIcon from '../ui/token-icon';
import { cn } from '@/lib/utils';
import type { TokenDetails, User, Issuer } from '@/lib/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import Image from 'next/image';


const superAdminMenu = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/assets', label: 'Tokens', icon: CircleDollarSign },
  { href: '/issuer-management', label: 'Issuers', icon: Building },
  { href: '/user-management', label: 'Users', icon: Users },
  { href: '/agents', label: 'Agents', icon: ClipboardList },
];

const agentMenu = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
        href: '/workspace', 
        label: 'Workspace', 
        icon: Briefcase,
        subItems: [
            { href: '/orders', label: 'Orders', icon: ShoppingBag },
            { href: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
        ]
    },
    { href: '/requests', label: 'Token Requests', icon: ClipboardList },
    { href: '/issuer-management', label: 'Issuers', icon: Building },
    { href: '/user-management', label: 'Users', icon: Users },
];

const investorMenu = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { href: '/orders', label: 'Orders', icon: ClipboardList },
    { href: '/my-tokens', label: 'Portfolio', icon: Briefcase },
];

const issuerMenu = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/issue-token', label: 'Launchpad', icon: Rocket },
  { 
    href: '/workspace', 
    label: 'Workspace', 
    icon: Briefcase,
    subItems: [
        { href: '/investors', label: 'Investors', icon: Users },
        { href: '/whitelisting-requests', label: 'Whitelisting Requests', icon: ClipboardList },
        { href: '/orders', label: 'Orders', icon: ShoppingBag },
        { href: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
    ]
  },
];

const helpMenuItems = [
  { href: '/security', label: 'Security', icon: ShieldCheck },
  { href: '/help', label: 'Help', icon: LifeBuoy },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [allTokens, setAllTokens] = useState<TokenDetails[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenDetails | null>(null);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string } | null>(null);


  useEffect(() => {
    // This ensures the code runs only on the client, preventing hydration errors.
    setIsClient(true);
    const role = localStorage.getItem('userRole');
    const currentUser: User | null = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setUserRole(role);

    Promise.all([
      fetch('/api/tokens?perPage=999').then(res => res.json()),
      fetch('/api/companies').then(res => res.json()),
      fetch('/api/issuers?perPage=999').then(res => res.json())
    ]).then(([tokensResponse, companiesResponse, issuersResponse]) => {
        const allCompanies = companiesResponse.data || [];
        const issuers: Issuer[] = issuersResponse.data || [];
        
        let userCompanies = allCompanies;
        if (role !== 'investor' && currentUser?.businessName) {
            userCompanies = allCompanies.filter((c: any) => c.name === currentUser.businessName);
        }
        setCompanies(userCompanies);
        
        if (role === 'investor' || role === 'issuer') {
            if (userCompanies.length > 0) {
              const storedCompanyId = localStorage.getItem('selectedCompanyId');
              const foundCompany = storedCompanyId ? userCompanies.find((c: any) => c.id === storedCompanyId) : undefined;
              
              if (foundCompany) {
                setSelectedCompany(foundCompany);
              } else {
                setSelectedCompany(userCompanies[0]);
                localStorage.setItem('selectedCompanyId', userCompanies[0].id);
              }
            }
        }
        
        let combinedTokens: TokenDetails[] = (tokensResponse.data || []).map((t: any) => ({
          ...t,
          decimals: t.decimals ?? 0,
          isFreezable: t.isFreezable ?? false,
          publicKey: t.publicKey ?? `02f...${t.id.slice(-10)}`,
        }));

        if (role === 'agent' && currentUser) {
            // NOTE: assignments are not persisted in this demo
            // For demo, we'll just show all tokens. In a real app, you'd filter by assignment.
        } else if (role === 'issuer' && currentUser) {
            const currentIssuer = issuers.find(i => i.email === currentUser.email);
            if (currentIssuer) {
                combinedTokens = combinedTokens.filter(t => t.issuerId === currentIssuer.id);
            } else {
                // This is a new issuer (or one not in the mock data), they have no tokens yet.
                combinedTokens = [];
            }
        }

        setAllTokens(combinedTokens);

        const storedTokenId = localStorage.getItem('selectedTokenId');
        if (storedTokenId) {
            const foundToken = combinedTokens.find(t => t.id === storedTokenId);
            if (foundToken) {
              setSelectedToken(foundToken);
            } else if (combinedTokens.length > 0) {
              const firstToken = combinedTokens[0];
              setSelectedToken(firstToken);
              localStorage.setItem('selectedTokenId', firstToken.id);
            } else {
              setSelectedToken(null);
              localStorage.removeItem('selectedTokenId');
            }
        } else if (combinedTokens.length > 0) {
          const firstToken = combinedTokens[0];
          setSelectedToken(firstToken);
          localStorage.setItem('selectedTokenId', firstToken.id);
        }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTokenSelect = (token: TokenDetails) => {
    setSelectedToken(token);
    localStorage.setItem('selectedTokenId', token.id);
    window.dispatchEvent(new Event('tokenChanged'));
  }

  const handleCompanySelect = (company: { id: string; name: string }) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompanyId', company.id);
    window.dispatchEvent(new Event('companyChanged'));
  };

  let menuItems: any[] = [];

  if (!isClient) {
    // Render nothing or a skeleton loader on the server/initial client render.
    return null;
  }

  if (userRole === 'superadmin') {
    menuItems = superAdminMenu;
  } else if (userRole === 'investor') {
    menuItems = investorMenu;
  } else if (userRole === 'issuer') {
    menuItems = issuerMenu;
  } else if (userRole === 'agent') {
    menuItems = agentMenu;
  }

  const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
  };


  return (
    <>
      <SidebarHeader className="p-4">
        <div className="w-full h-auto relative" style={{ aspectRatio: '170/41' }}>
          <Image src="https://i.ibb.co/dsx2xgVc/image-69.png" alt="BlockStratus Logo" fill style={{objectFit: 'contain'}} sizes="14rem" className="block dark:hidden" />
          <Image src="https://i.wpfc.ml/35/8gtsxa.png" alt="BlockStratus Logo" fill style={{objectFit: 'contain'}} sizes="14rem" className="hidden dark:block" />
        </div>
      </SidebarHeader>
      
      {isClient && (userRole === 'investor' || userRole === 'issuer') && selectedCompany && (
        <div className="px-3 pb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between items-center p-2 text-left border-sidebar-border bg-sidebar hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-3">
                    <Building className="h-5 w-5" />
                    <span className="font-medium text-sm">{selectedCompany.name}</span>
                </div>
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
              {companies.map((company) => (
                <DropdownMenuItem
                  key={company.id}
                  onSelect={() => handleCompanySelect(company)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{company.name}</span>
                    {selectedCompany.id === company.id && <Check className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {isClient && (userRole === 'issuer' || userRole === 'agent') && (
        <div className="px-3 pb-3">
          {allTokens.length > 0 && selectedToken ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-auto justify-between items-center p-2 text-left bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/80"
                >
                  <div className="flex items-center gap-3">
                    <TokenIcon token={selectedToken} className="h-8 w-8" />
                    <div className="flex-1 flex flex-col gap-0.5 leading-none">
                      <span className="font-medium text-sm">
                        {selectedToken.tokenName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-semibold text-xs">
                          {selectedToken.tokenTicker}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (
                          {networkMap[selectedToken.network as string] ||
                            selectedToken.network}
                          )
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                {allTokens.map((token) => (
                  <DropdownMenuItem
                    key={token.id}
                    onSelect={() => handleTokenSelect(token)}
                    className="p-2"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <TokenIcon token={token} className="h-8 w-8" />
                      <div className="flex-1 flex flex-col gap-0.5 leading-none">
                        <span className="font-medium text-sm">
                          {token.tokenName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-semibold text-xs">
                            {token.tokenTicker}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (
                            {networkMap[token.network as string] ||
                              token.network}
                            )
                          </span>
                        </div>
                      </div>
                      {selectedToken.id === token.id && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="border border-sidebar-border rounded-md p-2 text-center text-sm text-sidebar-foreground/70 bg-sidebar-accent flex items-center justify-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>No Assets</span>
            </div>
          )}
        </div>
      )}

      <SidebarContent className="p-4 pt-0">
        <SidebarMenu>
          {menuItems.map((item) => (
            item.subItems ? (
                 <Collapsible 
                    key={item.href} 
                    asChild 
                    defaultOpen={item.href === '/workspace'}
                >
                    <SidebarMenuItem>
                        <div className="relative">
                            <SidebarMenuButton
                                asChild
                                isActive={pathname.startsWith(item.href) && item.subItems.every((sub:any) => !pathname.startsWith(sub.href))}
                                tooltip={item.label}
                                className="pr-10"
                            >
                                <a href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </a>
                            </SidebarMenuButton>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
                                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="py-2 pl-6">
                            <SidebarMenu>
                                {item.subItems.map((subItem: any) => (
                                    <SidebarMenuItem key={subItem.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname.startsWith(subItem.href)}
                                            tooltip={subItem.label}
                                            className="h-8"
                                        >
                                            <a href={subItem.href}>
                                                <subItem.icon />
                                                <span>{subItem.label}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            ) : (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.href)}
                        tooltip={item.label}
                    >
                        <a href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            )
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 space-y-2">
        <SidebarMenu>
          {isClient && (userRole === 'issuer' || userRole === 'investor') && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/settings')}
                tooltip={'Settings'}
              >
                <a href={'/settings'}>
                  <Settings />
                  <span>{'Settings'}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {helpMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
