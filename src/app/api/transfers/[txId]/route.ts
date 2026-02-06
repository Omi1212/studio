import { NextResponse } from 'next/server';
import { transfersData } from '../data';

export async function GET(
  request: Request,
  { params }: { params: { txId: string } }
) {
  const transfer = transfersData.find((t) => t.txId === params.txId);
  if (transfer) {
    return NextResponse.json(transfer);
  }
  return new Response('Transfer not found', { status: 404 });
}
