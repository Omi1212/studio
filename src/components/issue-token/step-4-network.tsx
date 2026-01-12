
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { TokenFormValues } from './issue-token-form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const step4Schema = z.object({
  network: z.string().min(1, 'Please select a network'),
});

type Step4FormValues = z.infer<typeof step4Schema>;

interface Step4NetworkProps {
  onNext: (data: Partial<TokenFormValues>) => void;
  onBack: () => void;
  onSaveDraft: (data: Partial<TokenFormValues>) => void;
  defaultValues?: Partial<TokenFormValues>;
}

const networks = [
    { 
        id: 'spark', 
        name: 'Spark Network', 
        icon: <svg width="24" height="24" viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M39.68 24.656L40.836 0H26.398l1.156 24.656-23.092-8.718L0 29.668l23.807 6.52L8.38 55.457l11.68 8.487 13.558-20.628 13.558 20.627 11.68-8.486L43.43 36.188l23.804-6.52-4.461-13.73-23.092 8.718zM33.617 33v.001z" fill="currentColor"></path></svg>,
        description: {
            whatIsIt: 'High-speed tokens built on the Bitcoin Lightning Network. They enable instant, low-fee peer-to-peer transactions without waiting for block confirmations.',
            bestFor: [
                'Micro-payments: Paying for coffee, content, or tips.',
                'Gaming: In-game currency and rewards.',
                'Consumer Apps: High-frequency transactions where speed is critical.',
            ]
        }
    },
    { 
        id: 'liquid', 
        name: 'Liquid Network', 
        icon: <img src="https://liquid.net/_next/static/media/logo.28b5ba97.svg" alt="Liquid Network Logo" className="h-6 w-6" />,
        description: {
            whatIsIt: 'A Bitcoin sidechain designed for high-performance asset issuance. It offers faster settlement than the main chain (2 minutes) and "Confidential Transactions," which hide asset amounts and types from the public eye.',
            bestFor: [
                'Stablecoins: Digital fiat currencies (USD/EUR).',
                'Security Tokens: Tokenized stocks, bonds, or real estate.',
                'Trading: Moving funds between exchanges quickly and privately.',
            ]
        }
    },
    { 
        id: 'rgb', 
        name: 'RGB Protocol', 
        icon: <img src="https://rgb.tech/logo/rgb-symbol-color.svg" alt="RGB Protocol Logo" className="h-6 w-6" />,
        description: {
            whatIsIt: 'A client-side validation protocol for smart contracts. RGB keeps token data off-chain (stored locally on your device) while using the Bitcoin blockchain only for commitment. It offers the highest level of privacy and scalability.',
            bestFor: [
                'Maximum Privacy: Assets that leave no trace on the blockchain.',
                'Complex Smart Contracts: DAOs and programmable assets.',
                'Digital Collectibles: Unique assets with private metadata.',
            ]
        }
    },
    {
        id: 'taproot',
        name: 'Taproot Assets',
        icon: <img src="https://docs.lightning.engineering/~gitbook/image?url=https%3A%2F%2F2545062540-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MIzyiDsFtJBYVyhr1nT%252Favatar-1602260100761.png%3Fgeneration%3D1602260100982225%26alt%3Dmedia&width=32&dpr=2&quality=100&sign=15d20b51&sv=2" alt="Taproot Assets Logo" className="h-6 w-6" />,
        description: {
            whatIsIt: 'A standard for minting assets on Bitcoin using Taproot. It embeds asset data efficiently and acts as a bridge to move assets to the Lightning Network.',
            bestFor: [
                'Asset Minting: The initial creation and issuance of tokens.',
                'On-Chain Storage: Holding assets securely on the main Bitcoin blockchain.',
                'Bridging: Developers building custom solutions to move assets between Layer 1 and Layer 2.',
            ]
        }
    }
]

export default function Step4Network({ onNext, onBack, onSaveDraft, defaultValues }: Step4NetworkProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<Step4FormValues>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      network: defaultValues?.network || 'spark',
    }
  });

  const handleSubmit = async (data: Step4FormValues) => {
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
              name="network"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 gap-4"
                    >
                      {networks.map(network => (
                          <FormItem key={network.id} className="w-full">
                              <FormLabel
                                  htmlFor={network.id}
                                  className={cn(
                                  'flex flex-col items-start justify-start gap-4 rounded-md border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all',
                                  field.value === network.id && 'border-primary'
                                  )}
                              >
                                  <RadioGroupItem value={network.id} id={network.id} className="sr-only" />
                                  <div className="flex items-center gap-4">
                                      {network.icon}
                                      <span className="font-semibold">{network.name}</span>
                                  </div>
                                  {field.value === network.id && (
                                      <div className="space-y-4 pt-4 text-sm w-full animate-in fade-in-0 duration-500">
                                          <Separator />
                                          <div className="text-muted-foreground space-y-4">
                                              <div>
                                                  <h4 className="font-semibold text-foreground mb-1">What is it?</h4>
                                                  <p>{network.description.whatIsIt}</p>
                                              </div>
                                              <div>
                                                  <h4 className="font-semibold text-foreground mb-1">Best for:</h4>
                                                  <ul className="list-disc pl-5 space-y-1">
                                                      {network.description.bestFor.map((item, i) => <li key={i}>{item}</li>)}
                                                  </ul>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </FormLabel>
                          </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-between">
            <div className='flex gap-2'>
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
               <Button type="button" variant="outline" onClick={handleSaveDraftClick}>Save as Draft</Button>
            </div>
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
