import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(req: NextRequest) {
  try {
    const { stdout } = await execAsync('gcloud auth print-access-token');
    console.log(stdout)
    return NextResponse.json({ token: stdout.trim() });
  } catch (err: any) {
    console.error('Failed to get access token:', err);
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
  }
}
