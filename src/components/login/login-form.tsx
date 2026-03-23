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
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type Role = 'agent' | 'superadmin' | 'investor' | 'issuer';

const roleEmails: Record<Role, string> = {
  agent: 'agent@gmail.com',
  superadmin: 'superadmin@gmail.com',
  investor: 'investor1@gmail.com',
  issuer: 'ag.issuera@gmail.com',
};

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRoleSelect = (role: Role) => {
    setEmail(roleEmails[role]);
    setPassword('1234');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Find user by email
      const res = await fetch(`/api/users?query=${encodeURIComponent(email)}`);
      
      if (!res.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }
      
      const usersData: { data: User[] } = await res.json();
      
      if (!usersData || !usersData.data) {
          throw new Error('Invalid response from server.');
      }

      const user = usersData.data[0];

      if (user) {
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        // Fallback for demo emails not present in mock data
        const demoRole = (Object.keys(roleEmails) as Role[]).find(
          (key) => roleEmails[key] === email
        );
        
        if (demoRole) {
          localStorage.setItem('userRole', demoRole);
           // Create a mock user object for consistency if needed, or clear it.
          localStorage.removeItem('currentUser'); 
        } else {
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'User not found. Please check your email and password.',
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      toast({
        title: 'Login Successful',
        description: 'Welcome to BlockStratus!',
      });

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network latency
      router.push('/');

    } catch (error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Login Error',
            description: error.message || 'An unexpected error occurred. Please try again.',
        });
        setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
            <div className="w-72 h-auto relative" style={{ aspectRatio: '170/41' }}>
              <Image src="https://i.ibb.co/dsx2xgVc/image-69.png" alt="BlockStratus Logo" fill style={{objectFit: 'contain'}} sizes="18rem" priority className="block dark:hidden" />
              <Image src="https://i.ibb.co/pBzFXyhT/imagen-2026-03-23-103520188.png" alt="BlockStratus Logo" fill style={{objectFit: 'contain'}} sizes="18rem" priority className="hidden dark:block" />
            </div>
        </div>
        <CardTitle className="text-2xl font-headline">Log in with Email</CardTitle>
        <CardDescription>
          Enter your email and password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email or Username</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex items-center w-full">
          <Separator className="flex-1" />
          <span className="px-4 text-xs text-muted-foreground">Or sign in with a role</span>
          <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Button variant="outline" onClick={() => handleRoleSelect('agent')}>
            Agent
          </Button>
          <Button variant="outline" onClick={() => handleRoleSelect('superadmin')}>
            Super Admin
          </Button>
          <Button variant="outline" onClick={() => handleRoleSelect('investor')}>
            Investor
          </Button>
          <Button variant="outline" onClick={() => handleRoleSelect('issuer')}>
            Issuer
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
            Don&apos;t you have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
                Sign up here
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
