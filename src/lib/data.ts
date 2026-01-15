

import type { Order, TokenDetails, Transfer, Issuer } from './types';

export const volumeData = [
  {
    title: "Today's Volume",
    value: '25,320',
    change: 2.5,
  },
  {
    title: 'Yesterday',
    value: '22,180',
    change: -1.8,
  },
  {
    title: 'Last 7 Days',
    value: '180,950',
    change: 12.1,
  },
  {
    title: 'Last 30 Days',
    value: '750,430',
    change: 7.2,
  },
];

export const paymentData = [
  { month: 'January', income: 18600, expense: 8000 },
  { month: 'February', income: 30500, expense: 12000 },
  { month: 'March', income: 23700, expense: 18000 },
  { month: 'April', income: 27800, expense: 11000 },
  { month: 'May', income: 18900, expense: 15000 },
  { month: 'June', income: 23900, expense: 17000 },
];

export const transactionData = [
  {
    id: 1,
    type: 'Receive',
    address: 'spark1...6n7dvn',
    date: 'Jul 26, 2024, 03:45 PM',
    amount: 2500,
    currency: 'JMT',
    direction: 'in',
  },
  {
    id: 2,
    type: 'Receive',
    address: 'spark1...6n7dvn',
    date: 'Jul 26, 2024, 09:12 AM',
    amount: 10000,
    currency: 'OMI',
    direction: 'in',
  },
  {
    id: 3,
    type: 'Send',
    address: 'spark1...k4f9p',
    date: 'Jul 25, 2024, 06:20 PM',
    amount: 500,
    currency: 'JMT',
    direction: 'out',
  },
    {
    id: 4,
    type: 'Receive',
    address: 'spark1...6n7dvn',
    date: 'Jul 25, 2024, 11:30 AM',
    amount: 750,
    currency: 'ING',
    direction: 'in',
  },
    {
    id: 5,
    type: 'Send',
    address: 'spark1...j8g2q',
    date: 'Jul 24, 2024, 08:00 AM',
    amount: 1250,
    currency: 'SATS',
    direction: 'out',
  },
  {
    id: 6,
    type: 'Send',
    address: 'spark1...newtx1',
    date: 'Jul 23, 2024, 02:15 PM',
    amount: 300,
    currency: 'SATS',
    direction: 'out',
  },
  {
    id: 7,
    type: 'Receive',
    address: 'spark1...newrx1',
    date: 'Jul 23, 2024, 10:00 AM',
    amount: 5000,
    currency: 'JMT',
    direction: 'in',
  },
  {
    id: 8,
    type: 'Receive',
    address: 'spark1...newrx2',
    date: 'Jul 22, 2024, 05:50 PM',
    amount: 200,
    currency: 'OMI',
    direction: 'in',
  },
  {
    id: 9,
    type: 'Send',
    address: 'spark1...newtx2',
    date: 'Jul 22, 2024, 01:05 PM',
    amount: 1500,
    currency: 'ING',
    direction: 'out',
  },
  {
    id: 10,
    type: 'Receive',
    address: 'spark1...newrx3',
    date: 'Jul 21, 2024, 09:25 AM',
    amount: 800,
    currency: 'SATS',
    direction: 'in',
  },
  {
    id: 11,
    type: 'Send',
    address: 'spark1...newtx3',
    date: 'Jul 20, 2024, 11:00 AM',
    amount: 450,
    currency: 'JMT',
    direction: 'out',
  },
  {
    id: 12,
    type: 'Receive',
    address: 'spark1...newrx4',
    date: 'Jul 19, 2024, 07:45 PM',
    amount: 6000,
    currency: 'OMI',
    direction: 'in',
  },
];


export const tokenData = [
  {
    id: 1,
    name: 'Omar',
    ticker: 'OMI',
    price: 0.0000,
    balance: 95.999,
    tokenId: 'btkn176av28r...4txyuqq5uq0e',
    publicKey: '03a0626e300a...3c753c732a20',
    maxSupply: 1000000,
    decimals: 10,
    network: 'spark',
  },
  {
    id: 2,
    name: 'MoisesToken',
    ticker: 'JMT',
    price: 0.0000,
    balance: 2500,
    tokenId: 'btkn176av28r...anotherid001',
    publicKey: '03a0626e300a...anotherkey01',
    maxSupply: 2000000,
    decimals: 8,
    network: 'rgb',
  },
];

export const cryptoData = [
  {
    ticker: 'BTC',
    name: 'Bitcoin',
    balance: 0,
    value: 0.00,
    icon: 'btc',
    isToken: false,
  },
  {
    ticker: 'JMT',
    name: 'MoisesToken',
    balance: 2500,
    value: 0.00,
    icon: null,
    isToken: true,
  },
  {
    ticker: 'OMI',
    name: 'Omar',
    balance: 10000,
    value: 0.00,
    icon: null,
    isToken: true,
  },
];

export const exampleTokens: Omit<TokenDetails, 'tokenIcon' | 'destinationAddress' | 'whitepaper' | 'legalTokenizationDoc' | 'tokenIssuanceLegalDoc' | 'publicKey'>[] = [
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
  },
  {
    id: 'example-4',
    tokenName: 'Carbon Credit',
    tokenTicker: 'CRBN',
    status: 'active' as const,
    network: 'taproot',
    maxSupply: 50000000,
    price: 12.75,
    decimals: 6,
    isFreezable: true,
  },
];

const txToken1 = { ...exampleTokens.find(t => t.id === 'example-1')!, id: 'example-1' };
const txToken2 = { ...exampleTokens.find(t => t.id === 'example-2')!, id: 'example-2' };
const txToken3 = { ...exampleTokens.find(t => t.id === 'example-3')!, id: 'example-3' };
const txToken4 = { ...exampleTokens.find(t => t.id === 'example-4')!, id: 'example-4' };


export const investorsData = [
    {
        id: 'inv-001',
        name: 'Alice Johnson',
        email: 'alice.j@example.com',
        status: 'accepted' as const,
        walletAddress: 'spark1q...a4b3c2d1',
        joinedDate: '2024-05-10',
        totalInvested: 50000,
        isFrozen: false,
        holdings: [
            { tokenId: 'example-1', tokenName: 'Digital Dollar', tokenTicker: 'DUSD', amount: 25000, value: 1.00 },
            { tokenId: 'example-2', tokenName: 'Gold Token', tokenTicker: 'GLDT', amount: 100, value: 75.50 },
        ],
        transactions: [
            { id: 'tx-1-1', type: 'Buy' as const, token: txToken1, amount: 10000, price: 1.00, date: '2024-07-01' },
            { id: 'tx-1-2', type: 'Buy' as const, token: txToken2, amount: 50, price: 70.20, date: '2024-07-05' },
            { id: 'tx-1-3', type: 'Sell' as const, token: txToken1, amount: 2000, price: 1.01, date: '2024-07-15' },
            { id: 'tx-1-4', type: 'Buy' as const, token: txToken4, amount: 500, price: 12.50, date: '2024-07-18' },
        ]
    },
    {
        id: 'inv-002',
        name: 'Bob Williams',
        email: 'bob.w@example.com',
        status: 'pending' as const,
        walletAddress: 'spark1q...e5f6g7h8',
        joinedDate: '2024-06-15',
        totalInvested: 25000,
        isFrozen: false,
        holdings: [
             { tokenId: 'example-1', tokenName: 'Digital Dollar', tokenTicker: 'DUSD', amount: 15000, value: 1.00 },
             { tokenId: 'example-3', tokenName: 'Real Estate Share', tokenTicker: 'REIT', amount: 40, value: 250.00 },
        ],
        transactions: [
            { id: 'tx-2-1', type: 'Buy' as const, token: txToken1, amount: 15000, price: 1.00, date: '2024-07-20' },
            { id: 'tx-2-2', type: 'Sell' as const, token: txToken1, amount: 5000, price: 1.00, date: '2024-07-25' },
            { id: 'tx-2-3', type: 'Buy' as const, token: txToken3, amount: 40, price: 250.00, date: '2024-07-28' },
        ]
    },
    {
        id: 'inv-003',
        name: 'Charlie Brown',
        email: 'charlie.b@example.com',
        status: 'accepted' as const,
        walletAddress: 'spark1q...i9j0k1l2',
        joinedDate: '2024-03-22',
        totalInvested: 125000,
        isFrozen: false,
        holdings: [
            { tokenId: 'example-1', tokenName: 'Digital Dollar', tokenTicker: 'DUSD', amount: 50000, value: 1.00 },
            { tokenId: 'example-4', tokenName: 'Carbon Credit', tokenTicker: 'CRBN', amount: 2000, value: 12.75 },
        ],
        transactions: [
            { id: 'tx-3-1', type: 'Buy' as const, token: txToken4, amount: 1500, price: 10.50, date: '2024-06-20' },
            { id: 'tx-3-2', type: 'Sell' as const, token: txToken4, amount: 300, price: 12.00, date: '2024-07-10' },
            { id: 'tx-3-3', type: 'Buy' as const, token: txToken1, amount: 20000, price: 1.00, date: '2024-07-18' },
            { id: 'tx-3-4', type: 'Buy' as const, token: txToken2, amount: 100, price: 72.00, date: '2024-07-21' },
        ]
    },
    {
        id: 'inv-004',
        name: 'Diana Miller',
        email: 'diana.m@example.com',
        status: 'accepted' as const,
        walletAddress: 'spark1q...m3n4o5p6',
        joinedDate: '2024-02-01',
        totalInvested: 10000,
        isFrozen: true,
        holdings: [
             { tokenId: 'example-2', tokenName: 'Gold Token', tokenTicker: 'GLDT', amount: 50, value: 75.50 },
        ],
        transactions: [
            { id: 'tx-4-1', type: 'Buy' as const, token: txToken2, amount: 100, price: 65.00, date: '2024-05-01' },
            { id: 'tx-4-2', type: 'Sell' as const, token: txToken2, amount: 25, price: 78.00, date: '2024-07-22' },
            { id: 'tx-4-3', type: 'Buy' as const, token: txToken1, amount: 1000, price: 1.00, date: '2024-07-25' },
        ]
    },
    {
        id: 'inv-005',
        name: 'Ethan Hunt',
        email: 'ethan.h@example.com',
        status: 'rejected' as const,
        walletAddress: 'spark1q...q7r8s9t0',
        joinedDate: '2024-07-20',
        totalInvested: 0,
        isFrozen: false,
        holdings: [],
        transactions: []
    },
    {
        id: 'inv-006',
        name: 'Fiona Gallagher',
        email: 'fiona.g@example.com',
        status: 'pending' as const,
        walletAddress: 'spark1q...u1v2w3x4',
        joinedDate: '2024-07-21',
        totalInvested: 0,
        isFrozen: false,
        holdings: [],
        transactions: []
    },
    {
        id: 'inv-007',
        name: 'George Mason',
        email: 'george.m@example.com',
        status: 'pending' as const,
        walletAddress: 'spark1q...y5z6a7b8',
        joinedDate: '2024-07-22',
        totalInvested: 0,
        isFrozen: false,
        holdings: [],
        transactions: []
    },
    {
        id: 'inv-008',
        name: 'Hannah Abbott',
        email: 'hannah.a@example.com',
        status: 'pending' as const,
        walletAddress: 'spark1q...c9d0e1f2',
        joinedDate: '2024-07-23',
        totalInvested: 0,
        isFrozen: false,
        holdings: [],
        transactions: []
    },
    {
        id: 'inv-009',
        name: 'Ian Wright',
        email: 'ian.w@example.com',
        status: 'accepted' as const,
        walletAddress: 'spark1q...g3h4i5j6',
        joinedDate: '2024-01-15',
        totalInvested: 75000,
        isFrozen: false,
        holdings: [],
        transactions: [
            { id: 'tx-9-1', type: 'Buy' as const, token: txToken1, amount: 75000, price: 1.00, date: '2024-01-20' },
        ]
    },
    {
        id: 'inv-010',
        name: 'Jane Smith',
        email: 'jane.s@example.com',
        status: 'accepted' as const,
        walletAddress: 'spark1q...k7l8m9n0',
        joinedDate: '2024-04-05',
        totalInvested: 200000,
        isFrozen: false,
        holdings: [],
        transactions: [
             { id: 'tx-10-1', type: 'Buy' as const, token: txToken2, amount: 1000, price: 70.00, date: '2024-04-10' },
        ]
    },
    {
        id: 'inv-011',
        name: 'Kevin McCallister',
        email: 'kevin.m@example.com',
        status: 'rejected' as const,
        walletAddress: 'spark1q...o1p2q3r4',
        joinedDate: '2024-07-24',
        totalInvested: 0,
        isFrozen: false,
        holdings: [],
        transactions: []
    }
];

export const ordersData: Order[] = [
    {
        id: 'order-001',
        investorId: 'inv-001',
        investorName: 'Alice Johnson',
        tokenId: 'example-1',
        tokenTicker: 'DUSD',
        type: 'Buy',
        amount: 10000,
        price: 1.00,
        date: '2024-07-28',
        status: 'pending'
    },
    {
        id: 'order-002',
        investorId: 'inv-003',
        investorName: 'Charlie Brown',
        tokenId: 'example-2',
        tokenTicker: 'GLDT',
        type: 'Buy',
        amount: 200,
        price: 75.50,
        date: '2024-07-27',
        status: 'completed'
    },
    {
        id: 'order-003',
        investorId: 'inv-004',
        investorName: 'Diana Miller',
        tokenId: 'example-1',
        tokenTicker: 'DUSD',
        type: 'Sell',
        amount: 5000,
        price: 1.01,
        date: '2024-07-26',
        status: 'pending'
    },
    {
        id: 'order-004',
        investorId: 'inv-001',
        investorName: 'Alice Johnson',
        tokenId: 'example-4',
        tokenTicker: 'CRBN',
        type: 'Buy',
        amount: 1500,
        price: 12.80,
        date: '2024-07-25',
        status: 'rejected'
    },
    {
        id: 'order-005',
        investorId: 'inv-009',
        investorName: 'Ian Wright',
        tokenId: 'example-2',
        tokenTicker: 'GLDT',
        type: 'Sell',
        amount: 50,
        price: 78.00,
        date: '2024-07-24',
        status: 'completed'
    },
     {
        id: 'order-006',
        investorId: 'inv-010',
        investorName: 'Jane Smith',
        tokenId: 'example-1',
        tokenTicker: 'DUSD',
        type: 'Buy',
        amount: 50000,
        price: 1.00,
        date: '2024-07-29',
        status: 'pending'
    }
];

export const transfersData: Transfer[] = [
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

export const tokenPriceHistory = [
  { month: 'Jan', price: 68.5 },
  { month: 'Feb', price: 72.3 },
  { month: 'Mar', price: 80.1 },
  { month: 'Apr', price: 75.6 },
  { month: 'May', price: 85.4 },
  { month: 'Jun', price: 92.2 },
  { month: 'Jul', price: 88.9 },
];

export const issuersData: Issuer[] = [
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
        name: 'TokenForge',
        email: 'support@tokenforge.io',
        walletAddress: 'spark1q...iss2tf',
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


