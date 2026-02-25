
import type { AssetDetails } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __exampleAssets__: Omit<AssetDetails, 'assetIcon' | 'whitepaper' | 'legalAssetizationDoc' | 'assetIssuanceLegalDoc' | 'publicKey'>[] | undefined;
}

const initialData: Omit<AssetDetails, 'assetIcon' | 'whitepaper' | 'legalAssetizationDoc' | 'assetIssuanceLegalDoc' | 'publicKey'>[] = [
  {
    id: 'example-5',
    assetName: 'Tether Gold',
    assetTicker: 'XAUT',
    status: 'active' as const,
    network: ['spark', 'liquid', 'rgb', 'taproot'],
    maxSupply: 100000,
    price: 2300.00,
    decimals: 6,
    isFreezable: true,
    companyId: 'bstratus-securities',
    destinationAddress: 'spark1q...xautdest',
    assetType: 'security_token',
    subscriptionTime: 'Daily',
    minInvestment: 2300,
    maxInvestment: 23000,
    subscriptionFees: 0.2,
    redemptionTime: 'Daily',
    minRedemptionAmount: 2300,
    redemptionFees: 0.2,
  },
  {
    id: 'btkn1-utxo-asset',
    assetName: 'UTXO',
    assetTicker: 'UTXO',
    status: 'active' as const,
    network: ['spark', 'liquid'],
    maxSupply: 21000000,
    price: 7.26,
    decimals: 6,
    isFreezable: false,
    companyId: 'issuer-a-comp',
    destinationAddress: 'btkn1pzvck7xzt96vj4h9agnyu493t7a9jdc4v3j2z3n3fs4cwlcq9yps2zgm4z',
    assetType: 'utility_token',
    subscriptionTime: 'Daily',
    minInvestment: 10,
    maxInvestment: 1000,
    subscriptionFees: 0,
    redemptionTime: 'Daily',
    minRedemptionAmount: 10,
    redemptionFees: 0,
  },
  {
    id: 'btkn1-flashsparks-asset',
    assetName: 'FlashSparks',
    assetTicker: 'FSPKS',
    status: 'active' as const,
    network: ['spark', 'rgb'],
    maxSupply: 1000000000,
    price: 0.50,
    decimals: 8,
    isFreezable: true,
    companyId: 'issuer-a-comp',
    destinationAddress: 'btkn1daywtenlww42njymqzyegvcwuy3p9f26zknme0srxa7tagewvuys86h553',
    assetType: 'utility_token',
    subscriptionTime: 'Daily',
    minInvestment: 100,
    maxInvestment: 10000,
    subscriptionFees: 0.1,
    redemptionTime: 'Daily',
    minRedemptionAmount: 100,
    redemptionFees: 0.1,
  },
  {
    id: 'btkn1-bitcoin-usd-asset',
    assetName: 'Bitcoin USD',
    assetTicker: 'USDB',
    status: 'active' as const,
    network: ['spark', 'liquid'],
    maxSupply: 500000000,
    price: 1.00,
    decimals: 2,
    isFreezable: true,
    companyId: 'issuer-b-comp',
    destinationAddress: 'btkn1xgrvjwey5ngcagvap2dzzvsy4uk8ua9x69k82dwvt5e7ef9drm9qztux87',
    assetType: 'stablecoin',
    subscriptionTime: 'Daily',
    minInvestment: 10000,
    maxInvestment: 100000,
    subscriptionFees: 0.05,
    redemptionTime: 'Daily',
    minRedemptionAmount: 1000,
    redemptionFees: 0.05,
  },
  {
    id: 'btkn1-snowflake-asset',
    assetName: 'Snowflake',
    assetTicker: 'SNOW',
    status: 'active' as const,
    network: ['spark', 'rgb', 'taproot'],
    maxSupply: 100000000,
    price: 15.25,
    decimals: 4,
    isFreezable: false,
    companyId: 'issuer-c-comp',
    destinationAddress: 'btkn1f0wpf28xhs6sswxkthx9fzrv2x9476yk95wlucp4sfuqmxnu8zesv2gsws',
    assetType: 'security_token',
    subscriptionTime: 'Weekly',
    minInvestment: 25000,
    maxInvestment: 250000,
    subscriptionFees: 1,
    redemptionTime: 'Quarterly',
    minRedemptionAmount: 25000,
    redemptionFees: 2.5,
  },
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__exampleAssets__) {
  global.__exampleAssets__ = [...initialData];
}

export let exampleAssets: Omit<AssetDetails, 'assetIcon' | 'whitepaper' | 'legalAssetizationDoc' | 'assetIssuanceLegalDoc' | 'publicKey'>[] = global.__exampleAssets__ || initialData;

    
