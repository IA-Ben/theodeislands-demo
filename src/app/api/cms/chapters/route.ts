import { NextRequest, NextResponse } from 'next/server'
import { getAllChapters, createChapter } from '@/lib/db'
import { CreateChapterRequest, CMSApiResponse } from '@/@typings/cms'

// GET /api/cms/chapters - Get all chapters
export async function GET(): Promise<NextResponse<CMSApiResponse>> {
  try {
    const chapters = await getAllChapters()
    return NextResponse.json({
      success: true,
      data: chapters.sort((a, b) => a.order - b.order)
    })
  } catch (error) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch chapters'
    }, { status: 500 })
  }
}

// POST /api/cms/chapters - Create new chapter
export async function POST(request: NextRequest): Promise<NextResponse<CMSApiResponse>> {
  try {
    const body: CreateChapterRequest = await request.json()
    
    // Validation
    if (!body.title?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Title is required'
      }, { status: 400 })
    }

    const chapter = await createChapter({
      title: body.title.trim(),
      description: body.description?.trim(),
      order: body.order,
      published: false
    })

    return NextResponse.json({
      success: true,
      data: chapter,
      message: 'Chapter created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating chapter:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create chapter'
    }, { status: 500 })
  }
}