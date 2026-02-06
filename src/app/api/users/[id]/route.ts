import { NextResponse } from 'next/server';
import type { User } from '@/lib/types';

const usersData: User[] = [
    {
        id: 'user-001',
        name: 'John Doe',
        email: 'agent@gmail.com',
        role: 'agent',
        walletAddress: 'spark1q...user01',
        kycStatus: 'verified',
        kybStatus: 'verified',
        status: 'active',
        phone: '+1 555-0101',
        kycLevel: 3,
        kybLevel: 1,
    },
    {
        id: 'user-002',
        name: 'Jane Smith',
        email: 'issuer@gmail.com',
        role: 'issuer',
        walletAddress: 'spark1q...user02',
        kycStatus: 'pending',
        kybStatus: 'pending',
        status: 'active',
        phone: '+1 555-0102',
        kycLevel: 1,
        kybLevel: 0,
    },
    {
        id: 'user-003',
        name: 'Peter Jones',
        email: 'investor@gmail.com',
        role: 'investor',
        walletAddress: 'spark1q...user03',
        kycStatus: 'verified',
        status: 'active',
        phone: '+1 555-0103',
        kycLevel: 2,
        country: 'El Salvador',
        legalName: 'Peter Bartholomew Jones',
        dob: '2001-09-12',
        idDoc: 'ID Card, 06**********38',
        address: 'San Salvador Centro, El Salvador',
    },
    {
        id: 'user-004',
        name: 'Mary Poppins',
        email: 'mary.poppins@example.com',
        role: 'agent',
        walletAddress: 'spark1q...user04',
        kycStatus: 'rejected',
        kybStatus: 'pending',
        status: 'active',
        phone: '+1 555-0104',
        kycLevel: 0,
        kybLevel: 0,
    },
     {
        id: 'user-005',
        name: 'Super Admin',
        email: 'superadmin@gmail.com',
        role: 'superadmin',
        walletAddress: 'spark1q...superadmin',
        kycStatus: 'verified',
        kybStatus: 'verified',
        status: 'active',
        phone: '+1 555-0105',
        kycLevel: 4,
        kybLevel: 4,
    }
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = usersData.find((u) => u.id === params.id);
  if (user) {
    return NextResponse.json(user);
  }
  return new Response('User not found', { status: 404 });
}
