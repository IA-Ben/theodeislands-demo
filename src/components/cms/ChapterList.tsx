"use client"

import { useState } from 'react'
import { Chapter, CreateChapterRequest, CMSApiResponse } from '@/@typings/cms'

interface ChapterListProps {
  chapters: Chapter[]
  selectedChapter: Chapter | null
  onChapterSelect: (chapter: Chapter) => void
  onChapterUpdate: () => void
}

export default function ChapterList({ 
  chapters, 
  selectedChapter, 
  onChapterSelect, 
  onChapterUpdate 
}: ChapterListProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newChapter, setNewChapter] = useState<CreateChapterRequest>({
    title: '',
    description: '',
    order: chapters.length + 1
  })
  const [loading, setLoading] = useState(false)

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChapter.title.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/cms/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChapter)
      })

      const data: CMSApiResponse = await response.json()
      
      if (data.success) {
        setNewChapter({ title: '', description: '', order: chapters.length + 2 })
        setIsCreating(false)
        onChapterUpdate()
      } else {
        alert(data.error || 'Failed to create chapter')
      }
    } catch (err) {
      alert('Failed to create chapter')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteChapter = async (chapter: Chapter) => {
    if (!confirm(`Are you sure you want to delete "${chapter.title}"? This will also delete all associated cards.`)) {
      return
    }

    try {
      const response = await fetch(`/api/cms/chapters/${chapter.id}`, {
        method: 'DELETE'
      })

      const data: CMSApiResponse = await response.json()
      
      if (data.success) {
        onChapterUpdate()
        if (selectedChapter?.id === chapter.id) {
          // Clear selection if deleted chapter was selected
          window.location.reload()
        }
      } else {
        alert(data.error || 'Failed to delete chapter')
      }
    } catch (err) {
      alert('Failed to delete chapter')
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Chapters</h2>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            {isCreating ? 'Cancel' : 'New Chapter'}
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleCreateChapter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newChapter.title}
                onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chapter title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newChapter.description}
                onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chapter description"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <input
                type="number"
                value={newChapter.order}
                onChange={(e) => setNewChapter({ ...newChapter, order: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Chapter'}
            </button>
          </form>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              selectedChapter?.id === chapter.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div onClick={() => onChapterSelect(chapter)} className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">#{chapter.order}</span>
                  <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                  {chapter.published && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Published
                    </span>
                  )}
                </div>
                {chapter.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {chapter.description}
                  </p>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  {chapter.cards?.length || 0} cards
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteChapter(chapter)
                }}
                className="text-red-600 hover:text-red-800 p-1"
                title="Delete chapter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {chapters.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No chapters yet. Create your first chapter to get started.
        </div>
      )}
    </div>
  )
}