import type { Transfer } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __transfersData__: Transfer[] | undefined;
}

const initialData: Transfer[] = [
    { txId: 's0t1u2...w3x4y5', type: 'Transfer', from: 'spark1q...nd654321', to: 'spark1q...oc151515', amount: 50, tokenTicker: 'GLDT', date: '2024-08-12' },
    { txId: 'r9s0t1...v2w3x4', type: 'Transfer', from: 'spark1q...mj232323', to: 'spark1q...nd654321', amount: 200, tokenTicker: 'GLDT', date: '2024-08-11' },
    { txId: 'q8r9s0...u1v2w3', type: 'Transfer', from: 'spark1q...user03', to: 'spark1q...user01', amount: 150, tokenTicker: 'DUSD', date: '2024-08-10' },
    { txId: 'p7q8r9...t0u1v2', type: 'Transfer', from: 'spark1q...user02', to: 'spark1q...user03', amount: 300, tokenTicker: 'DUSD', date: '2024-08-09' },
    { txId: 'o6p7q8...s9t0u1', type: 'Transfer', from: 'spark1q...user01', to: 'spark1q...user02', amount: 1200, tokenTicker: 'DUSD', date: '2024-08-08' },
    { txId: 'n5o6p7...r8s9t0', type: 'Transfer', from: 'spark1...iss2tf', to: 'spark1q...mj232323', amount: 500, tokenTicker: 'GLDT', date: '2024-08-07' },
    { txId: 'm4n5o6...q7r8s9', type: 'Mint', from: 'Token Issuer', to: 'spark1...iss2tf', amount: 1000, tokenTicker: 'GLDT', date: '2024-08-06' },
    { txId: 'l3m4n5...p6q7r8', type: 'Burn', from: 'spark1...iss2tf', to: 'Burn Address', amount: 100, tokenTicker: 'GLDT', date: '2024-08-05' },
    { txId: '7g8h9i...j0k1l2', type: 'Transfer', from: 'spark1q...i9j0k1l2', to: 'spark1q...a4b3c2d1', amount: 2500, tokenTicker: 'DUSD', date: '2024-08-05' },
    { txId: 'k2l3m4...o5p6q7', type: 'Transfer', from: 'spark1q...a4b3c2d1', to: 'spark1q...e5f6g7h8', amount: 30, tokenTicker: 'GLDT', date: '2024-08-04' },
    { txId: '6f7g8h...i9j0k1', type: 'Burn', from: 'spark1q...a4b3c2d1', to: 'Burn Address', amount: 500, tokenTicker: 'DUSD', date: '2024-08-04' },
    { txId: 'j1k2l3...n4o5p6', type: 'Transfer', from: 'spark1q...m3n4o5p6', to: 'spark1q...i9j0k1l2', amount: 20, tokenTicker: 'GLDT', date: '2024-08-03' },
    { txId: '5e6f7g...h8i9j0', type: 'Transfer', from: 'spark1q...a4b3c2d1', to: 'spark1q...user03', amount: 1000, tokenTicker: 'DUSD', date: '2024-08-03' },
    { txId: '0j1k2l...m3n4o5', type: 'Transfer', from: 'spark1...iss2tf', to: 'spark1q...a4b3c2d1', amount: 50, tokenTicker: 'GLDT', date: '2024-08-02' },
    { txId: '4d5e6f...g7h8i9', type: 'Transfer', from: 'spark1...iss1pr', to: 'spark1q...i9j0k1l2', amount: 50000, tokenTicker: 'DUSD', date: '2024-08-02' },
    { txId: '9i0j1k...l2m3n4', type: 'Transfer', from: 'spark1...iss2tf', to: 'spark1q...m3n4o5p6', amount: 100, tokenTicker: 'GLDT', date: '2024-08-01' },
    { txId: '3c4d5e...f6g7h8', type: 'Transfer', from: 'spark1...iss1pr', to: 'spark1q...e5f6g7h8', amount: 15000, tokenTicker: 'DUSD', date: '2024-08-01' },
    { txId: '2b3c4d...e5f6g7', type: 'Transfer', from: 'spark1...iss1pr', to: 'spark1q...a4b3c2d1', amount: 25000, tokenTicker: 'DUSD', date: '2024-08-01' },
    { txId: '8h9i0j...k1l2m3', type: 'Mint', from: 'Token Issuer', to: 'spark1...iss2tf', amount: 5000, tokenTicker: 'GLDT', date: '2024-08-01' },
    { txId: '1a2b3c...d4e5f6', type: 'Mint', from: 'Token Issuer', to: 'spark1...iss1pr', amount: 100000, tokenTicker: 'DUSD', date: '2024-08-01' },
    { txId: '033b1f...f227ae', type: 'Transfer', from: 'spark1...6n7dvn', to: 'spark1...sasg4v', amount: 1000, tokenTicker: 'OMI', date: '2024-07-28' },
    { txId: '968d13...a0a404', type: 'Mint', from: 'Token Issuer', to: 'spark1...6n7dvn', amount: 5001, tokenTicker: 'OMI', date: '2024-07-21' },
    { txId: '695742...3c7e43', type: 'Transfer', from: 'spark1...6n7dvn', to: 'spark1...rq83he', amount: 10000, tokenTicker: 'OMI', date: '2024-07-21' },
    { txId: '6e64a6...bf83f2', type: 'Mint', from: 'Token Issuer', to: 'spark1...6n7dvn', amount: 10000, tokenTicker: 'OMI', date: '2024-07-21' },
    { txId: '594513...e6be8c', type: 'Burn', from: 'spark1...6n7dvn', to: 'Burn Address', amount: 91000, tokenTicker: 'OMI', date: '2024-07-20' },
    { txId: '69cd80...6e953a', type: 'Transfer', from: 'spark1...6n7dvn', to: 'spark1...7yq91g', amount: 10000, tokenTicker: 'OMI', date: '2024-07-20' },
    { txId: '82c0f5...f8ed27', type: 'Mint', from: 'Token Issuer', to: 'spark1...6n7dvn', amount: 1000, tokenTicker: 'OMI', date: '2024-07-20' },
    { txId: '0f9e1c...a1b2c3', type: 'Transfer', from: 'spark1...rq83he', to: 'spark1...zxy987', amount: 250, tokenTicker: 'GLDT', date: '2024-07-19' },
    { txId: 'a1b2c3...d4e5f6', type: 'Burn', from: 'spark1...sasg4v', to: 'Burn Address', amount: 50, tokenTicker: 'DUSD', date: '2024-07-18' },
    { txId: 'd4e5f6...g7h8i9', type: 'Mint', from: 'Token Issuer', to: 'spark1...rq83he', amount: 10000, tokenTicker: 'CRBN', date: '2024-07-17' },
    { txId: 'g7h8i9...j0k1l2', type: 'Transfer', from: 'spark1...zxy987', to: 'spark1...6n7dvn', amount: 800, tokenTicker: 'GLDT', date: '2024-07-16' },
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__transfersData__) {
  global.__transfersData__ = [...initialData];
}

export let transfersData: Transfer[] = global.__transfersData__ || initialData;
