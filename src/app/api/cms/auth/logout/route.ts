import { NextResponse } from 'next/server'
import { logout } from '@/lib/auth'
import { CMSApiResponse } from '@/@typings/cms'

export async function POST(): Promise<NextResponse<CMSApiResponse>> {
  try {
    await logout()

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      success: false,
      error: 'Logout failed'
    }, { status: 500 })
  }
}