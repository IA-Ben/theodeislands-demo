"use client"

import { useState, useEffect } from 'react'
import { Chapter, Card, UpdateChapterRequest, CreateCardRequest, CMSApiResponse } from '@/@typings/cms'

interface ChapterEditorProps {
  chapter: Chapter
  onChapterUpdate: () => void
  onCardSelect: (card: Card) => void
  onCardUpdate: () => void
}

export default function ChapterEditor({ 
  chapter, 
  onChapterUpdate, 
  onCardSelect, 
  onCardUpdate 
}: ChapterEditorProps) {
  const [editedChapter, setEditedChapter] = useState<UpdateChapterRequest>({
    title: chapter.title,
    description: chapter.description || '',
    order: chapter.order,
    published: chapter.published
  })
  const [loading, setLoading] = useState(false)
  const [isCreatingCard, setIsCreatingCard] = useState(false)

  useEffect(() => {
    setEditedChapter({
      title: chapter.title,
      description: chapter.description || '',
      order: chapter.order,
      published: chapter.published
    })
  }, [chapter])

  const handleUpdateChapter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editedChapter.title?.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/cms/chapters/${chapter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedChapter)
      })

      const data: CMSApiResponse = await response.json()
      
      if (data.success) {
        onChapterUpdate()
      } else {
        alert(data.error || 'Failed to update chapter')
      }
    } catch (err) {
      alert('Failed to update chapter')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCard = async () => {
    const newCard: CreateCardRequest = {
      chapterId: chapter.id,
      order: chapter.cards?.length || 0,
      text: { title: 'New Card', subtitle: '', description: '' }
    }

    try {
      const response = await fetch('/api/cms/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard)
      })

      const data: CMSApiResponse = await response.json()
      
      if (data.success) {
        onCardUpdate()
        setIsCreatingCard(false)
      } else {
        alert(data.error || 'Failed to create card')
      }
    } catch (err) {
      alert('Failed to create card')
      console.error(err)
    }
  }

  const handleDeleteCard = async (card: Card) => {
    if (!confirm(`Are you sure you want to delete this card?`)) {
      return
    }

    try {
      const response = await fetch(`/api/cms/cards/${card.id}`, {
        method: 'DELETE'
      })

      const data: CMSApiResponse = await response.json()
      
      if (data.success) {
        onCardUpdate()
      } else {
        alert(data.error || 'Failed to delete card')
      }
    } catch (err) {
      alert('Failed to delete card')
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Chapter Details */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Chapter Details</h2>
        
        <form onSubmit={handleUpdateChapter} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editedChapter.title || ''}
                onChange={(e) => setEditedChapter({ ...editedChapter, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <input
                type="number"
                value={editedChapter.order || 1}
                onChange={(e) => setEditedChapter({ ...editedChapter, order: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editedChapter.description || ''}
              onChange={(e) => setEditedChapter({ ...editedChapter, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={editedChapter.published || false}
              onChange={(e) => setEditedChapter({ ...editedChapter, published: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              Published
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Chapter'}
          </button>
        </form>
      </div>

      {/* Cards Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Cards ({chapter.cards?.length || 0})
          </h3>
          <button
            onClick={handleCreateCard}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
          >
            Add Card
          </button>
        </div>

        {chapter.cards && chapter.cards.length > 0 ? (
          <div className="space-y-3">
            {chapter.cards.map((card, index) => (
              <div
                key={card.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={() => onCardSelect(card)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                      <h4 className="font-medium text-gray-900">
                        {card.text?.title || 'Untitled Card'}
                      </h4>
                      <div className="flex gap-1">
                        {card.text && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Text</span>}
                        {card.image && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Image</span>}
                        {card.video && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Video</span>}
                        {card.cta && <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">CTA</span>}
                      </div>
                    </div>
                    {card.text?.subtitle && (
                      <p className="text-sm text-gray-600 mb-1">{card.text.subtitle}</p>
                    )}
                    {card.text?.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{card.text.description}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCard(card)
                    }}
                    className="text-red-600 hover:text-red-800 p-1 ml-2"
                    title="Delete card"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No cards yet. Add your first card to get started.
          </div>
        )}
      </div>
    </div>
  )
}