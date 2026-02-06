import { NextResponse } from 'next/server';
import { exampleTokens } from './data';

export async function GET() {
  return NextResponse.json(exampleTokens);
}
