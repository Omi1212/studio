'use client';

import { NextResponse } from 'next/server';
import { agentTokenAssignments } from '../assignments/data';

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
  const { tokenIds } = await request.json();
  if (!Array.isArray(tokenIds)) {
    return new Response('Invalid payload, tokenIds must be an array.', { status: 400 });
  }
  agentTokenAssignments[params.id] = tokenIds;
  return NextResponse.json(agentTokenAssignments[params.id]);
}
