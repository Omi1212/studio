import type { AssetDetails } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __exampleAssets__: Omit<AssetDetails, 'assetIcon' | 'whitepaper' | 'legalAssetizationDoc' | 'assetIssuanceLegalDoc' | 'publicKey'>[] | undefined;
}

const initialData: Omit<AssetDetails, 'assetIcon' | 'whitepaper' | 'legalAssetizationDoc' | 'assetIssuanceLegalDoc' | 'publicKey'>[] = [
  {
    id: 'example-1',
    assetName: 'Digital Dollar',
    assetTicker: 'DUSD',
    status: 'active' as const,
    network: 'spark',
    maxSupply: 100000000,
    price: 1.00,
    decimals: 2,
    isFreezable: true,
    issuerId: 'iss-002',
    destinationAddress: 'spark1q...iss1pr',
  },
  {
    id: 'example-2',
    assetName: 'Gold Asset',
    assetTicker: 'GLDT',
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
    assetName: 'Real Estate Share',
    assetTicker: 'REIT',
    status: 'pending' as const,
    network: 'rgb',
    maxSupply: 100000,
    price: 250.00,
    decimals: 0,
    isFreezable: true,
    issuerId: 'iss-002',
    destinationAddress: 'spark1q...iss1pr',
  },
  {
    id: 'example-4',
    assetName: 'Carbon Credit',
    assetTicker: 'CRBN',
    status: 'active' as const,
    network: 'rgb',
    maxSupply: 50000000,
    price: 12.75,
    decimals: 6,
    isFreezable: true,
    issuerId: 'iss-002',
    destinationAddress: 'spark1q...iss3da',
  },
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__exampleAssets__) {
  global.__exampleAssets__ = [...initialData];
}

export let exampleAssets: Omit<AssetDetails, 'assetIcon' | 'whitepaper' | 'legalAssetizationDoc' | 'assetIssuanceLegalDoc' | 'publicKey'>[] = global.__exampleAssets__ || initialData;
