
import type { Metadata } from 'next';
import LoginForm from '@/components/login/login-form';

export const metadata: Metadata = {
  title: 'Login - BlockStratus',
  description: 'Login to your BlockStratus account.',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <LoginForm />
    </div>
  );
}
