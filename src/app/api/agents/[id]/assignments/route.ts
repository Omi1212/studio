'use client';

import { NextResponse } from 'next/server';
import { agentTokenAssignments } from '../assignments/data';
import { z } from 'zod';

const putSchema = z.object({
  tokenIds: z.array(z.string()),
});


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const assignments = agentTokenAssignments[params.id] || [];
  return NextResponse.json(assignments);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { tokenIds } = putSchema.parse(body);
    
    agentTokenAssignments[params.id] = tokenIds;
    return NextResponse.json(agentTokenAssignments[params.id]);

  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
