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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usersData } from '@/lib/data';
import type { User } from '@/lib/types';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'investor' | 'issuer' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!role) {
      toast({
        variant: 'destructive',
        title: 'Role not selected',
        description: 'Please select a role to continue.',
      });
      return;
    }
    setIsSubmitting(true);

    const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || JSON.stringify(usersData));
    const emailExists = existingUsers.some(user => user.email === email);

    if (emailExists) {
        toast({
            variant: 'destructive',
            title: 'Email already in use',
            description: 'Please use a different email address.',
        });
        setIsSubmitting(false);
        return;
    }

    const newUser: User = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      role,
      walletAddress: `spark1q...${Math.random().toString(36).substring(2, 11)}`,
      kycStatus: 'pending',
      status: 'active',
      kycLevel: 1,
    };

    const updatedUsers = [newUser, ...existingUsers];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Log the user in
    localStorage.setItem('userRole', newUser.role);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: 'Account Created!',
      description: 'Welcome to BlockStratus.',
    });

    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
            <div className="w-72 h-auto relative" style={{ aspectRatio: '170/41' }}>
              <Image src="https://i.wpfc.ml/35/8gtsxa.png" alt="BlockStratus Logo" fill style={{objectFit: 'contain'}} sizes="18rem" priority />
            </div>
        </div>
        <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
        <CardDescription>
          Choose your role and fill in your details to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              <Label htmlFor="role">I am a...</Label>
              <Select onValueChange={(value: 'investor' | 'issuer') => setRole(value)} value={role}>
                  <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="issuer">Issuer</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
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
