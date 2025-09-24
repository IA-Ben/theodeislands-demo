import { NextResponse } from 'next/server'
import { migrateExistingData } from '@/lib/migrate'
import { getCurrentUser, hasPermission } from '@/lib/auth'
import { CMSApiResponse } from '@/@typings/cms'

// POST /api/cms/migrate - Import existing data into CMS
export async function POST(): Promise<NextResponse<CMSApiResponse>> {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser()
    if (!user || !hasPermission(user, 'write')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    await migrateExistingData()
    
    return NextResponse.json({
      success: true,
      message: 'Data migration completed successfully'
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Migration failed'
    }, { status: 500 })
  }
}