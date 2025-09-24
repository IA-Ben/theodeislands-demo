import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, createSession } from '@/lib/auth'
import { CMSApiResponse } from '@/@typings/cms'

export async function POST(request: NextRequest): Promise<NextResponse<CMSApiResponse>> {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 })
    }

    const user = await authenticateUser(email, password)
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    await createSession(user)

    return NextResponse.json({
      success: true,
      data: { user },
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Login failed'
    }, { status: 500 })
  }
}