import { redirect } from 'next/navigation';

export default function OnboardingRootPage() {
  redirect('/signup/onboarding/verify');
}
