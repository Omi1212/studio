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
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export const formSchema = z.object({
  tokenName: z.string().min(1, 'Token name is required'),
  tokenTicker: z.string().min(1, 'Token ticker is required').max(5, 'Ticker cannot exceed 5 characters'),
  destinationAddress: z.string().min(1, 'Destination address is required'),
  decimals: z.coerce.number().int().min(0).max(18),
  maxSupply: z.coerce.number().positive('Max supply must be a positive number'),
  isFreezable: z.boolean(),
  tokenIcon: z.any().optional(),
  network: z.string().min(1, 'Network selection is required'),
  whitepaper: z.any()
    .refine((files) => files?.[0], "Whitepaper is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf and .doc files are accepted."
    ).optional(),
  legalTokenizationDoc: z.any()
    .refine((files) => files?.[0], "Document is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf and .doc files are accepted."
    ).optional(),
  tokenIssuanceLegalDoc: z.any()
    .refine((files) => files?.[0], "Document is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf and .doc files are accepted."
    ).optional(),
});

export type TokenFormValues = z.infer<typeof formSchema>;

interface IssueTokenFormProps {
  onSubmit: (data: TokenFormValues) => void;
}

export default function IssueTokenForm({ onSubmit }: IssueTokenFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TokenFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenName: 'Ingeniería Coin',
      tokenTicker: 'ING',
      destinationAddress: 'spark1pgssyd5f0685tu3v2hpqv2rx9cxu6vskyzjulwepzq79kd583gyw4z0gp92kjc',
      decimals: 6,
      maxSupply: 1_000_000_000000,
      isFreezable: true,
    },
  });

  const handleSubmit = async (data: TokenFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    onSubmit(data);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Create a New Token</CardTitle>
            <CardDescription>
              Fill out the details below to issue a new token on the network.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                          onChange={(e) => field.onChange(e.target.files)} 
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="decimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decimals</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    The number of decimal places the token can have (0-18).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxSupply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Supply</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    The maximum number of tokens that can be minted.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFreezable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Is Freezable?</FormLabel>
                    <FormDescription>
                      Can the token supply be frozen by the issuer?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Issuing Token...
                </>
              ) : (
                'Issue Token'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
