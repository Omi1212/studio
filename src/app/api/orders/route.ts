import { NextResponse } from 'next/server';
import { ordersData } from './data';

export async function GET() {
  return NextResponse.json(ordersData);
}
