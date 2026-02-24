
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
        companyId: ['bstratus-securities'],
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
    },
    // New Investors
    {
        id: 'inv-001',
        name: 'Investor One',
        email: 'investor1@gmail.com',
        role: 'investor',
        walletAddress: 'spark1q...inv001',
        kycStatus: 'verified',
        status: 'active',
        phone: '+1 555-0111',
        kycLevel: 4,
        country: 'US',
        city: 'New York',
        legalName: 'Investor One Legal',
        dob: '1990-01-01',
        idDoc: 'Passport, ***1111',
        address: '111 Investor St, New York, NY',
        totalInvested: 0,
        isFrozen: false,
        holdings: [],
        transactions: []
    },
    {
        id: 'inv-002',
        name: 'Investor Two',
        email: 'investor2@gmail.com',
        role: 'investor',
        walletAddress: 'spark1q...inv002',
        kycStatus: 'verified',
        status: 'active',
        phone: '+44 20-7946-0112',
        kycLevel: 4,
        country: 'GB',
        city: 'London',
        legalName: 'Investor Two Legal',
        dob: '1985-02-02',
        idDoc: 'Passport, ***2222',
        address: '222 Investor Ave, London',
        totalInvested: 0,
        isFrozen: false,
        holdings: [],
        transactions: []
    },
    {
        id: 'inv-003',
        name: 'Investor Three',
        email: 'investor3@gmail.com',
        role: 'investor',
        walletAddress: 'spark1q...inv003',
        kycStatus: 'verified',
        status: 'active',
        phone: '+65 9123 4567',
        kycLevel: 4,
        country: 'SG',
        city: 'Singapore',
        legalName: 'Investor Three Legal',
        dob: '1995-03-03',
        idDoc: 'ID Card, ***3333',
        address: '333 Investor Rd, Singapore',
        totalInvested: 0,
        isFrozen: false,
        holdings: [],
        transactions: []
    },
    // New Issuers
    {
        id: 'iss-a',
        name: 'Alice Issuer',
        email: 'issuera@gmail.com',
        role: 'issuer',
        walletAddress: 'spark1q...issuera',
        kycStatus: 'verified',
        status: 'active',
        phone: '+1 415-111-1111',
        kycLevel: 4,
        country: 'US',
        city: 'San Francisco',
        legalName: 'Alice Issuer Inc.',
        companyId: ['issuer-a-comp'],
    },
    {
        id: 'iss-b',
        name: 'Bob Issuer',
        email: 'issuerb@gmail.com',
        role: 'issuer',
        walletAddress: 'spark1q...issuerb',
        kycStatus: 'verified',
        status: 'active',
        phone: '+44 20-7946-2222',
        kycLevel: 4,
        country: 'GB',
        city: 'London',
        legalName: 'Bob Issuer Solutions',
        companyId: ['issuer-b-comp'],
    },
    {
        id: 'iss-c',
        name: 'Carol Issuer',
        email: 'issuerc@gmail.com',
        role: 'issuer',
        walletAddress: 'spark1q...issuerc',
        kycStatus: 'verified',
        status: 'active',
        phone: '+65 9876 5432',
        kycLevel: 4,
        country: 'SG',
        city: 'Singapore',
        legalName: 'Carol Issuer Holdings',
        companyId: ['issuer-c-comp'],
    }
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__usersData__) {
  global.__usersData__ = [...initialData];
}

export let usersData: User[] = global.__usersData__ || initialData;
