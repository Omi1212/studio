import { NextResponse } from 'next/server';
import { investorsData } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const investor = investorsData.find((inv) => inv.id === params.id);
  if (investor) {
    return NextResponse.json(investor);
  }
  return new Response('Investor not found', { status: 404 });
}
