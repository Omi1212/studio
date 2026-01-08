
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Loader2, Triangle } from 'lucide-react';

type Role = 'admin' | 'superadmin' | 'investor' | 'issuer';

const roleEmails: Record<Role, string> = {
  admin: 'admin@gmail.com',
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
    console.log('Logging in with:', { email, password });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    router.push('/');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
            <Triangle className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-3xl font-bold text-primary font-headline">BlockStratus</h1>
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
          <Button variant="outline" onClick={() => handleRoleSelect('admin')}>
            Admin
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
            <a href="#" className="text-primary hover:underline">
                Sign up here
            </a>
        </p>
      </CardFooter>
    </Card>
  );
}
