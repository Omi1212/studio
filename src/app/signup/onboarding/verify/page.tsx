
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Link from 'next/link';

function VerificationSection({
    target,
    onResend,
    resendCooldown,
}: {
    target: string;
    onResend: () => void;
    resendCooldown: number;
}) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
                Enter the 6 digit verification code we sent to {target}
            </p>
            <InputOTP maxLength={6}>
                <InputOTPGroup className="mx-auto">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <div className="text-right text-sm">
                {resendCooldown > 0 ? (
                    <p className="text-muted-foreground">Please wait {resendCooldown} seconds to resend</p>
                ) : (
                    <Button variant="link" className="p-0 h-auto" onClick={onResend}>
                        Resend Code
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function VerifyAccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const [emailCooldown, setEmailCooldown] = useState(30);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/signup');
        }
        setLoading(false);
    }, [router]);
    
    useEffect(() => {
        if(emailCooldown > 0) {
            const timer = setTimeout(() => setEmailCooldown(emailCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [emailCooldown]);
    
    const handleResendEmail = () => {
        setEmailCooldown(30);
        toast({ title: "Code Resent", description: "A new verification code has been sent to your email." });
    };

    const handleConfirm = async () => {
        setIsSubmitting(true);
        // In a real app, you would verify the codes here.
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        toast({
            title: "Account Verified!",
            description: "Please complete your profile.",
        });

        if (user?.role === 'issuer') {
            router.push('/signup/onboarding/business-info');
        } else {
            router.push('/signup/onboarding/details');
        }
        setIsSubmitting(false);
    };

    if (loading || !user) {
        return <div className="flex items-center justify-center min-h-screen bg-background p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-headline font-semibold">Verify Your Account</h1>
                    <p className="text-muted-foreground mt-2">
                        To finish setting up your account, please verify your email.
                    </p>
                </div>
                <Card>
                    <CardContent className="pt-6 space-y-8">
                        <VerificationSection 
                            target={user.email}
                            onResend={handleResendEmail}
                            resendCooldown={emailCooldown}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button onClick={handleConfirm} disabled={isSubmitting} className="w-full">
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : 'Confirm'}
                        </Button>
                        <Button variant="outline" onClick={() => router.back()} className="w-full">
                            Back
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
