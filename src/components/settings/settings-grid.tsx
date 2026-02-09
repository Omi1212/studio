'use client';

import {
  User,
  ShieldCheck,
  CreditCard,
  Puzzle,
  Lock,
  Bell,
  FileText,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const settingsItems = [
  {
    icon: User,
    title: 'User Profile',
    description: 'Manage your personal information and preferences.',
    href: '/profile',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance',
    description: 'View and manage your KYC & KYB verification status.',
    href: '/profile',
  },
  {
    icon: CreditCard,
    title: 'Payment Methods',
    description: 'Add and manage your linked bank accounts and cards.',
    href: '#',
  },
  {
    icon: Puzzle,
    title: 'Third Party Integrations',
    description: 'Connect and manage third-party applications.',
    href: '#',
  },
  {
    icon: Lock,
    title: 'Security & Access',
    description: 'Manage your password, 2FA, and session history.',
    href: '#',
  },
  {
    icon: Bell,
    title: 'Notifications & Alerts',
    description: 'Customize how and when you receive notifications.',
    href: '#',
  },
  {
    icon: FileText,
    title: 'Reports & Tax Data',
    description: 'Download your transaction reports and tax documents.',
    href: '#',
  },
  {
    icon: Briefcase,
    title: 'Workspace Settings',
    description: 'Manage general settings for your workspace.',
    href: '#',
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
    <Card className="flex flex-col">
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
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={href}>
            Manage <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function SettingsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {settingsItems.map((item) => (
        <SettingCard key={item.title} {...item} />
      ))}
    </div>
  );
}
