import type { TokenDetails } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __exampleTokens__: Omit<TokenDetails, 'tokenIcon' | 'whitepaper' | 'legalTokenizationDoc' | 'tokenIssuanceLegalDoc' | 'publicKey'>[] | undefined;
}

const initialData: Omit<TokenDetails, 'tokenIcon' | 'whitepaper' | 'legalTokenizationDoc' | 'tokenIssuanceLegalDoc' | 'publicKey'>[] = [
  {
    id: 'example-1',
    tokenName: 'Digital Dollar',
    tokenTicker: 'DUSD',
    status: 'active' as const,
    network: 'spark',
    maxSupply: 100000000,
    price: 1.00,
    decimals: 2,
    isFreezable: true,
    issuerId: 'iss-001',
    destinationAddress: 'spark1q...iss1pr',
  },
  {
    id: 'example-2',
    tokenName: 'Gold Token',
    tokenTicker: 'GLDT',
    status: 'active' as const,
    network: 'spark',
    maxSupply: 21000000,
    price: 75.50,
    decimals: 8,
    isFreezable: false,
    issuerId: 'iss-002',
    destinationAddress: 'spark1q...iss2tf',
  },
  {
    id: 'example-3',
    tokenName: 'Real Estate Share',
    tokenTicker: 'REIT',
    status: 'pending' as const,
    network: 'rgb',
    maxSupply: 100000,
    price: 250.00,
    decimals: 0,
    isFreezable: true,
    issuerId: 'iss-001',
    destinationAddress: 'spark1q...iss1pr',
  },
  {
    id: 'example-4',
    tokenName: 'Carbon Credit',
    tokenTicker: 'CRBN',
    status: 'active' as const,
    network: 'rgb',
    maxSupply: 50000000,
    price: 12.75,
    decimals: 6,
    isFreezable: true,
    issuerId: 'iss-003',
    destinationAddress: 'spark1q...iss3da',
  },
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__exampleTokens__) {
  global.__exampleTokens__ = [...initialData];
}

export let exampleTokens: Omit<TokenDetails, 'tokenIcon' | 'whitepaper' | 'legalTokenizationDoc' | 'tokenIssuanceLegalDoc' | 'publicKey'>[] = global.__exampleTokens__ || initialData;
