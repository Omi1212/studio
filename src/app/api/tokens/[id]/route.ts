import { NextResponse } from 'next/server';
import { exampleTokens } from '../data';


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
