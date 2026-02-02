
'use client';

import { useEffect, useState, use } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { exampleTokens, issuersData } from '@/lib/data';
import type { TokenDetails, Issuer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, FileText, HardDrive, Hash, Image as ImageIcon, Info, Network, ToggleRight, User, X, Download, Eye, Tag, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Stepper, StepperItem } from '@/components/ui/stepper';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type CombinedRequest = TokenDetails & { issuer?: Issuer };

function ReviewSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">{title}</h3>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    )
}

function ReviewRow({ icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) {
    const Icon = icon;
    return (
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
            <div className="text-sm font-medium break-words text-right max-w-[60%] sm:max-w-[70%]">
                {value}
            </div>
        </div>
    )
}

function FilePreview({ file, fileName }: { file: any, fileName: string }) {
    if (!file) return <span className="text-muted-foreground">Not provided</span>;
    
    // Create a blob URL for preview/download if it's a file object
    const fileUrl = (file instanceof File || (typeof file === 'object' && 'name' in file)) 
        ? URL.createObjectURL(file as File) 
        : '#';

    return (
        <div className="flex items-center gap-2 text-sm justify-end">
            <span className="truncate max-w-40" title={fileName}>{fileName}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4" /></a>
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <a href={fileUrl} download={fileName}><Download className="h-4 w-4" /></a>
            </Button>
        </div>
    )
}

const steps = [
    { id: 1, label: 'Token Info' },
    { id: 2, label: 'Token Details' },
    { id: 3, label: 'Documents' },
    { id: 4, label: 'Issuer & Action' },
];

function RequestDetailsPage({ params }: { params: { id: string } }) {
  const [request, setRequest] = useState<CombinedRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
  };

  useEffect(() => {
    const { id } = params;
    const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    const allTokens: TokenDetails[] = [...exampleTokens, ...storedTokens];
    let foundToken = allTokens.find(t => t.id === id);
    
    if (foundToken) {
      const issuer = issuersData.find(i => i.id === foundToken.issuerId);
      
      // Add fake documents if they don't exist for review purposes
      if (!foundToken.whitepaper) {
        const fakeFile = new File(["fake content"], `${foundToken.tokenTicker}_Whitepaper.pdf`, { type: "application/pdf" });
        foundToken.whitepaper = [fakeFile] as any;
      }
      if (!foundToken.legalTokenizationDoc) {
        const fakeFile = new File(["fake content"], `Legal_Tokenization.pdf`, { type: "application/pdf" });
        foundToken.legalTokenizationDoc = [fakeFile] as any;
      }
      if (!foundToken.tokenIssuanceLegalDoc) {
        const fakeFile = new File(["fake content"], `Token_Issuance_Agreement.pdf`, { type: "application/pdf" });
        foundToken.tokenIssuanceLegalDoc = [fakeFile] as any;
      }

      setRequest({ ...foundToken, issuer });

      const tokenIcon = foundToken.tokenIcon;

      if (tokenIcon) {
        if (typeof tokenIcon === 'string') {
          setIconPreview(tokenIcon);
        } else if (tokenIcon instanceof File || (typeof tokenIcon === 'object' && 'name' in tokenIcon)) {
           const reader = new FileReader();
           reader.onloadend = () => {
             setIconPreview(reader.result as string);
           }
           reader.readAsDataURL(tokenIcon as File);
        }
      } else {
         // Fake icon
        setIconPreview(`https://i.wpfc.ml/35/8gtsxa.png`);
      }
    }
    
    setLoading(false);
  }, [params]);

  const updateRequestStatus = (id: string, status: 'active' | 'rejected') => {
    if (!request) return;

    const allTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    const updatedTokens = allTokens.map((token: TokenDetails) => 
        token.id === id ? { ...token, status } : token
    );
    localStorage.setItem('createdTokens', JSON.stringify(updatedTokens));

    setRequest(prev => prev ? { ...prev, status } : null);

    toast({
        title: `Request ${status === 'active' ? 'Approved' : 'Rejected'}`,
        description: `The token "${request.tokenName}" has been ${status === 'active' ? 'approved' : 'rejected'}.`
    });
    router.push('/requests');
  };

  const handleSaveObservation = () => {
    const observationText = (document.getElementById('observation') as HTMLTextAreaElement)?.value;
    if (!observationText?.trim()) {
        toast({
            variant: "destructive",
            title: "Observation is empty",
            description: "Please write an observation before saving.",
        });
        return;
    }
    // In a real app, you would save this observation to your backend.
    toast({
        title: "Observation Saved",
        description: `Your observation for "${request?.tokenName}" has been noted.`,
    });
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));


  if (loading) {
    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <p>Loading request details...</p>
        </div>
    );
  }

  if (!request) {
    notFound();
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/requests"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Token Request Review
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
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

              {currentStep === 1 && (
                <ReviewSection title="Token Information">
                    <ReviewRow icon={Info} label="Token Name" value={request.tokenName} />
                    <ReviewRow icon={Tag} label="Token Ticker" value={request.tokenTicker} />
                    <ReviewRow icon={ImageIcon} label="Token Icon" value={
                      iconPreview ? (
                          <Avatar className="h-6 w-6">
                              <AvatarImage src={iconPreview} alt="Token Icon Preview" />
                              <AvatarFallback>{request.tokenTicker.charAt(0)}</AvatarFallback>
                          </Avatar>
                      ) : <span className="text-muted-foreground">Not provided</span>
                    } />
                    <ReviewRow icon={HardDrive} label="Destination Address" value={<span className="font-mono">{request.destinationAddress}</span>} />
                </ReviewSection>
              )}

              {currentStep === 2 && (
                <ReviewSection title="Token Details">
                    <ReviewRow icon={Hash} label="Decimals" value={request.decimals} />
                    <ReviewRow icon={Hash} label="Max Supply" value={request.maxSupply.toLocaleString()} />
                    <ReviewRow icon={ToggleRight} label="Is Freezable" value={request.isFreezable ? 'Yes' : 'No'} />
                     <ReviewRow icon={Network} label="Network" value={networkMap[request.network] || request.network} />
                </ReviewSection>
              )}

              {currentStep === 3 && (
                <ReviewSection title="Documents">
                    <ReviewRow icon={FileText} label="Whitepaper" value={<FilePreview file={request.whitepaper} fileName={`${request.tokenTicker}_Whitepaper.pdf`} />} />
                    <ReviewRow icon={FileText} label="Legal Tokenization Doc" value={<FilePreview file={request.legalTokenizationDoc} fileName="Legal_Tokenization.pdf" />} />
                    <ReviewRow icon={FileText} label="Token Issuance Legal Doc" value={<FilePreview file={request.tokenIssuanceLegalDoc} fileName="Token_Issuance_Agreement.pdf" />} />
                </ReviewSection>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  {request.issuer && (
                    <ReviewSection title="Issuer Information">
                        <ReviewRow icon={User} label="Issuer Name" value={request.issuer.name} />
                        <ReviewRow icon={Info} label="Issuer Email" value={request.issuer.email} />
                        <ReviewRow icon={HardDrive} label="Issuer Wallet" value={<span className="font-mono">{request.issuer.walletAddress}</span>} />
                    </ReviewSection>
                  )}

                  {request.status === 'pending' && (
                    <Card>
                      <CardHeader>
                          <CardTitle>Actions</CardTitle>
                          <CardDescription>Approve or reject this token issuance request. You can add an optional observation.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                           <div className="space-y-2">
                              <Label htmlFor="observation">Observation</Label>
                              <Textarea id="observation" placeholder="Add an observation for the issuer..." />
                          </div>
                          <Button variant="secondary" className="w-full" onClick={handleSaveObservation}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Leave Observation
                          </Button>
                          <div className="flex flex-col sm:flex-row gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" className="w-full">
                                    <X className="mr-2 h-4 w-4" /> Reject Request
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will reject the token request for "{request.tokenName}". This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => updateRequestStatus(request.id, 'rejected')}>Confirm Reject</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <Button className="w-full" onClick={() => updateRequestStatus(request.id, 'active')}>
                                  <Check className="mr-2 h-4 w-4" /> Approve Request
                              </Button>
                          </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

                <CardFooter className="justify-between px-0">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                    Back
                    </Button>
                    <Button onClick={handleNext} disabled={currentStep === steps.length}>
                    Next
                    </Button>
                </CardFooter>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function RequestDetailsUsePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <RequestDetailsPage params={resolvedParams} />;
}
