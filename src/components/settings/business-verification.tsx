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
      </div>
      <div className="pt-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function VerificationCallToAction({ kybLevel }: { kybLevel: number }) {
  const levelsInfo = [
    // kybLevel 0
    { 
      title: "Continue to Basic Information", 
      description: "To get started, please provide your basic business information.", 
      requirements: ["Business Name", "Industry", "Country of Operation"], 
      buttonText: "Verify Business" 
    },
    // kybLevel 1
    { 
      title: "Continue to Business Documents", 
      description: "Provide your business registration documents to increase your limits.", 
      requirements: ["Certificate of Incorporation", "Tax Identification Number"], 
      buttonText: "Verify Business" 
    },
  ];

  if (kybLevel >= 2) {
    return (
      <div className="bg-card-foreground/5 dark:bg-card-foreground/10 rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
        <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
        <h4 className="font-semibold text-lg">Fully Verified</h4>
        <p className="text-sm text-muted-foreground mt-1">Your business has completed all verification steps.</p>
      </div>
    );
  }

  const nextStepInfo = levelsInfo[kybLevel];

  return (
    <div className="bg-card-foreground/5 dark:bg-card-foreground/10 rounded-lg p-6 h-full flex flex-col text-center">
      <h4 className="font-semibold text-lg">{nextStepInfo.title}</h4>
      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line flex-1">{nextStepInfo.description}</p>
      {nextStepInfo.requirements.length > 0 && (
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 my-4 max-w-max mx-auto text-left">
          {nextStepInfo.requirements.map(req => <li key={req}>{req}</li>)}
        </ul>
      )}
      <Button className="w-full mt-auto">{nextStepInfo.buttonText}</Button>
    </div>
  );
}


export default function BusinessVerification({ kybLevel }: { kybLevel: number }) {
  const steps = [
    { level: 1, title: "Basic Information", description: "Basic business information provided." },
    { level: 2, title: "Business Documents", description: "Business registration documents submitted." },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="pt-1 space-y-8">
        {steps.map((step) => (
            <VerificationStep
            key={step.level}
            level={step.level}
            title={step.title}
            description={step.description}
            isCompleted={kybLevel >= step.level}
            isCurrent={kybLevel + 1 === step.level}
            />
        ))}
        </div>
        <div>
        <VerificationCallToAction kybLevel={kybLevel} />
        </div>
    </div>
  );
}
