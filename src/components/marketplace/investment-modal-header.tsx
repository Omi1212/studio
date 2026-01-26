'use client';

import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';

interface InvestmentModalHeaderProps {
  tokenName: string;
  step: number;
  onBack: () => void;
}

export default function InvestmentModalHeader({ tokenName, step, onBack }: InvestmentModalHeaderProps) {
  return (
    <DialogHeader className="text-center pb-4">
      {step === 2 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute left-4 top-4 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
      )}
      <DialogTitle>Invest in {tokenName}</DialogTitle>
    </DialogHeader>
  );
}
