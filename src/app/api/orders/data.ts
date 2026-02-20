import type { Order } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __ordersData__: Order[] | undefined;
}

const initialData: Order[] = [
    {
        id: 'order-001',
        investorId: 'inv-001',
        investorName: 'Alice Johnson',
        assetId: 'example-1',
        assetTicker: 'DUSD',
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
        assetId: 'example-2',
        assetTicker: 'GLDT',
        type: 'Buy',
        amount: 200,
        price: 75.50,
        date: '2024-07-27',
        status: 'completed',
        paymentDetails: {
            method: 'Bitcoin',
            network: 'Lightning',
            cryptoAddress: 'lnbc1190n1p5kujxfpp59mejv93rk75hctd5t398fkfsncgzdk3c9d5y9mav5nelde4dul3qdp2v3shyanfde6xjctwdd5kjgzsfafjq5mpd3jhxgpsxycqzpuxqrwzqsp5u88azqdmchu3vz92hfh0zs0a53k9wh2vezrnejwem0fw5892mf0s9qxpqysgqratk74qpdt23smxz9zpl8n8tdx8rxakp5r9nehrktw4eskr9vfa9dj9rcld8krf0ra875ep4tucg2ven0v7zs2v35huwvzhh3lapcfqp7z72zt',
            transactionId: 'btc-tx-xxxxxxxx'
        }
    },
    {
        id: 'order-003',
        investorId: 'inv-004',
        investorName: 'Diana Miller',
        assetId: 'example-1',
        assetTicker: 'DUSD',
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
        assetId: 'example-4',
        assetTicker: 'CRBN',
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
        assetId: 'example-2',
        assetTicker: 'GLDT',
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
        assetId: 'example-1',
        assetTicker: 'DUSD',
        type: 'Buy',
        amount: 50000,
        price: 1.00,
        date: '2024-07-29',
        status: 'pending'
    }
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__ordersData__) {
  global.__ordersData__ = [...initialData];
}

export let ordersData: Order[] = global.__ordersData__ || initialData;
