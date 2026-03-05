'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import React from 'react';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  walletAddress: z.string().min(10, 'Please enter a valid wallet address.'),
});

type InvestorFormValues = z.infer<typeof formSchema>;

interface InvestorFormProps {
  investor: User | null;
  onFinished: () => void;
}

export default function InvestorForm({ investor, onFinished }: InvestorFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditMode = !!investor;

  const form = useForm<InvestorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      walletAddress: '',
    },
  });
  
  React.useEffect(() => {
    if (investor) {
      form.reset({
        email: investor.email,
        name: investor.name,
        walletAddress: investor.walletAddress,
      });
    } else {
        form.reset({
            email: '',
            name: '',
            walletAddress: '',
        });
    }
  }, [investor, form]);
  
  const onSubmit = async (values: InvestorFormValues) => {
    setIsSubmitting(true);
    
    const url = isEditMode ? `/api/investors/${investor.id}` : '/api/investors/invite';
    const method = isEditMode ? 'PATCH' : 'POST';
    
    // For invite, we need to add companyId
    const payload = isEditMode ? values : { 
        ...values,
        inviteScope: 'company',
        companyId: localStorage.getItem('selectedCompanyId'),
     };

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Failed to ${isEditMode ? 'update' : 'invite'} investor.`);
        }
        
        toast({
            title: `Investor ${isEditMode ? 'updated' : 'invited'}!`,
            description: `Details for ${values.name} have been saved.`,
        });
        
        // This is a simplistic way to refresh data. In a real app, you'd use a state management library.
        window.dispatchEvent(new Event('investor-data-changed'));
        onFinished();

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: (error as Error).message,
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <>
      <SheetHeader className="px-6">
        <SheetTitle>{isEditMode ? 'Edit Investor' : 'Invite Investor'}</SheetTitle>
        <SheetDescription>
            {isEditMode ? 'Update the details for this investor.' : 'Invite a new investor to your company. They will receive an email to join.'}
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto p-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Wallet Address</FormLabel>
                        <FormControl>
                            <Input placeholder="spark1..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <SheetFooter className="pt-6">
                    <Button type="button" variant="outline" onClick={onFinished}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                         {isEditMode ? 'Save Changes' : 'Send Invitation'}
                    </Button>
                </SheetFooter>
            </form>
        </Form>
      </div>
    </>
  );
}
