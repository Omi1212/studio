
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
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { TokenFormValues } from './issue-token-form';

const step1Schema = z.object({
  tokenName: z.string().min(1, 'Token name is required'),
  tokenTicker: z.string().min(1, 'Token ticker is required').max(5, 'Ticker cannot exceed 5 characters'),
  tokenIcon: z.any().optional(),
  destinationAddress: z.string().min(1, 'Destination address is required'),
});

type Step1FormValues = z.infer<typeof step1Schema>;

interface Step1TokenInfoProps {
  onNext: (data: Partial<TokenFormValues>) => void;
  onSaveDraft: (data: Partial<TokenFormValues>) => void;
  defaultValues?: Partial<TokenFormValues>;
}

export default function Step1TokenInfo({ onNext, onSaveDraft, defaultValues }: Step1TokenInfoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
        tokenName: defaultValues?.tokenName || '',
        tokenTicker: defaultValues?.tokenTicker || '',
        destinationAddress: defaultValues?.destinationAddress || '',
        tokenIcon: defaultValues?.tokenIcon,
    }
  });

  const handleSubmit = async (data: Step1FormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async validation/operation
    onNext(data);
    setIsSubmitting(false);
  };
  
  const handleSaveDraftClick = () => {
    onSaveDraft(form.getValues());
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="tokenName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. My Awesome Token" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tokenTicker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Ticker</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. MAT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tokenIcon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Icon</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <div className="w-full">
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} 
                          className="h-auto file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an image for your token (e.g., PNG, JPG, SVG).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destinationAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. spark1..." {...field} />
                  </FormControl>
                   <FormDescription>
                    The address that will receive the initial supply of tokens.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-between">
            <Button type="button" variant="outline" onClick={handleSaveDraftClick}>Save as Draft</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Next
                </>
              ) : (
                'Next'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
