import type { Issuer } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __issuersData__: Issuer[] | undefined;
}

const initialData: Issuer[] = [
    {
        id: 'iss-a',
        name: 'Alice Issuer',
        email: 'issuera@gmail.com',
        walletAddress: 'spark1q...issuera',
        status: 'active',
    },
    {
        id: 'iss-b',
        name: 'Bob Issuer',
        email: 'issuerb@gmail.com',
        walletAddress: 'spark1q...issuerb',
        status: 'active',
    },
    {
        id: 'iss-c',
        name: 'Carol Issuer',
        email: 'issuerc@gmail.com',
        walletAddress: 'spark1q...issuerc',
        status: 'active',
    },
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__issuersData__) {
  global.__issuersData__ = [...initialData];
}

export let issuersData: Issuer[] = global.__issuersData__ || initialData;
