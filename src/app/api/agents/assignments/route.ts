import { NextResponse } from 'next/server';
import { agentTokenAssignments } from './data';

export async function GET() {
  return NextResponse.json(agentTokenAssignments);
}
