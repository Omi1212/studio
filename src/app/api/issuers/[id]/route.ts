import { NextResponse } from 'next/server';
import { issuersData } from '../data';
import { z } from 'zod';

const patchSchema = z.object({
  name: z.string().min(1, 'Issuer Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  walletAddress: z.string().min(1, 'Wallet address is required').optional(),
  status: z.enum(['active', 'inactive']).optional(),
});


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const issuer = issuersData.find((iss) => iss.id === params.id);
  if (issuer) {
    return NextResponse.json(issuer);
  }
  return new Response('Issuer not found', { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const issuerIndex = issuersData.findIndex((iss) => iss.id === params.id);
    if (issuerIndex === -1) {
      return new Response('Issuer not found', { status: 404 });
    }
    
    const body = await request.json();
    const validatedData = patchSchema.parse(body);
    issuersData[issuerIndex] = { ...issuersData[issuerIndex], ...validatedData };
    
    return NextResponse.json(issuersData[issuerIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
