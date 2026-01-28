
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/countries';

const detailsSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  dob: z.string().min(1, 'Date of birth is required'),
});

type DetailsFormValues = z.infer<typeof detailsSchema>;

export default function DetailsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

   const form = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      country: '',
      dob: '',
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // If user is not an investor, they shouldn't be on this page.
      if (parsedUser.role !== 'investor') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
      
      const countryValue = countries.find(c => c.label === parsedUser.country)?.value || parsedUser.country || '';

      form.reset({
        country: countryValue,
        dob: parsedUser.dob || ''
      });
    }
    setLoading(false);
  }, [router, form]);
  
  const handleFinalSubmit = async (data: DetailsFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const updatedUser: User = {
      ...user,
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
  
  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen bg-background p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-headline font-semibold">Investor Details</h1>
            <p className="text-muted-foreground mt-2">
                A few extra details required for investors.
            </p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6">
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
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {countries.map(country => (
                                            <SelectItem key={country.value} value={country.value}>
                                                {country.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
              
                <div className="flex gap-2">
                     <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">
                        Back
                    </Button>
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
                </div>
            </form>
        </Form>
      </div>
    </div>
  );
}
