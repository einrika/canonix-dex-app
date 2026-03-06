import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '0';
  
  try {
    const res = await fetch(`https://explorer.paxinet.io/api/prc20/contracts?page=${page}`, {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch token list' }, { status: 500 });
  }
}
