
import { NextResponse } from 'next/server';
import { exampleAssets } from '../data';
import type { AssetDetails } from '@/lib/types';
import { z } from 'zod';

const patchSchema = z.object({
  status: z.enum(['pending', 'active', 'frozen', 'draft']).optional(),
  assetName: z.string().min(1).optional(),
  assetTicker: z.string().min(1).max(5).optional(),
  destinationAddress: z.string().min(1).optional(),
  decimals: z.number().int().min(0).max(18).optional(),
  maxSupply: z.number().positive().optional(),
  isFreezable: z.boolean().optional(),
  network: z.array(z.string()).min(1).optional(),
  issuerId: z.string().optional()
}).partial();


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const asset = exampleAssets.find((t) => t.id === params.id);
  if (asset) {
    return NextResponse.json(asset);
  }
  return new Response('Asset not found', { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assetIndex = (exampleAssets as AssetDetails[]).findIndex((t) => t.id === params.id);
    if (assetIndex === -1) {
      return new Response('Asset not found', { status: 404 });
    }

    const body = await request.json();
    const validatedData = patchSchema.parse(body);
    const currentAsset = exampleAssets[assetIndex];
    const updatedAsset = { ...currentAsset, ...validatedData };
    (exampleAssets as any[])[assetIndex] = updatedAsset;

    return NextResponse.json(updatedAsset);
  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
