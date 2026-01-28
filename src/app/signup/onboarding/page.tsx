'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const onboardingSchema = z.object({
  legalName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  country: z.string().optional(),
  dob: z.string().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);
  
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      legalName: '',
      phone: '',
      country: '',
      dob: '',
    },
  });

  const handleFinalSubmit = async (data: OnboardingFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const updatedUser: User = {
      ...user,
      name: data.legalName, // Also update name field for display purposes
      legalName: data.legalName,
      phone: data.phone,
      country: data.country,
      dob: data.dob,
    };
    
    // Update currentUser in localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update user in the main users array in localStorage
    const existingUsersData = localStorage.getItem('users') || '[]';
    const existingUsers: User[] = JSON.parse(existingUsersData);
    const userIndex = existingUsers.findIndex(u => u.id === user.id);
    if (userIndex > -1) {
      existingUsers[userIndex] = updatedUser;
    } else {
      existingUsers.push(updatedUser);
    }
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: 'Profile Updated!',
      description: 'You are all set. Welcome!',
    });

    router.push('/dashboard');
  };
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-background p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!user) {
     router.push('/login');
     return <div className="flex items-center justify-center min-h-screen bg-background p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-headline font-semibold">Just a few more details...</h1>
            <p className="text-muted-foreground mt-2">
                Please provide some additional information to complete your profile.
            </p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="legalName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. +1 555-123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                
                {user.role === 'investor' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Investor Details</CardTitle>
                            <CardDescription>This information may be required for KYC purposes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Country of Residence</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. El Salvador" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                )}
              
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                    ) : (
                    'Complete Profile'
                    )}
                </Button>
            </form>
        </Form>
      </div>
    </div>
  );
}
