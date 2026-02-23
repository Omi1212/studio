
import { NextResponse } from 'next/server';
import { exampleAssets } from './data';
import type { AssetDetails } from '@/lib/types';
import { z } from 'zod';

const assetPostSchema = z.object({
  assetName: z.string().min(1),
  assetTicker: z.string().min(1).max(5),
  destinationAddress: z.string().min(1),
  decimals: z.coerce.number().int().min(0).max(18),
  maxSupply: z.coerce.number().positive(),
  isFreezable: z.boolean(),
  network: z.array(z.string()).min(1),
  status: z.enum(['pending', 'active', 'frozen', 'draft']),
  issuerId: z.string().optional(),
  assetType: z.string().min(1),
  eligibleInvestors: z.array(z.string()).optional(),
  subscriptionTime: z.string().optional(),
  minInvestment: z.coerce.number().optional(),
  maxInvestment: z.coerce.number().optional(),
  subscriptionFees: z.coerce.number().optional(),
  redemptionTime: z.string().optional(),
  minRedemptionAmount: z.coerce.number().optional(),
  redemptionFees: z.coerce.number().optional(),
});

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(1000).default(10),
    status: z.enum(['pending', 'active', 'frozen', 'draft', 'all']).optional(),
    query: z.string().optional(),
    excludeStatus: z.string().optional(),
    issuerId: z.string().optional(),
});


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
  }

  const { page, perPage, status, query, excludeStatus, issuerId } = validation.data;

  let filteredAssets = exampleAssets;

  if (issuerId) {
    filteredAssets = filteredAssets.filter(asset => asset.issuerId === issuerId);
  }

  if (excludeStatus) {
    filteredAssets = filteredAssets.filter(asset => asset.status !== excludeStatus);
  }

  if (status && status !== 'all') {
    filteredAssets = filteredAssets.filter(asset => asset.status === status);
  }

  if (query) {
    const lowercasedQuery = query.toLowerCase();
    filteredAssets = filteredAssets.filter(asset =>
        (asset.assetName || '').toLowerCase().includes(lowercasedQuery) ||
        (asset.assetTicker || '').toLowerCase().includes(lowercasedQuery)
    );
  }
  
  const total = filteredAssets.length;
  const startIndex = (page - 1) * perPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    data: paginatedAssets,
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
        // We don't validate file-related fields here as they are not sent in the JSON body
        const newAssetData = assetPostSchema.parse(body);

        const newAsset: Omit<AssetDetails, 'assetIcon' | 'whitepaper' | 'legalAssetizationDoc' | 'assetIssuanceLegalDoc' | 'publicKey'> = {
            ...newAssetData,
            id: `btkn1...${Math.random().toString(36).substring(2, 10)}`, // Simulate new ID
        };
        (exampleAssets as any[]).unshift(newAsset);
        return NextResponse.json(newAsset, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
