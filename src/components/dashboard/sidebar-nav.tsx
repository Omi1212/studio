
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
import { exampleTokens } from '@/lib/data';
import TokenIcon from '../ui/token-icon';
import { cn } from '@/lib/utils';
import type { TokenDetails } from '@/lib/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

const allMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/issue-token', label: 'Issue Token', icon: CircleDollarSign },
  { href: '/my-tokens', label: 'My Tokens', icon: Briefcase },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/issuer-management', label: 'Issuer Management', icon: Building, roles: ['superadmin'] },
  { href: '/user-management', label: 'User Management', icon: Users, roles: ['superadmin'] },
  { href: '/users', label: 'Users', icon: Users, roles: ['agent', 'investor', 'issuer'] },
];

const helpMenuItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/security', label: 'Security', icon: ShieldCheck },
  { href: '/help', label: 'Help', icon: LifeBuoy },
];

const superAdminMenu = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/issuer-management', label: 'Issuer Management', icon: Building },
  { href: '/user-management', label: 'User Management', icon: Users },
];

const agentMenu = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
        href: '/workspace', 
        label: 'Workspace', 
        icon: Briefcase,
        subItems: [
            { href: '/requests', label: 'Token Requests', icon: ClipboardList },
            { href: '/orders', label: 'Orders', icon: ShoppingBag },
            { href: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
        ]
    },
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

export default function SidebarNav() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [allTokens, setAllTokens] = useState<TokenDetails[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenDetails | null>(null);


  useEffect(() => {
    // This ensures the code runs only on the client, preventing hydration errors.
    setIsClient(true);
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    const storedTokens = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    const combinedTokens: TokenDetails[] = [...exampleTokens, ...storedTokens].map(t => ({
      ...t,
      // Ensure all tokens have the necessary fields for TokenDetails type
      decimals: t.decimals ?? 0,
      isFreezable: t.isFreezable ?? false,
      publicKey: t.publicKey ?? `02f...${t.id.slice(-10)}`,
    }));
    setAllTokens(combinedTokens);

    const storedTokenId = localStorage.getItem('selectedTokenId');
    if (storedTokenId) {
        const foundToken = combinedTokens.find(t => t.id === storedTokenId);
        setSelectedToken(foundToken || (combinedTokens.length > 0 ? combinedTokens[0] : null));
    } else if (combinedTokens.length > 0) {
      setSelectedToken(combinedTokens[0]);
      localStorage.setItem('selectedTokenId', combinedTokens[0].id);
    }


  }, []);

  const handleTokenSelect = (token: TokenDetails) => {
    setSelectedToken(token);
    localStorage.setItem('selectedTokenId', token.id);
    window.dispatchEvent(new Event('tokenChanged'));
  }

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
  } else {
    menuItems = allMenuItems.filter(
      item => !item.roles || item.roles.includes(userRole || '')
    );
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
        <h2 className="text-2xl font-bold text-primary font-headline">BlockStratus</h2>
      </SidebarHeader>

      {isClient && userRole !== 'superadmin' && userRole !== 'investor' && selectedToken && (
        <div className="px-3 pb-3">
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-auto justify-between items-center p-2 text-left bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/80">
                      <div className="flex items-center gap-3">
                          <TokenIcon token={selectedToken} className="h-8 w-8" />
                          <div className="flex-1 flex flex-col gap-0.5 leading-none">
                            <span className="font-medium text-sm">{selectedToken.tokenName}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-primary font-semibold text-xs">{selectedToken.tokenTicker}</span>
                               <span className="text-xs text-muted-foreground">({networkMap[selectedToken.network as string] || selectedToken.network})</span>
                            </div>
                          </div>
                      </div>
                      <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                  {allTokens.map((token) => (
                      <DropdownMenuItem key={token.id} onSelect={() => handleTokenSelect(token)} className="p-2">
                        <div className="flex items-center gap-3 w-full">
                          <TokenIcon token={token} className="h-8 w-8" />
                          <div className="flex-1 flex flex-col gap-0.5 leading-none">
                            <span className="font-medium text-sm">{token.tokenName}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-primary font-semibold text-xs">{token.tokenTicker}</span>
                               <span className="text-xs text-muted-foreground">({networkMap[token.network as string] || token.network})</span>
                            </div>
                          </div>
                          {selectedToken.id === token.id && <Check className="h-4 w-4" />}
                        </div>
                      </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <SidebarContent className="p-4 pt-0">
        <SidebarMenu>
          {menuItems.map((item) => (
            item.subItems ? (
                 <Collapsible key={item.href} asChild>
                    <SidebarMenuItem>
                        <div className="relative">
                            <SidebarMenuButton
                                asChild
                                isActive={pathname.startsWith(item.href)}
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
                                            isActive={pathname === subItem.href}
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
                        isActive={pathname === item.href}
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
          {helpMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
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
