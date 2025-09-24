import { NextRequest, NextResponse } from 'next/server'
import { getChapterById, updateChapter, deleteChapter, getCardsByChapter } from '@/lib/db'
import { UpdateChapterRequest, CMSApiResponse } from '@/@typings/cms'

// GET /api/cms/chapters/[id] - Get specific chapter with cards
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<CMSApiResponse>> {
  try {
    const chapter = await getChapterById(params.id)
    if (!chapter) {
      return NextResponse.json({
        success: false,
        error: 'Chapter not found'
      }, { status: 404 })
    }

    // Include cards
    const cards = await getCardsByChapter(params.id)
    const chapterWithCards = { ...chapter, cards }

    return NextResponse.json({
      success: true,
      data: chapterWithCards
    })
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch chapter'
    }, { status: 500 })
  }
}

// PUT /api/cms/chapters/[id] - Update chapter
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<CMSApiResponse>> {
  try {
    const body: UpdateChapterRequest = await request.json()
    
    const updatedChapter = await updateChapter(params.id, body)
    if (!updatedChapter) {
      return NextResponse.json({
        success: false,
        error: 'Chapter not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedChapter,
      message: 'Chapter updated successfully'
    })
  } catch (error) {
    console.error('Error updating chapter:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update chapter'
    }, { status: 500 })
  }
}

// DELETE /api/cms/chapters/[id] - Delete chapter
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<CMSApiResponse>> {
  try {
    const success = await deleteChapter(params.id)
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Chapter not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Chapter deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting chapter:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete chapter'
    }, { status: 500 })
  }
}