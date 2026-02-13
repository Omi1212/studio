'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";

interface VerificationStepProps {
  level: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

function VerificationStep({ level, title, description, isCompleted, isCurrent }: VerificationStepProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className={`flex items-center justify-center h-8 w-8 rounded-full ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'border-2 border-primary text-primary' : 'bg-muted text-muted-foreground'}`}>
          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span>{level}</span>}
        </div>
        {level < 4 && <div className={`w-px h-8 mt-2 ${isCompleted ? 'bg-green-500' : 'bg-border'}`}></div>}
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function IdentityVerification({ kycLevel }: { kycLevel: number }) {
  const steps = [
    { level: 1, title: "User Level 1", description: "Email and phone number verified." },
    { level: 2, title: "User Level 2", description: "Basic personal information provided." },
    { level: 3, title: "User Level 3", description: "Official ID document submitted." },
    { level: 4, title: "User Level 4", description: "Proof of address verified." },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Identity Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {steps.map((step) => (
            <VerificationStep
              key={step.level}
              level={step.level}
              title={step.title}
              description={step.description}
              isCompleted={kycLevel >= step.level}
              isCurrent={kycLevel + 1 === step.level}
            />
          ))}
        </CardContent>
      </Card>
      {kycLevel < 4 && (
        <Card className="bg-card-foreground/5 dark:bg-card-foreground/10">
          <CardHeader>
            <CardTitle>Continue Your Verification</CardTitle>
            <CardDescription>
              To unlock all features of the platform, please complete your identity verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Verify Identity</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
