import { NextResponse } from 'next/server'
import { hasAdmin } from '@/lib/actions/setup'

/**
 * API route para verificar se já existe um admin
 */
export async function GET() {
  try {
    const adminExists = await hasAdmin()
    return NextResponse.json({ hasAdmin: adminExists })
  } catch (error: any) {
    console.error('Erro ao verificar admin:', error)
    return NextResponse.json(
      { hasAdmin: false, error: error.message },
      { status: 500 }
    )
  }
}



