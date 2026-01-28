import type { Metadata } from 'next';
import SignupForm from '@/components/signup/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up - BlockStratus',
  description: 'Create your BlockStratus account.',
};

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <SignupForm />
    </div>
  );
}
