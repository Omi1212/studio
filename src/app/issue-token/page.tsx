
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { useToast } from '@/hooks/use-toast';
import { Stepper, StepperItem } from '@/components/ui/stepper';
import Step1TokenInfo from '@/components/issue-token/step-1-token-info';
import { TokenFormValues } from '@/components/issue-token/issue-token-form';
import TokenOverview from '@/components/issue-token/token-overview';
import Step2TokenDetails from '@/components/issue-token/step-2-token-details';
import Step3Documents from '@/components/issue-token/step-3-documents';
import Step4Network from '@/components/issue-token/step-4-network';
import Step5Review from '@/components/issue-token/step-5-review';
import { Button } from '@/components/ui/button';
import type { TokenDetails } from '@/lib/types';
import ExistingTokens from '@/components/issue-token/existing-tokens';
import { Separator } from '@/components/ui/separator';


export default function IssueTokenPage() {
  const [createdToken, setCreatedToken] = useState<TokenDetails | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<TokenFormValues>>({
    tokenName: 'Ingeniería Coin',
    tokenTicker: 'ING',
    destinationAddress: 'spark1pgssyd5f0685tu3v2hpqv2rx9cxu6vskyzjulwepzq79kd583gyw4z0gp92kjc',
    decimals: 6,
    maxSupply: 1_000_000_000000,
    isFreezable: true,
    network: 'spark',
  });
  const { toast } = useToast();
  const router = useRouter();

  const steps = [
    { id: 1, label: 'Token Information' },
    { id: 2, label: 'Token Details' },
    { id: 3, label: 'Documents' },
    { id: 4, label: 'Network' },
    { id: 5, label: 'Review' },
  ];

  const handleNext = (data: Partial<TokenFormValues>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit = (data: Partial<TokenFormValues>) => {
    const finalData = { ...formData, ...data } as TokenFormValues;
    console.log('Creating token with:', finalData);
    
    const newId = `btkn176av2...${Math.random().toString(36).substring(2, 10)}`;
    const newPublicKey = `03a0626e30...${Math.random().toString(36).substring(2, 10)}`;
    
    const newToken: TokenDetails = { 
      ...finalData, 
      id: newId, 
      publicKey: newPublicKey,
      status: 'pending',
    };
    
    setCreatedToken(newToken);
    
    // Save to localStorage
    const existingTokens = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    localStorage.setItem('createdTokens', JSON.stringify([...existingTokens, newToken]));

    toast({
      title: 'Request Submitted',
      description: `Your new token "${finalData.tokenName}" has been submitted for review.`,
      action: (
         <Button variant="outline" size="sm" onClick={() => router.push('/workspace')}>
            View in Workspace
        </Button>
      ),
    });
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex justify-center">
              <div className="w-full max-w-6xl">
                {!createdToken ? (
                  <>
                    <ExistingTokens />
                    <Separator className="my-8" />
                    <h1 className="text-3xl font-headline font-semibold mb-2">
                      Launchpad
                    </h1>
                    <p className="text-muted-foreground mb-8">
                      Create and issue a new token on the network.
                    </p>
                    <div className="mb-8 hidden sm:block">
                      <Stepper totalSteps={steps.length}>
                        {steps.map((step) => (
                          <StepperItem
                            key={step.id}
                            step={step.id}
                            isLastStep={step.id === steps.length}
                            isActive={currentStep === step.id}
                            isCompleted={currentStep > step.id}
                          >
                            {step.label}
                          </StepperItem>
                        ))}
                      </Stepper>
                    </div>
                     <div className="sm:hidden mb-8">
                      <p className="text-center text-sm text-muted-foreground">Step {currentStep} of {steps.length}: {steps[currentStep-1].label}</p>
                    </div>

                    <div className="flex justify-center pb-8">
                      <div className="w-full max-w-2xl">
                        {currentStep === 1 && (
                          <Step1TokenInfo
                            onNext={handleNext}
                            defaultValues={formData}
                          />
                        )}
                        {currentStep === 2 && (
                          <Step2TokenDetails
                            onBack={handleBack}
                            onNext={handleNext}
                            defaultValues={formData}
                          />
                        )}
                         {currentStep === 3 && (
                          <Step3Documents
                            onBack={handleBack}
                            onNext={handleNext}
                            defaultValues={formData}
                          />
                        )}
                         {currentStep === 4 && (
                          <Step4Network
                            onBack={handleBack}
                            onNext={handleNext}
                            defaultValues={formData}
                          />
                        )}
                         {currentStep === 5 && (
                          <Step5Review
                            onBack={handleBack}
                            onSubmit={handleFinalSubmit}
                            formData={formData as TokenFormValues}
                          />
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <TokenOverview token={createdToken} />
                )}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
