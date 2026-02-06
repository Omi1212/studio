
import { NextResponse } from 'next/server';
import { investorsData } from '../data';
import type { User } from '@/lib/types';


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
  const investorIndex = (investorsData as User[]).findIndex((inv) => inv.id === params.id);
  if (investorIndex === -1) {
    return new Response('Investor not found', { status: 404 });
  }
  
  const body = await request.json();
  investorsData[investorIndex] = { ...investorsData[investorIndex], ...body };
  
  return NextResponse.json(investorsData[investorIndex]);
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
  return new Response(null, { status: 204 });
}
