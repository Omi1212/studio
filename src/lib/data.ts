

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

export const exampleTokens = [
  {
    id: 'example-1',
    tokenName: 'Digital Dollar',
    tokenTicker: 'DUSD',
    status: 'active' as const,
    network: 'liquid',
    maxSupply: 100000000,
    value: 1.00
  },
  {
    id: 'example-2',
    tokenName: 'Gold Token',
    tokenTicker: 'GLDT',
    status: 'active' as const,
    network: 'spark',
    maxSupply: 21000000,
    value: 75.50
  },
  {
    id: 'example-3',
    tokenName: 'Real Estate Share',
    tokenTicker: 'REIT',
    status: 'pending' as const,
    network: 'rgb',
    maxSupply: 100000,
    value: 250.00
  },
  {
    id: 'example-4',
    tokenName: 'Carbon Credit',
    tokenTicker: 'CRBN',
    status: 'active' as const,
    network: 'taproot',
    maxSupply: 50000000,
    value: 12.75
  },
];

export const investorsData = [
    {
        id: 'inv-001',
        name: 'Alice Johnson',
        email: 'alice.j@example.com',
        status: 'whitelisted' as const,
        walletAddress: 'spark1q...a4b3c2d1',
        joinedDate: '2024-05-10',
        totalInvested: 50000,
        isFrozen: false,
        holdings: [
            { tokenId: 'example-1', tokenName: 'Digital Dollar', tokenTicker: 'DUSD', amount: 25000, value: 1.00 },
            { tokenId: 'example-2', tokenName: 'Gold Token', tokenTicker: 'GLDT', amount: 100, value: 75.50 },
        ]
    },
    {
        id: 'inv-002',
        name: 'Bob Williams',
        email: 'bob.w@example.com',
        status: 'pending' as const,
        walletAddress: 'spark1q...e5f6g7h8',
        joinedDate: '2024-06-15',
        totalInvested: 0,
        isFrozen: false,
        holdings: []
    },
    {
        id: 'inv-003',
        name: 'Charlie Brown',
        email: 'charlie.b@example.com',
        status: 'whitelisted' as const,
        walletAddress: 'spark1q...i9j0k1l2',
        joinedDate: '2024-03-22',
        totalInvested: 125000,
        isFrozen: false,
        holdings: [
            { tokenId: 'example-1', tokenName: 'Digital Dollar', tokenTicker: 'DUSD', amount: 50000, value: 1.00 },
            { tokenId: 'example-4', tokenName: 'Carbon Credit', tokenTicker: 'CRBN', amount: 2000, value: 12.75 },
        ]
    },
    {
        id: 'inv-004',
        name: 'Diana Miller',
        email: 'diana.m@example.com',
        status: 'restricted' as const,
        walletAddress: 'spark1q...m3n4o5p6',
        joinedDate: '2024-02-01',
        totalInvested: 10000,
        isFrozen: true,
        holdings: [
             { tokenId: 'example-2', tokenName: 'Gold Token', tokenTicker: 'GLDT', amount: 50, value: 75.50 },
        ]
    }
];
