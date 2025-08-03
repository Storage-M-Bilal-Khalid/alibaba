import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/postgresSqlDbConnection';

export async function GET(req: NextRequest) {
  let client;
  try {
    client = Database();
    console.log(`Connected Successfully to PostgreSQL`);

    const result = await client.query('SELECT * FROM users');
    console.log('Query executed successfully:', result.rows);

    
    console.log('Test result:', result.rows[0]);
    


    return NextResponse.json({ success: true, test: result.rows });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users', error: (error as Error).message }, { status: 500 });
  }
}