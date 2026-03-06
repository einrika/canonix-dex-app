import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://explorer.paxinet.io/api/status', {
      next: { revalidate: 10 }
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch node status' }, { status: 500 });
  }
}
