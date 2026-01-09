
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const step3Schema = z.object({
  whitepaper: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf and .doc files are accepted."
    ),
  legalTokenizationDoc: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf and .doc files are accepted."
    ),
  tokenIssuanceLegalDoc: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf and .doc files are accepted."
    ),
});

type Step3FormValues = z.infer<typeof step3Schema>;

interface Step3DocumentsProps {
  onNext: (data: Partial<TokenFormValues>) => void;
  onBack: () => void;
  defaultValues?: Partial<TokenFormValues>;
}

export default function Step3Documents({ onNext, onBack, defaultValues }: Step3DocumentsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<Step3FormValues>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      whitepaper: defaultValues?.whitepaper,
      legalTokenizationDoc: defaultValues?.legalTokenizationDoc,
      tokenIssuanceLegalDoc: defaultValues?.tokenIssuanceLegalDoc,
    }
  });

  const handleSubmit = async (data: Step3FormValues) => {
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
              name="whitepaper"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whitepaper</FormLabel>
                  <FormControl>
                    <FileInput field={field} />
                  </FormControl>
                  <FormDescription>Upload the project's whitepaper (PDF, DOC, DOCX).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="legalTokenizationDoc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Tokenization Document</FormLabel>
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
                  <FormLabel>Token Issuance Legal Document</FormLabel>
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
