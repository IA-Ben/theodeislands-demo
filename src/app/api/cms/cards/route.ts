import { NextRequest, NextResponse } from 'next/server'
import { getAllCards, createCard, reorderCards } from '@/lib/db'
import { CreateCardRequest, CMSApiResponse } from '@/@typings/cms'

// GET /api/cms/cards - Get all cards or cards for specific chapter
export async function GET(request: NextRequest): Promise<NextResponse<CMSApiResponse>> {
  try {
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapterId')
    
    let cards
    if (chapterId) {
      const { getCardsByChapter } = await import('@/lib/db')
      cards = await getCardsByChapter(chapterId)
    } else {
      cards = await getAllCards()
    }

    return NextResponse.json({
      success: true,
      data: cards
    })
  } catch (error) {
    console.error('Error fetching cards:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch cards'
    }, { status: 500 })
  }
}

// POST /api/cms/cards - Create new card
export async function POST(request: NextRequest): Promise<NextResponse<CMSApiResponse>> {
  try {
    const body: CreateCardRequest = await request.json()
    
    // Validation
    if (!body.chapterId) {
      return NextResponse.json({
        success: false,
        error: 'Chapter ID is required'
      }, { status: 400 })
    }

    const card = await createCard(body)

    return NextResponse.json({
      success: true,
      data: card,
      message: 'Card created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating card:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create card'
    }, { status: 500 })
  }
}

// PUT /api/cms/cards/reorder - Reorder cards within a chapter
export async function PUT(request: NextRequest): Promise<NextResponse<CMSApiResponse>> {
  try {
    const { chapterId, cardIds }: { chapterId: string, cardIds: string[] } = await request.json()
    
    if (!chapterId || !Array.isArray(cardIds)) {
      return NextResponse.json({
        success: false,
        error: 'Chapter ID and card IDs array are required'
      }, { status: 400 })
    }

    await reorderCards(chapterId, cardIds)

    return NextResponse.json({
      success: true,
      message: 'Cards reordered successfully'
    })
  } catch (error) {
    console.error('Error reordering cards:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to reorder cards'
    }, { status: 500 })
  }
}