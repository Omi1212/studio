
import type { TokenDetails, User } from '@/lib/types';
import { exampleTokens } from '../tokens/data';

// Use a global variable in development to preserve data across HMR
declare global {
  var __investorsData__: User[] | undefined;
}

const allTokens: Omit<TokenDetails, 'tokenIcon' | 'whitepaper' | 'legalTokenizationDoc' | 'tokenIssuanceLegalDoc' | 'publicKey'>[] = exampleTokens;

const txToken1 = { ...allTokens.find(t => t.id === 'example-1')!, id: 'example-1' };
const txToken2 = { ...allTokens.find(t => t.id === 'example-2')!, id: 'example-2' };
const txToken3 = { ...allTokens.find(t => t.id === 'example-3')!, id: 'example-3' };
const txToken4 = { ...allTokens.find(t => t.id === 'example-4')!, id: 'example-4' };


const initialData: User[] = [
    {
        id: 'inv-001',
        name: 'Alice Johnson',
        email: 'alice.j@example.com',
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...a4b3c2d1',
        joinedDate: '2024-05-10',
        totalInvested: 75000,
        isFrozen: false,
        phone: '+1 555-0199',
        kycLevel: 2,
        country: 'US',
        city: 'New York',
        legalName: 'Alice May Johnson',
        dob: '1990-03-15',
        idDoc: 'Passport, ***1234',
        address: '123 Main St, New York, NY 10001',
        holdings: [
            { tokenId: 'example-1', tokenName: 'Digital Dollar', tokenTicker: 'DUSD', amount: 25000, value: 1.00 },
            { tokenId: 'example-2', tokenName: 'Gold Token', tokenTicker: 'GLDT', amount: 100, value: 75.50 },
        ],
        transactions: [
            { id: 'tx-1-1', type: 'Buy' as const, token: txToken1, amount: 10000, price: 1.00, date: '2024-07-01' },
            { id: 'tx-1-2', type: 'Buy' as const, token: txToken2, amount: 50, price: 70.20, date: '2024-07-05' },
            { id: 'tx-1-3', type: 'Sell' as const, token: txToken1, amount: 2000, price: 1.01, date: '2024-07-15' },
            { id: 'tx-1-4', type: 'Buy' as const, token: txToken4, amount: 500, price: 12.50, date: '2024-07-18' },
            { id: 'tx-1-5', type: 'Buy' as const, token: txToken3, amount: 20, price: 240.00, date: '2024-07-20' },
            { id: 'tx-1-6', type: 'Buy' as const, token: txToken1, amount: 15000, price: 1.00, date: '2024-07-22' },
        ]
    },
    {
        id: 'inv-002',
        name: 'Bob Williams',
        email: 'bob.w@example.com',
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...e5f6g7h8',
        joinedDate: '2024-06-15',
        totalInvested: 50000,
        isFrozen: false,
        phone: '+1 555-0100',
        kycLevel: 2,
        country: 'CA',
        city: 'Toronto',
        legalName: 'Robert Williams',
        dob: '1985-06-20',
        idDoc: 'Passport, ***5678',
        address: '456 Oak St, Toronto, ON M5H 2N2',
        holdings: [
             { tokenId: 'example-1', tokenName: 'Digital Dollar', tokenTicker: 'DUSD', amount: 15000, value: 1.00 },
             { tokenId: 'example-3', tokenName: 'Real Estate Share', tokenTicker: 'REIT', amount: 40, value: 250.00 },
        ],
        transactions: [
            { id: 'tx-2-1', type: 'Buy' as const, token: txToken1, amount: 15000, price: 1.00, date: '2024-07-20' },
            { id: 'tx-2-2', type: 'Sell' as const, token: txToken1, amount: 5000, price: 1.00, date: '2024-07-25' },
            { id: 'tx-2-3', type: 'Buy' as const, token: txToken3, amount: 40, price: 250.00, date: '2024-07-28' },
            { id: 'tx-2-4', type: 'Buy' as const, token: txToken2, amount: 100, price: 75.00, date: '2024-08-01' },
        ]
    },
    {
        id: 'inv-003',
        name: 'Charlie Brown',
        email: 'charlie.b@example.com',
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...i9j0k1l2',
        joinedDate: '2024-03-22',
        totalInvested: 150000,
        isFrozen: false,
        phone: '+44 20 7946 0958',
        kycLevel: 3,
        country: 'GB',
        city: 'London',
        legalName: 'Charles Brown',
        dob: '1992-11-30',
        idDoc: 'Driver\'s License, ***9876',
        address: '789 Pine St, London, W1J 7NT',
        holdings: [
            { tokenId: 'example-1', tokenName: 'Digital Dollar', tokenTicker: 'DUSD', amount: 50000, value: 1.00 },
            { tokenId: 'example-4', tokenName: 'Carbon Credit', tokenTicker: 'CRBN', amount: 2000, value: 12.75 },
        ],
        transactions: [
            { id: 'tx-3-1', type: 'Buy' as const, token: txToken4, amount: 1500, price: 10.50, date: '2024-06-20' },
            { id: 'tx-3-2', type: 'Sell' as const, token: txToken4, amount: 300, price: 12.00, date: '2024-07-10' },
            { id: 'tx-3-3', type: 'Buy' as const, token: txToken1, amount: 20000, price: 1.00, date: '2024-07-18' },
            { id: 'tx-3-4', type: 'Buy' as const, token: txToken2, amount: 100, price: 72.00, date: '2024-07-21' },
            { id: 'tx-3-5', type: 'Sell' as const, token: txToken1, amount: 5000, price: 1.02, date: '2024-07-25' },
            { id: 'tx-3-6', type: 'Buy' as const, token: txToken3, amount: 10, price: 255.00, date: '2024-07-29' },
        ]
    },
    {
        id: 'inv-004',
        name: 'Diana Miller',
        email: 'diana.m@example.com',
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...m3n4o5p6',
        joinedDate: '2024-02-01',
        totalInvested: 10000,
        isFrozen: true,
        phone: '+49 30 12345678',
        kycLevel: 2,
        country: 'DE',
        city: 'Berlin',
        legalName: 'Diana Miller',
        dob: '1988-01-25',
        idDoc: 'ID Card, ***5432',
        address: '101 Kurfürstendamm, Berlin, 10719',
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
        kycStatus: 'rejected',
        status: 'inactive',
        role: 'investor',
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
        kycStatus: 'pending',
        status: 'active',
        role: 'investor',
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
        kycStatus: 'pending',
        status: 'active',
        role: 'investor',
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
        kycStatus: 'pending',
        status: 'active',
        role: 'investor',
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
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...g3h4i5j6',
        joinedDate: '2024-01-15',
        totalInvested: 90000,
        isFrozen: false,
        phone: '+61 2 9261 8888',
        kycLevel: 2,
        country: 'AU',
        city: 'Sydney',
        legalName: 'Ian Wright',
        dob: '1979-08-10',
        idDoc: 'Passport, ***1111',
        address: '202 George St, Sydney, NSW 2000',
        holdings: [],
        transactions: [
            { id: 'tx-9-1', type: 'Buy' as const, token: txToken1, amount: 75000, price: 1.00, date: '2024-01-20' },
            { id: 'tx-9-2', type: 'Buy' as const, token: txToken2, amount: 200, price: 75.00, date: '2024-08-02' },
        ]
    },
    {
        id: 'inv-010',
        name: 'Jane Smith',
        email: 'jane.s@example.com',
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...k7l8m9n0',
        joinedDate: '2024-04-05',
        totalInvested: 270000,
        isFrozen: false,
        phone: '+1 555-0105',
        kycLevel: 3,
        country: 'US',
        city: 'Chicago',
        legalName: 'Jane Elizabeth Smith',
        dob: '1983-05-12',
        idDoc: 'Passport, ***2222',
        address: '303 W Madison St, Chicago, IL 60606',
        holdings: [],
        transactions: [
             { id: 'tx-10-1', type: 'Buy' as const, token: txToken2, amount: 1000, price: 70.00, date: '2024-04-10' },
             { id: 'tx-10-2', type: 'Buy' as const, token: txToken3, amount: 50, price: 240.00, date: '2024-05-15' },
             { id: 'tx-10-3', type: 'Buy' as const, token: txToken1, amount: 20000, price: 1.01, date: '2024-06-01' },
        ]
    },
    {
        id: 'inv-011',
        name: 'Kevin McCallister',
        email: 'kevin.m@example.com',
        kycStatus: 'rejected',
        status: 'inactive',
        role: 'investor',
        walletAddress: 'spark1q...o1p2q3r4',
        joinedDate: '2024-07-24',
        totalInvested: 0,
        isFrozen: false,
        holdings: [],
        transactions: []
    },
    {
        id: 'inv-012',
        name: 'Laura Palmer',
        email: 'laura.p@example.com',
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...lp123456',
        joinedDate: '2024-08-01',
        totalInvested: 35000,
        isFrozen: false,
        holdings: [],
        transactions: [
            { id: 'tx-12-1', type: 'Buy' as const, token: txToken1, amount: 20000, price: 1.00, date: '2024-08-01' },
            { id: 'tx-12-2', type: 'Buy' as const, token: txToken3, amount: 60, price: 250.00, date: '2024-08-02' },
        ]
    },
    {
        id: 'inv-013',
        name: 'Michael Jordan',
        email: 'michael.j@example.com',
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...mj232323',
        joinedDate: '2024-08-02',
        totalInvested: 100250,
        isFrozen: false,
        holdings: [],
        transactions: [
            { id: 'tx-13-1', type: 'Buy' as const, token: txToken2, amount: 1000, price: 75.25, date: '2024-08-02' },
            { id: 'tx-13-2', type: 'Buy' as const, token: txToken3, amount: 100, price: 250.00, date: '2024-08-03' },
        ]
    },
    {
        id: 'inv-014',
        name: 'Nancy Drew',
        email: 'nancy.d@example.com',
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...nd654321',
        joinedDate: '2024-08-03',
        totalInvested: 12750,
        isFrozen: false,
        holdings: [],
        transactions: [
            { id: 'tx-14-1', type: 'Buy' as const, token: txToken3, amount: 50, price: 255.00, date: '2024-08-03' },
        ]
    },
    {
        id: 'inv-015',
        name: 'Olivia Chen',
        email: 'olivia.c@example.com',
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...oc151515',
        joinedDate: '2024-08-04',
        totalInvested: 25000,
        isFrozen: false,
        holdings: [],
        transactions: [
            { id: 'tx-15-1', type: 'Buy' as const, token: txToken1, amount: 25000, price: 1.00, date: '2024-08-04' },
        ]
    },
    {
        id: 'inv-016',
        name: 'Paul Atreides',
        email: 'paul.a@example.com',
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...pa161616',
        joinedDate: '2024-08-05',
        totalInvested: 15100,
        isFrozen: false,
        holdings: [],
        transactions: [
            { id: 'tx-16-1', type: 'Buy' as const, token: txToken2, amount: 200, price: 75.50, date: '2024-08-05' },
        ]
    },
    {
        id: 'inv-017',
        name: 'Quinn Fabray',
        email: 'quinn.f@example.com',
        kycStatus: 'verified',
        status: 'active',
        role: 'investor',
        walletAddress: 'spark1q...qf171717',
        joinedDate: '2024-08-06',
        totalInvested: 17550,
        isFrozen: false,
        holdings: [],
        transactions: [
            { id: 'tx-17-1', type: 'Buy' as const, token: txToken1, amount: 10000, price: 1.00, date: '2024-08-06' },
            { id: 'tx-17-2', type: 'Buy' as const, token: txToken2, amount: 100, price: 75.50, date: '2024-08-06' },
        ]
    }
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__investorsData__) {
  global.__investorsData__ = [...initialData];
}

export let investorsData: User[] = global.__investorsData__ || initialData;
