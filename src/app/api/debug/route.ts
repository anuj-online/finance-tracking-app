import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Debug: Testing Prisma client...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('Debug: Connected to database');
    
    // Check if Account model exists
    const accountCount = await prisma.account.count();
    console.log('Debug: Account count:', accountCount);
    
    // Check if User model exists  
    const userCount = await prisma.user.count();
    console.log('Debug: User count:', userCount);
    
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Debug successful',
      accountCount,
      userCount
    });
  } catch (error) {
    console.error('Debug failed:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Debug failed',
      error: error.message 
    }, { status: 500 });
  }
}