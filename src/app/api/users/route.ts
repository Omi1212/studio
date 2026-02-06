import { NextResponse } from 'next/server';
import { usersData } from './data';

export async function GET() {
  return NextResponse.json(usersData);
}
