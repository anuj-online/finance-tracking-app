import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('Attempting to fetch accounts...');
    const accounts = await db.account.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('Found accounts:', accounts);
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating account with data:', body);
    
    const { name, type, currency, balance, color, icon } = body;
    
    if (!name || !type || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, currency' },
        { status: 400 }
      );
    }
    
    const account = await db.account.create({
      data: {
        name,
        type,
        currency,
        balance: parseFloat(balance) || 0,
        color: color || '#4361ee',
        icon: icon || 'bi-wallet2'
      }
    });
    
    console.log('Account created successfully:', account);
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: 'Failed to create account', details: error.message },
      { status: 500 }
    );
  }
}