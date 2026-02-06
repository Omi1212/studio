import { NextResponse } from 'next/server';
import { investorsData } from './data';

export async function GET() {
  return NextResponse.json(investorsData);
}
