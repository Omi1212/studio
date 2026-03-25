
import { NextResponse } from 'next/server';
import { investorsData } from '../data';
import type { User } from '@/lib/types';
import { z } from 'zod';
import { usersData } from '../../users/data';

const patchSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  kycStatus: z.enum(['verified', 'pending', 'rejected']).optional(),
  walletAddress: z.string().min(1, "Wallet address is required").optional(),
  isFrozen: z.boolean().optional(),
  holdings: z.array(z.any()).optional(),
});


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const investor = (investorsData as User[]).find((inv) => inv.id === params.id);
  if (investor) {
    return NextResponse.json(investor);
  }
  return new Response('Investor not found', { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const investorIndex = (investorsData as User[]).findIndex((inv) => inv.id === params.id);
    if (investorIndex === -1) {
      return new Response('Investor not found', { status: 404 });
    }
    
    const body = await request.json();
    const validatedData = patchSchema.parse(body);

    investorsData[investorIndex] = { ...investorsData[investorIndex], ...validatedData };

    // Also update usersData to keep it consistent
    const userIndex = usersData.findIndex((u) => u.id === params.id);
    if (userIndex !== -1) {
      usersData[userIndex] = { ...usersData[userIndex], ...validatedData };
    }
    
    return NextResponse.json(investorsData[investorIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const investorIndex = (investorsData as User[]).findIndex((inv) => inv.id === params.id);
  if (investorIndex === -1) {
    return new Response('Investor not found', { status: 404 });
  }
  
  (investorsData as User[]).splice(investorIndex, 1);

  // Also delete from usersData
  const userIndex = usersData.findIndex((u) => u.id === params.id);
  if (userIndex !== -1) {
    usersData.splice(userIndex, 1);
  }

  return new Response(null, { status: 204 });
}
