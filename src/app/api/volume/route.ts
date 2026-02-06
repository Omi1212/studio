import { NextResponse } from 'next/server';

const volumeData = [
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

export async function GET() {
  return NextResponse.json(volumeData);
}
