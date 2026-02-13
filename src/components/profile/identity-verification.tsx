'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

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
          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span className={isCurrent ? 'font-bold':''}>{level}</span>}
        </div>
        {level < 4 && <div className={`w-px h-12 mt-2 ${isCompleted ? 'bg-green-500' : 'bg-border'}`}></div>}
      </div>
      <div className="pt-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}


function VerificationCallToAction({ kycLevel }: { kycLevel: number }) {
  const levelsInfo = [
    // kycLevel 0
    { 
      title: "Continue to User Level 1", 
      description: "To get started, please verify your email and phone number.", 
      requirements: [], 
      buttonText: "Start Verification" 
    },
    // kycLevel 1
    { 
      title: "Continue to User Level 2", 
      description: "Provide your basic personal information to increase your account limits.", 
      requirements: ["Full Name", "Date of Birth", "Country of Residence"], 
      buttonText: "Start User Level 2" 
    },
    // kycLevel 2
    { 
      title: "Continue to User Level 3", 
      description: "To unlock higher limits and more features, please complete the next verification step.\n\nYou will need to provide:", 
      requirements: ["Passport or National ID", "Liveness Check"], 
      buttonText: "Start User Level 3" 
    },
    // kycLevel 3
    { 
      title: "Continue to User Level 4", 
      description: "Submit a proof of address to complete your verification and unlock all platform features.", 
      requirements: ["Utility bill or Bank statement"], 
      buttonText: "Start User Level 4" 
    },
  ];

  if (kycLevel >= 4) {
    return (
      <div className="bg-card-foreground/5 dark:bg-card-foreground/10 rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
        <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
        <h4 className="font-semibold text-lg">Fully Verified</h4>
        <p className="text-sm text-muted-foreground mt-1">You have completed all verification steps.</p>
      </div>
    );
  }

  const nextStepInfo = levelsInfo[kycLevel];

  return (
    <div className="bg-card-foreground/5 dark:bg-card-foreground/10 rounded-lg p-6 h-full flex flex-col">
      <h4 className="font-semibold text-lg">{nextStepInfo.title}</h4>
      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line flex-1">{nextStepInfo.description}</p>
      {nextStepInfo.requirements.length > 0 && (
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 my-4">
          {nextStepInfo.requirements.map(req => <li key={req}>{req}</li>)}
        </ul>
      )}
      <Button className="w-full mt-auto">{nextStepInfo.buttonText}</Button>
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
    <Card>
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="pt-1">
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
          </div>
          <div>
            <VerificationCallToAction kycLevel={kycLevel} />
          </div>
      </CardContent>
    </Card>
  );
}
