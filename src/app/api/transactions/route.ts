import { NextResponse } from 'next/server';
import { z } from 'zod';

const transactionData = [
  {
    id: 1,
    type: 'Receive',
    address: 'spark1...6n7dvn',
    date: 'Jul 26, 2024, 03:45 PM',
    amount: 2500,
    currency: 'JMT',
    direction: 'in',
  },
  {
    id: 2,
    type: 'Receive',
    address: 'spark1...6n7dvn',
    date: 'Jul 26, 2024, 09:12 AM',
    amount: 10000,
    currency: 'OMI',
    direction: 'in',
  },
  {
    id: 3,
    type: 'Send',
    address: 'spark1...k4f9p',
    date: 'Jul 25, 2024, 06:20 PM',
    amount: 500,
    currency: 'JMT',
    direction: 'out',
  },
    {
    id: 4,
    type: 'Receive',
    address: 'spark1...6n7dvn',
    date: 'Jul 25, 2024, 11:30 AM',
    amount: 750,
    currency: 'ING',
    direction: 'in',
  },
    {
    id: 5,
    type: 'Send',
    address: 'spark1...j8g2q',
    date: 'Jul 24, 2024, 08:00 AM',
    amount: 1250,
    currency: 'SATS',
    direction: 'out',
  },
  {
    id: 6,
    type: 'Send',
    address: 'spark1...newtx1',
    date: 'Jul 23, 2024, 02:15 PM',
    amount: 300,
    currency: 'SATS',
    direction: 'out',
  },
  {
    id: 7,
    type: 'Receive',
    address: 'spark1...newrx1',
    date: 'Jul 23, 2024, 10:00 AM',
    amount: 5000,
    currency: 'JMT',
    direction: 'in',
  },
  {
    id: 8,
    type: 'Receive',
    address: 'spark1...newrx2',
    date: 'Jul 22, 2024, 05:50 PM',
    amount: 200,
    currency: 'OMI',
    direction: 'in',
  },
  {
    id: 9,
    type: 'Send',
    address: 'spark1...newtx2',
    date: 'Jul 22, 2024, 01:05 PM',
    amount: 1500,
    currency: 'ING',
    direction: 'out',
  },
  {
    id: 10,
    type: 'Receive',
    address: 'spark1...newrx3',
    date: 'Jul 21, 2024, 09:25 AM',
    amount: 800,
    currency: 'SATS',
    direction: 'in',
  },
  {
    id: 11,
    type: 'Send',
    address: 'spark1...newtx3',
    date: 'Jul 20, 2024, 11:00 AM',
    amount: 450,
    currency: 'JMT',
    direction: 'out',
  },
  {
    id: 12,
    type: 'Receive',
    address: 'spark1...newrx4',
    date: 'Jul 19, 2024, 07:45 PM',
    amount: 6000,
    currency: 'OMI',
    direction: 'in',
  },
];

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
    filter: z.enum(['in', 'out', 'all']).optional(),
    search: z.string().optional(),
});


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
  }

  const { page, perPage, filter, search } = validation.data;

  let filteredData = transactionData;

  if (filter && filter !== 'all') {
    filteredData = filteredData.filter(tx => tx.direction === filter);
  }

  if (search) {
    const lowercasedSearch = search.toLowerCase();
    filteredData = filteredData.filter(tx => tx.address.toLowerCase().includes(lowercasedSearch));
  }

  const total = filteredData.length;
  const startIndex = (page - 1) * perPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + perPage);

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
