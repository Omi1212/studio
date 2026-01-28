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
import { usersData } from '@/lib/data';

type Role = 'agent' | 'superadmin' | 'investor' | 'issuer';

const roleEmails: Record<Role, string> = {
  agent: 'agent@gmail.com',
  superadmin: 'superadmin@gmail.com',
  investor: 'investor@gmail.com',
  issuer: 'issuer@gmail.com',
};

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleRoleSelect = (role: Role) => {
    setEmail(roleEmails[role]);
    setPassword('1234');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Find user by email
    const user = usersData.find(u => u.email === email);

    if (user) {
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      // Fallback for emails not in usersData
      const role = Object.keys(roleEmails).find(
        (key) => roleEmails[key as Role] === email
      ) as Role | undefined;
      
      if (role) {
        localStorage.setItem('userRole', role);
      } else {
        localStorage.removeItem('userRole');
      }
      localStorage.removeItem('currentUser');
    }

    // console.log('Logging in with:', { email, password, user });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    router.push('/');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
            <div className="w-72 h-auto relative" style={{ aspectRatio: '170/41' }}>
              <Image src="https://i.wpfc.ml/35/8gtsxa.png" alt="BlockStratus Logo" fill style={{objectFit: 'contain'}} sizes="18rem" priority />
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
            Don't you have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
                Sign up here
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
