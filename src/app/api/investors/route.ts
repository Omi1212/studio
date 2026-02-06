import { NextResponse } from 'next/server';
import { investorsData } from './data';
import type { User } from '@/lib/types';

export async function GET() {
  return NextResponse.json(investorsData);
}

export async function POST(request: Request) {
  const newInvestorData = await request.json();
  const newUser: User = {
    ...newInvestorData,
    id: `inv-${Math.random().toString(36).substring(2, 9)}`,
  };
  investorsData.unshift(newUser);
  return NextResponse.json(newUser, { status: 201 });
}
