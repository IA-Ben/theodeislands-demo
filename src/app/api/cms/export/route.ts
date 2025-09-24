import { NextResponse } from 'next/server'
import { exportToMainDataFile } from '@/lib/db'
import { CMSApiResponse } from '@/@typings/cms'

// POST /api/cms/export - Export CMS content to main data file
export async function POST(): Promise<NextResponse<CMSApiResponse>> {
  try {
    await exportToMainDataFile()
    
    return NextResponse.json({
      success: true,
      message: 'Content exported successfully to ode-islands.json'
    })
  } catch (error) {
    console.error('Error exporting content:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to export content'
    }, { status: 500 })
  }
}