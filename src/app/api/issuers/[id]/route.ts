import { NextResponse } from 'next/server';
import { issuersData } from '../data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const issuer = issuersData.find((iss) => iss.id === params.id);
  if (issuer) {
    return NextResponse.json(issuer);
  }
  return new Response('Issuer not found', { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const issuerIndex = issuersData.findIndex((iss) => iss.id === params.id);
  if (issuerIndex === -1) {
    return new Response('Issuer not found', { status: 404 });
  }
  
  const body = await request.json();
  issuersData[issuerIndex] = { ...issuersData[issuerIndex], ...body };
  
  return NextResponse.json(issuersData[issuerIndex]);
}
