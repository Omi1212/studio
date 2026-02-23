import { NextResponse } from 'next/server';
import { ordersData } from './data';
import type { Order } from '@/lib/types';
import { z } from 'zod';
import { exampleAssets } from '../assets/data';

const orderPostSchema = z.object({
    investorId: z.string(),
    investorName: z.string(),
    assetId: z.string(),
    assetTicker: z.string(),
    type: z.enum(['Buy', 'Sell']),
    amount: z.number().positive(),
    price: z.number(),
    date: z.string(),
    status: z.enum(['pending', 'completed', 'rejected', 'waiting payment'])
});

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(1000).default(10),
    status: z.enum(['pending', 'completed', 'rejected', 'waiting payment', 'all']).optional(),
    query: z.string().optional(),
    assetId: z.string().optional(),
    investorId: z.string().optional(),
    network: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
  }

  const { page, perPage, status, query, assetId, investorId, network } = validation.data;

  const augmentedOrders = ordersData.map(order => {
      const asset = exampleAssets.find(a => a.id === order.assetId);
      const assetNetworks = asset ? (Array.isArray(asset.network) ? asset.network : [asset.network]) : [];
      return {
          ...order,
          networks: assetNetworks
      };
  });

  let filteredOrders = augmentedOrders;

  if (network && network !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.networks.includes(network));
  }

  if (assetId) {
    filteredOrders = filteredOrders.filter(order => order.assetId === assetId);
  }

  if (investorId) {
    filteredOrders = filteredOrders.filter(order => order.investorId === investorId);
  }
  
  if (status && status !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }

  if (query) {
    const lowercasedQuery = query.toLowerCase();
    filteredOrders = filteredOrders.filter(order =>
      order.investorName.toLowerCase().includes(lowercasedQuery) ||
      order.assetTicker.toLowerCase().includes(lowercasedQuery) ||
      order.id.toLowerCase().includes(lowercasedQuery)
    );
  }

  const total = filteredOrders.length;
  const startIndex = (page - 1) * perPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    data: paginatedOrders,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrderData = orderPostSchema.parse(body);

    const orderWithId: Order = {
      ...newOrderData,
      id: `order-${Math.random().toString(36).substring(2, 9)}`,
    };
    ordersData.unshift(orderWithId); // Add to the beginning of the array
    return NextResponse.json(orderWithId, { status: 201 });
  } catch (error) {
      if (error instanceof z.ZodError) {
          return NextResponse.json({ errors: error.errors }, { status: 400 });
      }
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
