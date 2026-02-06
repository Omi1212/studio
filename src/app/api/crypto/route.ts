import { NextResponse } from 'next/server';

const cryptoData = [
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


export async function GET() {
  return NextResponse.json(cryptoData);
}
