import { NextResponse } from 'next/server';

const companiesData = [
  { id: 'bstratus-securities', name: 'Bstratus Securities' },
  { id: 'neobank-sa-de-cv', name: 'NeoBank SA de CV' },
  { id: 'tradfi-bank-sa', name: 'TradFi Bank SA' },
];

export async function GET() {
  return NextResponse.json(companiesData);
}
