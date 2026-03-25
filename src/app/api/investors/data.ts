
import type { User } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __investorsData__: User[] | undefined;
}

const initialData: User[] = [
    {
        id: 'inv-001',
        name: 'Investor One',
        email: 'investor1@gmail.com',
        role: 'investor',
        walletAddress: 'spark1pgssxrzp2fg2r0dt3p35j3exj4grv0wwpg3l5j0elzfxfv967fz5xwg2sasg4v',
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
        joinedDate: '2024-08-01',
        totalInvested: 7260,
        isFrozen: false,
        holdings: [
            {
                assetId: 'btkn1-utxo-asset',
                assetName: 'UTXO',
                assetTicker: 'UTXO',
                amount: 1000,
                value: 7.26
            }
        ],
        transactions: [
            {
                id: 'txn-001',
                type: 'Buy',
                asset: { id: 'btkn1-utxo-asset', assetTicker: 'UTXO', assetName: 'UTXO' },
                date: '2024-07-28',
                amount: 1000,
                price: 7.26
            }
        ]
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
        joinedDate: '2024-08-02',
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
        joinedDate: '2024-08-03',
        totalInvested: 0,
        isFrozen: false,
        holdings: [],
        transactions: []
    },
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__investorsData__) {
  global.__investorsData__ = [...initialData];
}

export let investorsData: User[] = global.__investorsData__ || initialData;
