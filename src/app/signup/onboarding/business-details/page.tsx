'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/countries';

const businessDetailsSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  language: z.string().min(1, 'Language is required'),
  currency: z.string().min(1, 'Currency is required'),
});

type BusinessDetailsFormValues = z.infer<typeof businessDetailsSchema>;

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
];

const currencies = [
  { value: 'usd', label: 'US Dollar (USD)' },
  { value: 'eur', label: 'Euro (EUR)' },
  { value: 'btc', label: 'Bitcoin (BTC)' },
];

export default function BusinessDetailsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

   const form = useForm<BusinessDetailsFormValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      country: '',
      language: 'es',
      currency: 'usd',
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // If user is not an issuer, they shouldn't be on this page.
      if (parsedUser.role !== 'issuer') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
      
      const countryValue = parsedUser.countryOfJurisdiction || '';

      form.reset({
        country: countryValue,
        language: parsedUser.language || 'es',
        currency: parsedUser.currency || 'usd',
      });
    } else {
        router.push('/signup');
    }
    setLoading(false);
  }, [router, form]);
  
  const handleFinalSubmit = async (data: BusinessDetailsFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
        const updatedUserData = {
            country: data.country,
            language: data.language,
            currency: data.currency,
            kybLevel: 1, // Assuming this step completes level 1
            kybStatus: 'pending' as const,
        };

        const response = await fetch(`/api/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData),
        });

        if (!response.ok) {
            throw new Error('Failed to update business details.');
        }
        
        const updatedUserFromApi = await response.json();
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUserFromApi));
        
        toast({
          title: 'Profile Updated!',
          description: 'You are all set. Welcome!',
        });

        router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'Could not save details.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen bg-background p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-headline font-semibold">Business Details</h1>
            <p className="text-muted-foreground mt-2">
                Add details to customize your experience.
            </p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6">
                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Country</FormLabel>
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
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Default Language</FormLabel>
                                 <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a language" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {languages.map(lang => (
                                            <SelectItem key={lang.value} value={lang.value}>
                                                {lang.label}
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
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Local Currency</FormLabel>
                                 <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a currency" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {currencies.map(curr => (
                                            <SelectItem key={curr.value} value={curr.value}>
                                                {curr.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                        'Continue'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
      </div>
    </div>
  );
}
