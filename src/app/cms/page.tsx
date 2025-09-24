"use client"

import { useState, useEffect } from 'react'
import { Chapter, Card, CMSApiResponse } from '@/@typings/cms'
import ChapterList from '@/components/cms/ChapterList'
import ChapterEditor from '@/components/cms/ChapterEditor'
import CardEditor from '@/components/cms/CardEditor'
import ExportButton from '@/components/cms/ExportButton'

export default function CMSPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all chapters
  const fetchChapters = async () => {
    try {
      const response = await fetch('/api/cms/chapters')
      const data: CMSApiResponse<Chapter[]> = await response.json()
      
      if (data.success && data.data) {
        setChapters(data.data)
      } else {
        setError(data.error || 'Failed to fetch chapters')
      }
    } catch (err) {
      setError('Failed to fetch chapters')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChapters()
  }, [])

  const handleChapterSelect = async (chapter: Chapter) => {
    try {
      const response = await fetch(`/api/cms/chapters/${chapter.id}`)
      const data: CMSApiResponse<Chapter> = await response.json()
      
      if (data.success && data.data) {
        setSelectedChapter(data.data)
        setSelectedCard(null)
      }
    } catch (err) {
      setError('Failed to fetch chapter details')
      console.error(err)
    }
  }

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card)
  }

  const handleChapterUpdate = () => {
    fetchChapters()
    if (selectedChapter) {
      handleChapterSelect(selectedChapter)
    }
  }

  const handleCardUpdate = () => {
    if (selectedChapter) {
      handleChapterSelect(selectedChapter)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading CMS...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Ode Islands CMS
            </h1>
            <ExportButton onExport={() => console.log('Content exported!')} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chapter List */}
          <div className="lg:col-span-1">
            <ChapterList
              chapters={chapters}
              selectedChapter={selectedChapter}
              onChapterSelect={handleChapterSelect}
              onChapterUpdate={handleChapterUpdate}
            />
          </div>

          {/* Chapter/Card Editor */}
          <div className="lg:col-span-2">
            {selectedCard ? (
              <CardEditor
                card={selectedCard}
                chapter={selectedChapter}
                onCardUpdate={handleCardUpdate}
                onClose={() => setSelectedCard(null)}
              />
            ) : selectedChapter ? (
              <ChapterEditor
                chapter={selectedChapter}
                onChapterUpdate={handleChapterUpdate}
                onCardSelect={handleCardSelect}
                onCardUpdate={handleCardUpdate}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                Select a chapter to start editing
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}