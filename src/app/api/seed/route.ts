import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Clear existing accounts
    await db.account.deleteMany();

    // Create sample accounts
    const accounts = await Promise.all([
      db.account.create({
        data: {
          name: 'Savings Account',
          type: 'BANK',
          currency: 'INR',
          balance: 450000,
          color: '#4cc9f0',
          icon: 'bi-bank2',
          userId: 'default-user'
        }
      }),
      db.account.create({
        data: {
          name: 'Checking Account',
          type: 'BANK',
          currency: 'INR',
          balance: 125680,
          color: '#4361ee',
          icon: 'bi-credit-card',
          userId: 'default-user'
        }
      }),
      db.account.create({
        data: {
          name: 'Investment Portfolio',
          type: 'INVESTMENT',
          currency: 'INR',
          balance: 570000,
          color: '#3f37c9',
          icon: 'bi-graph-up',
          userId: 'default-user'
        }
      }),
      db.account.create({
        data: {
          name: 'Emergency Fund',
          type: 'CASH',
          currency: 'EUR',
          balance: 14650,
          color: '#fb5607',
          icon: 'bi-piggy-bank',
          userId: 'default-user'
        }
      })
    ]);

    return NextResponse.json({ 
      message: 'Sample data seeded successfully',
      accounts: accounts.length 
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}