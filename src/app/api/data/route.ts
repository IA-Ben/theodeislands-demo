import { NextResponse } from 'next/server';
import data from '../../data/ode-islands.json';

export async function GET() {
  return NextResponse.json(data);
}