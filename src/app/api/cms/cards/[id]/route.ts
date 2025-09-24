import { NextRequest, NextResponse } from 'next/server'
import { getCardById, updateCard, deleteCard } from '@/lib/db'
import { UpdateCardRequest, CMSApiResponse } from '@/@typings/cms'

// GET /api/cms/cards/[id] - Get specific card
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<CMSApiResponse>> {
  try {
    const card = await getCardById(params.id)
    if (!card) {
      return NextResponse.json({
        success: false,
        error: 'Card not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: card
    })
  } catch (error) {
    console.error('Error fetching card:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch card'
    }, { status: 500 })
  }
}

// PUT /api/cms/cards/[id] - Update card
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<CMSApiResponse>> {
  try {
    const body: UpdateCardRequest = await request.json()
    
    const updatedCard = await updateCard(params.id, body)
    if (!updatedCard) {
      return NextResponse.json({
        success: false,
        error: 'Card not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedCard,
      message: 'Card updated successfully'
    })
  } catch (error) {
    console.error('Error updating card:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update card'
    }, { status: 500 })
  }
}

// DELETE /api/cms/cards/[id] - Delete card
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<CMSApiResponse>> {
  try {
    const success = await deleteCard(params.id)
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Card not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Card deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting card:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete card'
    }, { status: 500 })
  }
}