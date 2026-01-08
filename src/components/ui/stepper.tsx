
'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  children: React.ReactNode;
  totalSteps: number;
}

export function Stepper({ children, totalSteps }: StepperProps) {
  return (
    <div className="flex items-start justify-between w-full">
      {React.Children.map(children, (child, index) => (
        <>
          {child}
          {index < totalSteps - 1 && (
            <div className={cn(
               "flex-1 h-px mt-4",
               (child as React.ReactElement<StepperItemProps>).props.isCompleted ? 'bg-primary' : 'bg-border'
            )}></div>
          )}
        </>
      ))}
    </div>
  );
}

interface StepperItemProps {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  isLastStep: boolean;
  children: React.ReactNode;
}

export function StepperItem({ step, isActive, isCompleted, children }: StepperItemProps) {
  return (
    <div className="flex flex-col items-center flex-shrink-0" style={{width: '120px'}}>
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
  );
}
