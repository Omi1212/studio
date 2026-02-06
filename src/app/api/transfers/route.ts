import { NextResponse } from 'next/server';
import { transfersData } from './data';

export async function GET() {
  return NextResponse.json(transfersData);
}
