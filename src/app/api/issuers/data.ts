import type { Issuer } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __issuersData__: Issuer[] | undefined;
}

const initialData: Issuer[] = [
    {
        id: 'iss-001',
        name: 'Prime Issuance',
        email: 'contact@primeissuance.com',
        walletAddress: 'spark1q...iss1pr',
        issuedTokens: 5,
        pendingTokens: 2,
        status: 'active',
    },
    {
        id: 'iss-002',
        name: 'Emisores de Activos Digitales',
        email: 'issuer@gmail.com',
        walletAddress: 'spark1q...user02',
        issuedTokens: 12,
        pendingTokens: 0,
        status: 'active',
    },
    {
        id: 'iss-003',
        name: 'Digital Assets Inc.',
        email: 'admin@digitalassets.com',
        walletAddress: 'spark1q...iss3da',
        issuedTokens: 2,
        pendingTokens: 1,
        status: 'inactive',
    },
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__issuersData__) {
  global.__issuersData__ = [...initialData];
}

export let issuersData: Issuer[] = global.__issuersData__ || initialData;
