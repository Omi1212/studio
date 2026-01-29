
'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, User as UserIcon, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { usersData } from '@/lib/data';
import { countries } from '@/lib/countries';

const kycLevels = [
  {
    level: 1,
    title: 'User Level 1',
    description: 'Email and phone number verified.',
    requirements: ['Verified Email', 'Verified Phone Number'],
  },
  {
    level: 2,
    title: 'User Level 2',
    description: 'Basic personal information provided.',
    requirements: ['Full Name', 'Date of Birth', 'Residential Address'],
  },
  {
    level: 3,
    title: 'User Level 3',
    description: 'Official ID document submitted.',
    requirements: ['Passport or National ID', 'Liveness Check'],
  },
  {
    level: 4,
    title: 'User Level 4',
    description: 'Proof of address verified.',
    requirements: ['Utility Bill or Bank Statement'],
  },
];

function KycLevelIndicator({ currentLevel }: { currentLevel: number }) {
  return (
    <div className="space-y-6">
      {kycLevels.map((level) => {
        const isCompleted = currentLevel >= level.level;
        const isCurrent = currentLevel + 1 === level.level;

        return (
          <div key={level.level} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
                <div
                className={cn(
                    'flex-center h-8 w-8 rounded-full border-2',
                    isCompleted ? 'border-green-500 bg-green-500 text-white' : isCurrent ? 'border-primary' : 'border-muted-foreground/30'
                )}
                >
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <p className={cn(isCurrent ? 'text-primary font-bold' : 'text-muted-foreground')}>{level.level}</p>}
                </div>
                {level.level < 4 && <div className={cn("w-0.5 flex-1", isCompleted ? 'bg-green-500' : 'bg-muted-foreground/30')} />}
            </div>
            <div className="flex-1 -mt-1">
              <p className={cn("font-semibold", isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground')}>{level.title}</p>
              <p className="text-sm text-muted-foreground">{level.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KycVerificationPrompt({ user }: { user: User }) {
  const nextKycLevel = kycLevels.find(level => level.level === (user.kycLevel || 0) + 1);

  if (nextKycLevel) {
    return (
      <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-6 text-center h-full">
        <h4 className="font-bold text-lg">Continue to {nextKycLevel.title}</h4>
        <p className="text-muted-foreground text-sm mt-2 mb-4">
          To unlock higher limits and more features, please complete the next verification step. You will need to provide:
        </p>
        <ul className="text-sm text-muted-foreground list-disc list-inside mb-4 text-left">
            {nextKycLevel.requirements.map(req => <li key={req}>{req}</li>)}
        </ul>
        <Button>
          Start {nextKycLevel.title}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-6 text-center h-full">
      <ShieldCheck className="h-16 w-16 text-green-500 mb-4" />
      <h4 className="font-bold text-lg">You are fully verified!</h4>
      <p className="text-muted-foreground text-sm mt-2">
        You have successfully completed all identity verification steps.
      </p>
    </div>
  );
}


function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) {
  return (
    <div className="flex items-center gap-4">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || 'Not provided'}</p>
      </div>
    </div>
  )
}

function PersonalInfoRow({ label, value, actionLabel, onActionClick }: { label: string; value: React.ReactNode; actionLabel?: string; onActionClick?: () => void; }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2">
            <p className="text-sm text-muted-foreground mb-1 sm:mb-0">{label}</p>
            <div className="flex items-center gap-4">
                {actionLabel && (
                    <Button variant="link" className="text-sm p-0 h-auto text-primary hover:underline" onClick={onActionClick}>
                        {actionLabel}
                    </Button>
                )}
                <p className="text-sm font-medium text-right">{value}</p>
            </div>
        </div>
    );
}


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const fullUserData = usersData.find((u: User) => u.id === parsedUser.id);
      
       if (parsedUser.role !== 'investor') {
        const investorUser = usersData.find((u: User) => u.role === 'investor');
        if(investorUser) setUser(investorUser);
        else setUser(parsedUser); // fallback to current user
      } else {
        setUser(fullUserData || parsedUser);
      }
    }
    setLoading(false);
  }, []);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };
  
  const kycStatusMap = {
    verified: { text: "Verified", className: "text-green-400 border-green-400" },
    pending: { text: "Pending", className: "text-yellow-400 border-yellow-400" },
    rejected: { text: "Rejected", className: "text-red-500 border-red-500" },
  }
  const currentKycStatus = user ? kycStatusMap[user.kycStatus] : kycStatusMap.pending;

  if (loading) {
      return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <Skeleton className="w-full max-w-4xl h-[600px]" />
        </div>
      )
  }

  if (!user) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>No user data found. Please log in.</p>
      </div>
    );
  }

    // Basic email masking
  const maskEmail = (email: string) => {
      if (!email) return '';
      const [local, domain] = email.split('@');
      if (local.length > 3) {
          return `${local.substring(0, 2)}***@${domain}`;
      }
      return email;
  }
  
  const countryObj = countries.find(c => c.value === user.country || c.label === user.country);
  const countryDisplay = countryObj ? countryObj.label : user.country;

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-headline font-semibold">
                    My Profile
                </h1>
            </div>
            
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 text-4xl">
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl pt-2">{user.name}</CardTitle>
                        <CardDescription>User Level {user.kycLevel}</CardDescription>
                        <Badge variant="outline" className={currentKycStatus.className}>
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            KYC Status: {currentKycStatus.text}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={UserIcon} label="Username" value={user.name.toLowerCase().replace(/\s+/g, '')} />
                        <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-7">
                    <CardHeader>
                        <CardTitle>Personal information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <PersonalInfoRow label="Country of Residence" value={countryDisplay || 'Not set'} actionLabel="Change" />
                        <PersonalInfoRow label="Legal Name" value={user.legalName || 'Not set'} />
                        <PersonalInfoRow label="Date of Birth" value={user.dob || 'Not set'} />
                        <PersonalInfoRow label="Identification Documents" value={user.idDoc || 'Not set'} />
                        <PersonalInfoRow label="Address" value={user.address || 'Not set'} />
                        <PersonalInfoRow label="Email Address" value={maskEmail(user.email)} />
                    </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                    <CardTitle>Identity Verification</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <KycLevelIndicator currentLevel={user.kycLevel || 0} />
                        <KycVerificationPrompt user={user} />
                    </div>
                </CardContent>
              </Card>
            </div>

          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
    
