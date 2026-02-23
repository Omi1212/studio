'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { User } from '@/lib/types';

export default function SignupForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'investor' | 'issuer'>('investor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Email required',
        description: 'Please enter your email address.',
      });
      return;
    }
    // Simple email regex for basic validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        toast({
            variant: 'destructive',
            title: 'Invalid Email',
            description: 'Please enter a valid email address.',
        });
        return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'Please check your password and try again.',
      });
      return;
    }
    if (!password) {
       toast({
        variant: 'destructive',
        title: 'Password is required',
        description: 'Please enter a password.',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
        const generatedName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        const newUserPayload = {
            name: generatedName,
            email,
            role,
            walletAddress: `spark1q...${Math.random().toString(36).substring(2, 11)}`,
            kycStatus: 'pending' as const,
            status: 'active' as const,
            kycLevel: 1,
        };
        
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUserPayload),
        });

        if (!response.ok) {
             // Basic error handling, can be improved to check for specific status codes
            const errorData = await response.json().catch(() => ({ message: 'Failed to create account.' }));
            throw new Error(errorData.message || 'Failed to create account.');
        }
        
        const createdUser: User = await response.json();

        if (createdUser.role === 'issuer') {
            await fetch('/api/issuers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: createdUser.name,
                    email: createdUser.email,
                    walletAddress: createdUser.walletAddress,
                    issuedAssets: 0,
                    pendingAssets: 0,
                    status: 'active'
                }),
            });
        }

        localStorage.setItem('userRole', createdUser.role);
        localStorage.setItem('currentUser', JSON.stringify(createdUser));

        toast({
          title: 'Account Created!',
          description: 'Welcome to BlockStratus.',
        });

        router.push('/signup/onboarding/verify');

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error creating account',
            description: error.message || 'Please try again.',
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
            <div className="w-72 h-auto relative" style={{ aspectRatio: '170/41' }}>
              <Image src="https://i.ibb.co/dsx2xgVc/image-69.png" alt="BlockStratus Logo" fill style={{objectFit: 'contain'}} sizes="18rem" priority className="block dark:hidden" />
              <Image src="https://i.wpfc.ml/35/8gtsxa.png" alt="BlockStratus Logo" fill style={{objectFit: 'contain'}} sizes="18rem" priority className="hidden dark:block" />
            </div>
        </div>
        {step === 1 ? (
          <>
            <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
            <CardDescription>
              Choose your role and enter your details to get started.
            </CardDescription>
          </>
        ) : (
           <>
            <CardTitle className="text-2xl font-headline">
                Create an Account as an {role === 'investor' ? 'Investor' : 'Issuer'}
            </CardTitle>
            <CardDescription>
                Create a password to secure your new account.
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 && (
            <>
                <Tabs value={role} onValueChange={(value) => setRole(value as 'investor' | 'issuer')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="investor">I am an Investor</TabsTrigger>
                        <TabsTrigger value="issuer">I am an Issuer</TabsTrigger>
                    </TabsList>
                </Tabs>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Continue
                    </Button>
                </form>
            </>
        )}

        {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="email-display">Email</Label>
                    <Input
                        id="email-display"
                        type="email"
                        value={email}
                        disabled
                        className="bg-muted/50"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full">
                        Back
                    </Button>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing Up...
                        </>
                        ) : (
                        'Sign Up'
                        )}
                    </Button>
                </div>
            </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Separator />
        <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
                Sign in here
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
