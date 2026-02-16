import type { User } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __usersData__: User[] | undefined;
}

const initialData: User[] = [
    {
        id: 'user-001',
        name: 'John Doe',
        email: 'agent@gmail.com',
        role: 'agent',
        walletAddress: 'spark1q...user01',
        kycStatus: 'verified',
        kybStatus: 'verified',
        kytStatus: 'verified',
        status: 'active',
        phone: '+1 555-0101',
        kycLevel: 3,
        kybLevel: 2,
        businessName: 'Global Agents Co.',
        legalName: 'Global Agents Company LLC',
        businessRegistrationId: 'GA-12345',
        industry: 'Consulting',
        address: '123 Agent Avenue, Suite 100, Financial District',
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
        kybLevel: 1,
        businessName: 'Emisores de Activos Digitales',
        legalName: 'Emisores de Activos Digitales, S.A. de C.V.',
        businessRegistrationId: 'NRC: 12345-6',
        industry: 'FinTech',
        address: 'Colonia San Benito, San Salvador, El Salvador'
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
        businessName: 'Poppins & Co. Associates',
        legalName: 'Poppins & Co. Associates Ltd.',
        businessRegistrationId: 'PC-98765',
        industry: 'Financial Services',
        address: '17 Cherry Tree Lane, London'
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
        businessName: 'BlockStratus Platform',
        legalName: 'BlockStratus Inc.',
        businessRegistrationId: 'BS-ADMIN-001',
        industry: 'Technology',
        address: '1 Infinite Loop, Cupertino, CA'
    }
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__usersData__) {
  global.__usersData__ = [...initialData];
}

export let usersData: User[] = global.__usersData__ || initialData;
