
'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  children: React.ReactNode;
}

export function Stepper({ children }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {children}
    </div>
  );
}

interface StepperItemProps {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  children: React.ReactNode;
}

export function StepperItem({ step, isActive, isCompleted, children }: StepperItemProps) {
  return (
    <>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full border-2',
            isActive || isCompleted ? 'border-primary' : 'border-muted-foreground',
            isCompleted && 'bg-primary text-primary-foreground'
          )}
        >
          {isCompleted ? <Check className="w-5 h-5" /> : <span className={cn(isActive ? "text-primary" : "text-muted-foreground")}>{step}</span>}
        </div>
        <p className={cn(
          "text-sm mt-2 text-center",
           isActive || isCompleted ? 'font-semibold text-foreground' : 'text-muted-foreground'
        )}>
          {children}
        </p>
      </div>
      {step < 3 && (
         <div className={cn(
             "flex-1 h-px",
             isCompleted ? 'bg-primary' : 'bg-border'
         )}></div>
      )}
    </>
  );
}
