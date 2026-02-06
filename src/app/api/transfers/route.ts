import { NextResponse } from 'next/server';
import { transfersData } from './data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const type = searchParams.get('type');
  const query = searchParams.get('query');
  const tokenTicker = searchParams.get('tokenTicker');

  let filteredTransfers = transfersData;

  if (tokenTicker) {
      filteredTransfers = filteredTransfers.filter(t => t.tokenTicker === tokenTicker);
  }

  if (type && type !== 'all') {
    filteredTransfers = filteredTransfers.filter(t => t.type === type);
  }

  if (query) {
    const lowercasedQuery = query.toLowerCase();
    filteredTransfers = filteredTransfers.filter(t =>
      t.from.toLowerCase().includes(lowercasedQuery) ||
      t.to.toLowerCase().includes(lowercasedQuery)
    );
  }

  const total = filteredTransfers.length;
  const startIndex = (page - 1) * limit;
  const paginatedTransfers = filteredTransfers.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    transfers: paginatedTransfers,
    total,
  });
}
