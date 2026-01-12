
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
import { tokenData, exampleTokens } from '@/lib/data';
import TokenIcon from '../ui/token-icon';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const allMenuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/issue-token', label: 'Issue Token', icon: CircleDollarSign },
  { href: '/my-tokens', label: 'My Tokens', icon: Briefcase },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/issuer-management', label: 'Issuer Management', icon: Building, roles: ['superadmin'] },
  { href: '/user-management', label: 'User Management', icon: Users, roles: ['superadmin'] },
  { href: '/users', label: 'Users', icon: Users, roles: ['admin', 'investor', 'issuer'] },
];

const helpMenuItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/security', label: 'Security', icon: ShieldCheck },
  { href: '/help', label: 'Help', icon: LifeBuoy },
];

const superAdminMenu = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/issuer-management', label: 'Issuer Management', icon: Building },
  { href: '/user-management', label: 'User Management', icon: Users },
];

const adminMenu = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/requests', label: 'Token Requests', icon: ClipboardList },
    { href: '/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
];

const investorMenu = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { href: '/orders', label: 'Orders', icon: ClipboardList },
    { href: '/my-tokens', label: 'Portfolio', icon: Briefcase },
];

const issuerMenu = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/issue-token', label: 'Launchpad', icon: Rocket },
  { href: '/workspace', label: 'Workspace', icon: Briefcase },
  { href: '/investors', label: 'Investors', icon: Users },
  { href: '/whitelisting-requests', label: 'Whitelisting Requests', icon: ClipboardList },
  { href: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
];

const allTokens = [...tokenData, ...exampleTokens.map(t => ({...t, name: t.tokenName, ticker: t.tokenTicker}))];

export default function SidebarNav() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedToken, setSelectedToken] = useState(allTokens[0]);


  useEffect(() => {
    // This ensures the code runs only on the client, preventing hydration errors.
    setIsClient(true);
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  let menuItems;

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
  } else if (userRole === 'admin') {
    menuItems = adminMenu;
  } else {
    menuItems = allMenuItems.filter(
      item => !item.roles || item.roles.includes(userRole || '')
    );
  }

  const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
  };


  return (
    <>
      <SidebarHeader className="p-4">
        <h2 className="text-2xl font-bold text-primary font-headline">BlockStratus</h2>
      </SidebarHeader>

      <div className="px-3 pb-3">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full h-auto justify-between items-center p-2 text-left bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/80">
                    <div className="flex items-center gap-2">
                        <TokenIcon network={selectedToken.network as string} className="h-8 w-8" />
                        <div className="flex flex-col gap-0.5 leading-none">
                            <span className="font-medium text-sm">{selectedToken.name}</span>
                            <span className="text-xs text-muted-foreground">{selectedToken.ticker} on {networkMap[selectedToken.network as string] || selectedToken.network}</span>
                        </div>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                {allTokens.map((token, index) => (
                    <DropdownMenuItem key={index} onSelect={() => setSelectedToken(token)}>
                        <TokenIcon network={token.network as string} className="h-5 w-5 mr-2" />
                        <div className="flex-1 flex justify-between items-center">
                            <span>{token.name}</span>
                             {selectedToken.id === token.id && <Check className="h-4 w-4" />}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SidebarContent className="p-4 pt-0">
        <SidebarMenu>
          {menuItems.map((item) => (
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
