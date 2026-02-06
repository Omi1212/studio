import { NextResponse } from 'next/server';

const companiesData = [
  { id: 'bstratus-securities', name: 'Bstratus Securities' },
  { id: 'neobank-sa-de-cv', name: 'NeoBank SA de CV' },
  { id: 'tradfi-bank-sa', name: 'TradFi Bank SA' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  
  const total = companiesData.length;
  const startIndex = (page - 1) * perPage;
  const paginatedData = companiesData.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    data: paginatedData,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  });
}
