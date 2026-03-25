import { NextResponse } from 'next/server';
import { agentAssetAssignments } from '../../assignments/data';
import { z } from 'zod';

const putSchema = z.object({
  assetIds: z.array(z.string()),
});


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const assignments = agentAssetAssignments[params.id] || [];
  return NextResponse.json(assignments);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { assetIds } = putSchema.parse(body);
    
    agentAssetAssignments[params.id] = assetIds;
    return NextResponse.json(agentAssetAssignments[params.id]);

  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
