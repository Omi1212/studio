import { NextResponse } from 'next/server';
import { exampleTokens } from '../data';
import type { TokenDetails } from '@/lib/types';
import { z } from 'zod';

const patchSchema = z.object({
  status: z.enum(['pending', 'active', 'frozen', 'draft']).optional(),
  tokenName: z.string().min(1).optional(),
  tokenTicker: z.string().min(1).max(5).optional(),
  destinationAddress: z.string().min(1).optional(),
  decimals: z.number().int().min(0).max(18).optional(),
  maxSupply: z.number().positive().optional(),
  isFreezable: z.boolean().optional(),
  network: z.string().min(1).optional(),
  issuerId: z.string().optional()
}).partial();


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = exampleTokens.find((t) => t.id === params.id);
  if (token) {
    return NextResponse.json(token);
  }
  return new Response('Token not found', { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tokenIndex = (exampleTokens as TokenDetails[]).findIndex((t) => t.id === params.id);
    if (tokenIndex === -1) {
      return new Response('Token not found', { status: 404 });
    }

    const body = await request.json();
    const validatedData = patchSchema.parse(body);
    const currentToken = exampleTokens[tokenIndex];
    const updatedToken = { ...currentToken, ...validatedData };
    (exampleTokens as any[])[tokenIndex] = updatedToken;

    return NextResponse.json(updatedToken);
  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
