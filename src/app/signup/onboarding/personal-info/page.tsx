'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const personalInfoSchema = z.object({
  legalName: z.string().min(1, 'Full name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(1, 'Phone number is required'),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      legalName: '',
      dob: '',
      phone: '',
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      form.reset({
        legalName: parsedUser.legalName || parsedUser.name || '',
        phone: parsedUser.phone || '',
        dob: parsedUser.dob || ''
      });
    }
    setLoading(false);
  }, [form]);
  
  const handleContinue = async (data: PersonalInfoFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const updatedUser: User = {
      ...user,
      name: data.legalName, // Also update name field for display purposes
      legalName: data.legalName,
      phone: data.phone,
      dob: data.dob,
    };
    
    // Update currentUser in localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update user in the main users array in localStorage (optional but good practice)
    const existingUsersData = localStorage.getItem('users') || '[]';
    const existingUsers: User[] = JSON.parse(existingUsersData);
    const userIndex = existingUsers.findIndex(u => u.id === user.id);
    if (userIndex > -1) {
      existingUsers[userIndex] = updatedUser;
    } else {
      existingUsers.push(updatedUser);
    }
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    toast({
      title: 'Personal Info Saved!',
    });

    if (user.role === 'investor') {
        router.push('/signup/onboarding/details');
    } else if (user.role === 'issuer') {
        router.push('/signup/onboarding/business-info');
    } else {
        router.push('/dashboard');
    }
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
            <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-6">
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
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="e.g. +1 555-123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
              
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                    ) : (
                    'Continue'
                    )}
                </Button>
            </form>
        </Form>
      </div>
    </div>
  );
}
