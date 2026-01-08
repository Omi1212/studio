
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
  CardFooter,
} from '@/components/ui/card';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { TokenFormValues } from './issue-token-form';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const step2Schema = z.object({
  decimals: z.coerce.number().int().min(0).max(18),
  maxSupply: z.coerce.number().positive('Max supply must be a positive number'),
  isFreezable: z.boolean(),
  legalTokenizationDoc: z.any()
    .refine((files) => files?.[0], "Document is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf and .doc files are accepted."
    ),
  tokenIssuanceLegalDoc: z.any()
    .refine((files) => files?.[0], "Document is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf and .doc files are accepted."
    ),
});

type Step2FormValues = z.infer<typeof step2Schema>;

interface Step2TokenDetailsProps {
  onNext: (data: Partial<TokenFormValues>) => void;
  onBack: () => void;
  defaultValues?: Partial<TokenFormValues>;
}

export default function Step2TokenDetails({ onNext, onBack, defaultValues }: Step2TokenDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      decimals: defaultValues?.decimals || 6,
      maxSupply: defaultValues?.maxSupply || 1_000_000_000000,
      isFreezable: defaultValues?.isFreezable ?? true,
      legalTokenizationDoc: defaultValues?.legalTokenizationDoc,
      tokenIssuanceLegalDoc: defaultValues?.tokenIssuanceLegalDoc,
    }
  });

  const handleSubmit = async (data: Step2FormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async validation/operation
    onNext(data);
    setIsSubmitting(false);
  };
  
  const FileInput = ({ field }: { field: any }) => (
    <Input 
      type="file" 
      accept=".pdf,.doc,.docx"
      onChange={(e) => field.onChange(e.target.files)} 
      className="h-auto file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardContent className="space-y-6 pt-6">
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
            <FormField
              control={form.control}
              name="legalTokenizationDoc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submit Legal Tokenization Document</FormLabel>
                  <FormControl>
                    <FileInput field={field} />
                  </FormControl>
                  <FormDescription>Upload the legal tokenization document (PDF, DOC, DOCX).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tokenIssuanceLegalDoc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submit Token Issuance Legal Document</FormLabel>
                  <FormControl>
                     <FileInput field={field} />
                  </FormControl>
                   <FormDescription>Upload the token issuance legal document (PDF, DOC, DOCX).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
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
