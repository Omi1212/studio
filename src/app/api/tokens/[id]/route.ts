import { NextResponse } from 'next/server';
import { exampleTokens } from '../data';
import type { TokenDetails } from '@/lib/types';


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
  const tokenIndex = (exampleTokens as TokenDetails[]).findIndex((t) => t.id === params.id);
  if (tokenIndex === -1) {
    return new Response('Token not found', { status: 404 });
  }

  const body = await request.json();
  const currentToken = exampleTokens[tokenIndex];
  const updatedToken = { ...currentToken, ...body };
  (exampleTokens as any[])[tokenIndex] = updatedToken;

  return NextResponse.json(updatedToken);
}
