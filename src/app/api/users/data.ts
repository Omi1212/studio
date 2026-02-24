
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
        kytStatus: 'verified',
        status: 'active',
        phone: '+1 555-0101',
        kycLevel: 3,
        legalName: 'Johnathan Doe',
        address: '456 Oak Avenue, Financial District',
        companyId: ['global-agents-co'],
    },
    {
        id: 'user-002',
        name: 'Jane Smith',
        email: 'issuer@gmail.com',
        role: 'issuer',
        walletAddress: 'spark1q...user02',
        kycStatus: 'pending',
        status: 'active',
        phone: '+1 555-0102',
        kycLevel: 1,
        legalName: 'Jane Elizabeth Smith',
        dob: '1985-11-05',
        idDoc: 'DUI: 01234567-8',
        address: 'Residencial Las Flores, #123, San Salvador',
        country: 'SV',
        city: 'San Salvador',
        companyId: ['bstratus-securities', 'emisores-de-activos-digitales'],
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
        country: 'SV',
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
        status: 'active',
        phone: '+1 555-0104',
        kycLevel: 0,
        legalName: 'Mary P. Poppins',
        address: '17 Cherry Tree Lane, London',
        companyId: ['poppins-co-associates'],
    },
     {
        id: 'user-005',
        name: 'Super Admin',
        email: 'superadmin@gmail.com',
        role: 'superadmin',
        walletAddress: 'spark1q...superadmin',
        kycStatus: 'verified',
        status: 'active',
        phone: '+1 555-0105',
        kycLevel: 4,
        legalName: 'S. Admin',
        address: '2 Infinite Loop, Cupertino, CA',
        companyId: ['blockstratus-platform'],
    }
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__usersData__) {
  global.__usersData__ = [...initialData];
}

export let usersData: User[] = global.__usersData__ || initialData;
