
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import type { TokenDetails, Issuer } from '@/lib/types';
import Link from 'next/link';

export default function NewTokenPage() {
  const [createdToken, setCreatedToken] = useState<TokenDetails | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [issuers, setIssuers] = useState<Issuer[]>([]);
  const [formData, setFormData] = useState<Partial<TokenFormValues>>({
    tokenName: 'Ingeniería Coin',
    tokenTicker: 'ING',
    destinationAddress: 'spark1pgssyd5f0685tu3v2hpqv2rx9cxu6vskyzjulwepzq79kd583gyw4z0gp92kjc',
    decimals: 6,
    maxSupply: 1_000_000_000000,
    isFreezable: true,
    network: 'spark',
  });
  const [isDraft, setIsDraft] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepFormRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    fetch('/api/issuers').then(res => res.json()).then(setIssuers);

    const draftTokenId = searchParams.get('draft_id');
    if (draftTokenId) {
      // Drafts are a special case of local storage for session persistence of an unfinished form.
      const existingTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
      const draftToken = existingTokens.find(token => token.id === draftTokenId && token.status === 'draft');
      if (draftToken) {
        setFormData(draftToken);
        setCurrentStep(draftToken.savedStep || 1);
        setIsDraft(true);
        setDraftId(draftTokenId);
      }
    }
  }, [searchParams]);

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
  
  const handleSaveDraft = (currentFormData: Partial<TokenFormValues>) => {
    const finalData = { ...formData, ...currentFormData };
    const id = draftId || `btkn176av2...${Math.random().toString(36).substring(2, 10)}`;
    
    if (issuers.length < 2) {
        toast({ title: 'Error', description: 'Not enough issuer data to save draft.'});
        return;
    }

    const draftToken: TokenDetails = {
      ...finalData,
      id: id,
      publicKey: finalData.publicKey || '',
      status: 'draft',
      savedStep: currentStep,
      issuerId: issuers[1].id, // For demo purposes, assign to TokenForge
    } as TokenDetails;

    // Drafts are a special case of local storage for session persistence of an unfinished form.
    let existingTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    
    if(draftId) {
      existingTokens = existingTokens.map(token => token.id === draftId ? draftToken : token);
    } else {
      existingTokens.push(draftToken);
    }
    
    localStorage.setItem('createdTokens', JSON.stringify(existingTokens));

    toast({
      title: 'Draft Saved!',
      description: `Your token "${draftToken.tokenName}" has been saved as a draft.`,
    });
    router.push('/issue-token');
  };

  const handleFinalSubmit = (data: Partial<TokenFormValues>) => {
    const finalData = { ...formData, ...data } as TokenFormValues;
    
    if (issuers.length < 2) {
        toast({ title: 'Error', description: 'Not enough issuer data to submit.'});
        return;
    }

    const newId = draftId || `btkn176av2...${Math.random().toString(36).substring(2, 10)}`;
    const newPublicKey = `03a0626e30...${Math.random().toString(36).substring(2, 10)}`;
    
    const newToken: TokenDetails = { 
      ...finalData, 
      id: newId, 
      publicKey: newPublicKey,
      status: 'pending',
      issuerId: issuers[1].id, // For demo purposes, assign to TokenForge
    };
    
    setCreatedToken(newToken);
    
    // NOTE: This change is not persisted on the server.
    // In a real app, you would make a POST request to your API.
    // We add it to localStorage to simulate the creation for this session.
    let existingTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    if (draftId) {
      existingTokens = existingTokens.map(token => token.id === draftId ? newToken : token);
    } else {
      existingTokens.push(newToken);
    }
    localStorage.setItem('createdTokens', JSON.stringify(existingTokens));

    toast({
      title: 'Request Submitted (Not Persisted)',
      description: `Your new token "${finalData.tokenName}" has been submitted for this session.`,
      action: (
         <Button variant="outline" size="sm" onClick={() => router.push('/workspace')}>
            View in Workspace
        </Button>
      ),
    });
  };

  const onSaveDraftClick = () => {
    if (stepFormRef.current) {
        const currentForm = stepFormRef.current;
        const formElements = Array.from(currentForm.elements);
        const data: Partial<TokenFormValues> = {};
        formElements.forEach((el) => {
            const input = el as HTMLInputElement;
            if (input.name) {
                if (input.type === 'checkbox') {
                    // @ts-ignore
                    data[input.name] = input.checked;
                } else if(input.type === 'file') {
                    // @ts-ignore
                    if (input.files && input.files.length > 0) {
                        // @ts-ignore
                        data[input.name] = input.files[0];
                    }
                }
                else {
                    // @ts-ignore
                    data[input.name] = input.value;
                }
            }
        });
        handleSaveDraft(data);
    }
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
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-headline font-semibold">
                          {isDraft ? 'Edit Draft' : 'Create a New Token'}
                        </h1>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={onSaveDraftClick}>Save as Draft</Button>
                            <Button variant="outline" asChild>
                                <Link href="/issue-token">Cancel</Link>
                            </Button>
                        </div>
                    </div>

                    <p className="text-muted-foreground mb-8">
                      {isDraft ? 'Continue editing your token draft.' : 'Create and issue a new token on the network.'}
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
                            formRef={stepFormRef}
                            onNext={handleNext}
                            defaultValues={formData}
                          />
                        )}
                        {currentStep === 2 && (
                          <Step2TokenDetails
                            formRef={stepFormRef}
                            onBack={handleBack}
                            onNext={handleNext}
                            defaultValues={formData}
                          />
                        )}
                         {currentStep === 3 && (
                          <Step3Documents
                            formRef={stepFormRef}
                            onBack={handleBack}
                            onNext={handleNext}
                            defaultValues={formData}
                          />
                        )}
                         {currentStep === 4 && (
                          <Step4Network
                            formRef={stepFormRef}
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
                            onSaveDraft={() => handleSaveDraft(formData)}
                          />
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-headline font-semibold">
                          Token Request Submitted
                        </h1>
                    </div>
                    <TokenOverview token={createdToken} />
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
