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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, FileLock2, ArrowLeft, ArrowRightLeft, Building, Landmark, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import KycProviderList from '@/components/settings/kyc-provider-list';
import Image from 'next/image';

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

const kybLevels = [
  {
    level: 1,
    title: 'Business Level 1',
    description: 'Basic business information provided.',
    requirements: ['Business Name', 'Country of Operation'],
  },
  {
    level: 2,
    title: 'Business Level 2',
    description: 'Legal business documents submitted.',
    requirements: ['Certificate of Incorporation', 'Memorandum of Association'],
  },
  {
    level: 3,
    title: 'Business Level 3',
    description: 'Beneficial ownership information verified.',
    requirements: ['Details of major shareholders (over 25%)'],
  },
  {
    level: 4,
    title: 'Business Level 4',
    description: 'Financial information verified.',
    requirements: ['Business Bank Statements', 'Financial Reports'],
  },
];

const kybProviders = [
  { name: 'Sumsub', logo: 'https://i.ibb.co/xKGcFvcs/1.png' },
  { name: 'Onfido', logo: 'https://i.ibb.co/8g2Qmknh/2.png' },
  { name: 'Kyckr', logo: 'https://i.ibb.co/0yYWB1Yb/8.png' },
  { name: 'Middesk', logo: 'https://i.ibb.co/8DsyxCyR/9.png' },
  { name: "Moody's Analytics", logo: 'https://i.ibb.co/Pzc00sHp/10.png' },
];

const kytProviders = [
  { name: 'Scorechain', logo: 'https://i.ibb.co/xKGcFvcs/1.png' },
  { name: 'Crystal Intelligence', logo: 'https://i.ibb.co/8g2Qmknh/2.png' },
  { name: 'Chainalysis', logo: 'https://i.ibb.co/JW2JLXp6/3.png' },
  { name: 'TRM Labs', logo: 'https://i.ibb.co/bMT2x7YG/4.png' },
  { name: 'Arkham', logo: 'https://i.ibb.co/QFm6xmyM/5.png' },
];


interface KybProviderListProps {
  onViewStatus: () => void;
}

function KybProviderList({ onViewStatus }: KybProviderListProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-center text-muted-foreground">
        Choose a provider to continue with your business verification.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kybProviders.map((provider) => (
          <Card
            key={provider.name}
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors group rounded-xl"
          >
            <div className="relative h-12 w-28 mb-4">
              <Image
                src={provider.logo}
                alt={`${provider.name} logo`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="rounded-md"
              />
            </div>
            <CardTitle className="text-base font-semibold">{provider.name}</CardTitle>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="link" onClick={onViewStatus} className="text-muted-foreground">
          <ShieldCheck className="mr-2 h-4 w-4" /> Use Platform Verification
        </Button>
      </div>
    </div>
  );
}

interface KytProviderListProps {}

function KytProviderList({}: KytProviderListProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-center text-muted-foreground">
        Choose a provider to continue with your transaction monitoring.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kytProviders.map((provider) => (
          <Card
            key={provider.name}
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors group rounded-xl"
          >
            <div className="relative h-12 w-28 mb-4">
              <Image
                src={provider.logo}
                alt={`${provider.name} logo`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="rounded-md"
              />
            </div>
            <CardTitle className="text-base font-semibold">{provider.name}</CardTitle>
          </Card>
        ))}
      </div>
    </div>
  );
}


function VerificationLevelIndicator({ currentLevel, levels }: { currentLevel: number, levels: typeof kycLevels | typeof kybLevels}) {
  return (
    <div className="space-y-6">
      {levels.map((level) => {
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
                {level.level < levels.length && <div className={cn("w-0.5 flex-1", isCompleted ? 'bg-green-500' : 'bg-muted-foreground/30')} />}
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

function VerificationPrompt({ user, isBusiness, onStart }: { user: User, isBusiness: boolean, onStart?: () => void }) {
    const levels = isBusiness ? kybLevels : kycLevels;
    const currentLevel = (isBusiness ? user.kybLevel : user.kycLevel) || 0;
    const nextLevel = levels.find(level => level.level === currentLevel + 1);

    if (nextLevel) {
        return (
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-6 text-center h-full">
            <h4 className="font-bold text-lg">Continue to {nextLevel.title}</h4>
            <p className="text-muted-foreground text-sm mt-2 mb-4">
            To unlock higher limits and more features, please complete the next verification step. You will need to provide:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside mb-4 text-left">
                {nextLevel.requirements.map(req => <li key={req}>{req}</li>)}
            </ul>
            <Button onClick={onStart}>
            Start {nextLevel.title}
            </Button>
        </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-6 text-center h-full">
            <ShieldCheck className="h-16 w-16 text-green-500 mb-4" />
            <h4 className="font-bold text-lg">You are fully verified!</h4>
            <p className="text-muted-foreground text-sm mt-2 mb-4">
                You have successfully completed all identity verification steps.
            </p>
             <Button variant="outline" onClick={onStart}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Providers
            </Button>
        </div>
    );
}

function getVerificationStatusText(status: 'verified' | 'pending' | 'rejected' | undefined) {
    if (!status) return 'Not Started';
    switch(status) {
        case 'verified': return 'Verified';
        case 'pending': return 'In Review';
        case 'rejected': return 'Rejected';
        default: return 'Not Started';
    }
  }

  function getKycStatusDescription(user: User) {
      const level = user.kycLevel || 0;
      if (level === 0 && user.kycStatus !== 'pending') return 'Identity verification not started.';
      if (user.kycStatus === 'pending') return `Your verification for Level ${level + 1} is currently under review.`;
      if (user.kycStatus === 'verified') {
          if (level >= kycLevels.length) return 'You have successfully completed all identity verification steps.';
          return `Level ${level} verified. You can now proceed to the next level of verification.`;
      }
      if (user.kycStatus === 'rejected') return `Your verification for Level ${level} was rejected. Please review the requirements and submit your documents again.`;
      return 'Identity verification not started.';
  }

  function getKybStatusDescription(user: User) {
      const level = user.kybLevel || 0;
      if (level === 0 && user.kybStatus !== 'pending') return 'Business verification not started.';
      if (user.kybStatus === 'pending') return `Your verification for Business Level ${level + 1} is currently under review.`;
      if (user.kybStatus === 'verified') {
          if (level >= kybLevels.length) return 'Your business has been fully verified.';
          return `Business Level ${level} verified. You can now proceed to the next level of verification.`;
      }
      if (user.kybStatus === 'rejected') return `Your verification for Business Level ${level} was rejected. Please review the requirements and submit your documents again.`;
      return 'Business verification not started.';
  }

  function getKytStatusDescription(user: User) {
    if (user.kytStatus === 'pending') return `Your verification is currently under review.`;
    if (user.kytStatus === 'verified') return 'Your transactions are being monitored.';
    if (user.kytStatus === 'rejected') return `Your KYT verification was rejected.`;
    return 'Transaction monitoring not started.';
}


export default function CompliancePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<'kyc' | 'kyb' | 'kyt'>('kyc');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [kycStep, setKycStep] = useState<'providers' | 'status'>('providers');
  const [kybStep, setKybStep] = useState<'providers' | 'status'>('providers');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        fetch(`/api/users?perPage=999`)
            .then(res => res.json())
            .then((allUsers: {data: User[]}) => {
                const apiUser = allUsers.data.find(u => u.id === parsedUser.id);
                setUser(apiUser ? { ...apiUser, ...parsedUser } : parsedUser);
            })
            .catch(() => setUser(parsedUser))
            .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, []);

  const handleOpenKycDialog = () => {
    setSelectedVerification('kyc');
    setKycStep('providers');
    setIsVerificationModalOpen(true);
  };
  
  const handleOpenKybDialog = () => {
    setSelectedVerification('kyb');
    setKybStep('providers');
    setIsVerificationModalOpen(true);
  };

  const handleOpenKytDialog = () => {
    setSelectedVerification('kyt');
    setIsVerificationModalOpen(true);
  };

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

  const isBusinessRole = user.role === 'issuer' || user.role === 'agent' || user.role === 'superadmin';
  
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/settings"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Compliance
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle>Verification Status</CardTitle>
                      <CardDescription>View and manage your KYC & KYB verification status.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          <div
                              onClick={handleOpenKycDialog}
                              className="rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-muted/50"
                          >
                              <ShieldCheck className="h-8 w-8 text-muted-foreground shrink-0" />
                              <div className="flex-1">
                                  <p className="font-semibold">KYC (Know Your Customer)</p>
                                  <p className={cn("text-sm", user.kycStatus === 'verified' ? 'text-green-500' : 'text-muted-foreground')}>{getVerificationStatusText(user.kycStatus)}</p>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                          
                          {isBusinessRole && (
                            <div
                                onClick={handleOpenKybDialog}
                                className="rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-muted/50"
                            >
                                <Building className="h-8 w-8 text-muted-foreground shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold">KYB (Know Your Business)</p>
                                    <p className={cn("text-sm", user.kybStatus === 'verified' ? 'text-green-500' : 'text-muted-foreground')}>{getVerificationStatusText(user.kybStatus)}</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div
                              onClick={handleOpenKytDialog}
                              className="rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-muted/50"
                          >
                              <Landmark className="h-8 w-8 text-muted-foreground shrink-0" />
                              <div className="flex-1">
                                  <p className="font-semibold">KYT (Know Your Transaction)</p>
                                  <p className={cn("text-sm", user.kytStatus === 'verified' ? 'text-green-500' : 'text-muted-foreground')}>{getVerificationStatusText(user.kytStatus)}</p>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                      </div>
                  </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
       <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>
                        {selectedVerification === 'kyc' ? 'KYC Verification' 
                         : selectedVerification === 'kyb' ? 'KYB Verification'
                         : 'KYT (Know Your Transaction)'
                        }
                    </DialogTitle>
                </DialogHeader>
                <div className="pt-4">
                    {selectedVerification === 'kyc' ? (
                        kycStep === 'providers' ? (
                            <KycProviderList onViewStatus={() => setKycStep('status')} />
                        ) : (
                            <div>
                                <h3 className="font-semibold">Status:</h3>
                                <p className="text-muted-foreground text-sm mb-6">{getKycStatusDescription(user)}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <VerificationLevelIndicator
                                    currentLevel={user.kycLevel || 0}
                                    levels={kycLevels}
                                    />
                                    <VerificationPrompt user={user} isBusiness={false} onStart={() => setKycStep('providers')} />
                                </div>
                            </div>
                        )
                    ) : selectedVerification === 'kyb' ? (
                         kybStep === 'providers' ? (
                            <KybProviderList onViewStatus={() => setKybStep('status')} />
                         ) : (
                            <div>
                                <h3 className="font-semibold">Status:</h3>
                                <p className="text-muted-foreground text-sm mb-6">{getKybStatusDescription(user)}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <VerificationLevelIndicator 
                                    currentLevel={user.kybLevel || 0}
                                    levels={kybLevels}
                                    />
                                    <VerificationPrompt user={user} isBusiness={true} onStart={() => setKybStep('providers')} />
                                </div>
                            </div>
                        )
                    ) : selectedVerification === 'kyt' ? (
                         <KytProviderList />
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <p>Select a verification type.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    </SidebarProvider>
  );
}
