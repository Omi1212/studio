import { NextResponse } from 'next/server';
import { agentAssetAssignments } from './data';

export async function GET() {
  return NextResponse.json(agentAssetAssignments);
}
