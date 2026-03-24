'use client';

import {
  User,
  ShieldCheck,
  CreditCard,
  Puzzle,
  KeyRound,
  Bell,
  FileText,
  Briefcase,
  Settings,
  Users,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const allSettingsItems = [
  {
    id: 'general',
    icon: Settings,
    title: 'General',
    description: 'Manage your business information.',
    href: '/settings/general',
  },
  {
    id: 'users',
    icon: Users,
    title: 'Users & Access',
    description: 'Define roles and permissions for your team.',
    href: '/settings/users-and-access',
  },
  {
    id: 'compliance',
    icon: ShieldCheck,
    title: 'Compliance',
    description: 'View and manage your KYC, KYB & KYT verification status.',
    href: '/settings/compliance',
  },
  {
    id: 'payment-methods',
    icon: CreditCard,
    title: 'Withdrawal Methods',
    description: 'Add and manage your bank accounts and crypto addresses for withdrawals.',
    href: '/settings/payment-methods',
  },
  {
    id: 'integrations',
    icon: Puzzle,
    title: 'Third Party Integrations',
    description: 'Connect and manage third-party applications.',
    href: '/settings/integrations',
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications & Alerts',
    description: 'Customize how and when you receive notifications.',
    href: '/settings/notifications',
  },
  {
    id: 'data-management',
    icon: FileText,
    title: 'Data Management',
    description: 'Download your transaction reports and data.',
    href: '/settings/data-management',
  },
];

interface SettingCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

function SettingCard({ icon: Icon, title, description, href }: SettingCardProps) {
  return (
    <Link href={href} className="flex h-full">
      <Card className="flex w-full flex-col hover:bg-muted/50 transition-colors">
        <CardHeader className="flex-1">
          <div className="flex flex-col items-start gap-4">
            <div className="bg-muted p-3 rounded-lg">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="pt-2">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}


export default function SettingsGrid() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const investorSettingsIds = [
    'general',
    'payment-methods',
    'notifications',
    'data-management',
  ];

  const filteredItems = userRole === 'investor' 
    ? allSettingsItems.filter(item => investorSettingsIds.includes(item.id))
    : allSettingsItems;

  const settingsItems = filteredItems.map(item => {
      if (item.id === 'payment-methods' && userRole === 'issuer') {
        return {
          ...item,
          title: 'Payment Methods',
          description: 'Add and manage your bank accounts and crypto addresses for payments.',
        };
      }
      return item;
    });


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {settingsItems.map((item) => (
        <SettingCard key={item.id} {...item} />
      ))}
    </div>
  );
}
