"use client"

import { useState, useEffect } from 'react'
import { Card, Chapter, UpdateCardRequest, CMSApiResponse } from '@/@typings/cms'

interface CardEditorProps {
  card: Card
  chapter: Chapter | null
  onCardUpdate: () => void
  onClose: () => void
}

const THEME_MIX_OPTIONS = [
  'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 
  'color-dodge', 'color-burn', 'hard-light', 'soft-light', 
  'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
]

const VIDEO_TYPE_OPTIONS = [
  { value: 'background', label: 'Background' },
  { value: 'immersive', label: 'Immersive' }
]

export default function CardEditor({ card, chapter, onCardUpdate, onClose }: CardEditorProps) {
  const [editedCard, setEditedCard] = useState<UpdateCardRequest>({
    order: card.order,
    text: card.text || {},
    cta: card.cta || undefined,
    ctaStart: card.ctaStart || '',
    image: card.image || undefined,
    video: card.video || undefined,
    theme: card.theme || {}
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('text')

  useEffect(() => {
    setEditedCard({
      order: card.order,
      text: card.text || {},
      cta: card.cta || undefined,
      ctaStart: card.ctaStart || '',
      image: card.image || undefined,
      video: card.video || undefined,
      theme: card.theme || {}
    })
  }, [card])

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/cms/cards/${card.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedCard)
      })

      const data: CMSApiResponse = await response.json()
      
      if (data.success) {
        onCardUpdate()
      } else {
        alert(data.error || 'Failed to update card')
      }
    } catch (err) {
      alert('Failed to update card')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateText = (field: string, value: string) => {
    setEditedCard({
      ...editedCard,
      text: { ...editedCard.text, [field]: value }
    })
  }

  const updateCta = (field: string, value: string) => {
    if (!editedCard.cta) {
      setEditedCard({ ...editedCard, cta: { title: '', url: '' } })
    }
    setEditedCard({
      ...editedCard,
      cta: { ...editedCard.cta!, [field]: value }
    })
  }

  const updateImage = (field: string, value: string | number) => {
    if (!editedCard.image) {
      setEditedCard({ ...editedCard, image: { url: '', width: 1920, height: 1080 } })
    }
    setEditedCard({
      ...editedCard,
      image: { ...editedCard.image!, [field]: value }
    })
  }

  const updateVideo = (field: string, value: string | number | boolean) => {
    if (!editedCard.video) {
      setEditedCard({ ...editedCard, video: { url: '', width: 1920, height: 1080 } })
    }
    setEditedCard({
      ...editedCard,
      video: { ...editedCard.video!, [field]: value }
    })
  }

  const updateTheme = (field: string, value: string | boolean) => {
    setEditedCard({
      ...editedCard,
      theme: { ...editedCard.theme, [field]: value }
    })
  }

  const tabs = [
    { id: 'text', label: 'Text', active: activeTab === 'text' },
    { id: 'media', label: 'Media', active: activeTab === 'media' },
    { id: 'cta', label: 'CTA', active: activeTab === 'cta' },
    { id: 'theme', label: 'Theme', active: activeTab === 'theme' }
  ]

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Edit Card</h2>
          {chapter && (
            <p className="text-sm text-gray-600 mt-1">
              Chapter: {chapter.title} • Position: {card.order + 1}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                tab.active
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleUpdateCard} className="p-6">
        {/* Text Tab */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editedCard.text?.title || ''}
                onChange={(e) => updateText('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={editedCard.text?.subtitle || ''}
                onChange={(e) => updateText('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editedCard.text?.description || ''}
                onChange={(e) => updateText('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CTA Start Text
              </label>
              <input
                type="text"
                value={editedCard.ctaStart || ''}
                onChange={(e) => setEditedCard({ ...editedCard, ctaStart: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Begin Journey"
              />
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Image Section */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Image</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    value={editedCard.image?.url || ''}
                    onChange={(e) => updateImage('url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="image.jpg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width
                    </label>
                    <input
                      type="number"
                      value={editedCard.image?.width || 1920}
                      onChange={(e) => updateImage('width', parseInt(e.target.value) || 1920)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    <input
                      type="number"
                      value={editedCard.image?.height || 1080}
                      onChange={(e) => updateImage('height', parseInt(e.target.value) || 1080)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Video</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    value={editedCard.video?.url || ''}
                    onChange={(e) => updateVideo('url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="video-file"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={editedCard.video?.type || 'background'}
                    onChange={(e) => updateVideo('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {VIDEO_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width
                    </label>
                    <input
                      type="number"
                      value={editedCard.video?.width || 1920}
                      onChange={(e) => updateVideo('width', parseInt(e.target.value) || 1920)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    <input
                      type="number"
                      value={editedCard.video?.height || 1080}
                      onChange={(e) => updateVideo('height', parseInt(e.target.value) || 1080)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="audio"
                    checked={editedCard.video?.audio || false}
                    onChange={(e) => updateVideo('audio', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="audio" className="text-sm font-medium text-gray-700">
                    Has Audio
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Tab */}
        {activeTab === 'cta' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CTA Title
              </label>
              <input
                type="text"
                value={editedCard.cta?.title || ''}
                onChange={(e) => updateCta('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Continue to Chapter 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CTA URL
              </label>
              <input
                type="text"
                value={editedCard.cta?.url || ''}
                onChange={(e) => updateCta('url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/chapter-2"
              />
            </div>
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mix Blend Mode
                </label>
                <select
                  value={editedCard.theme?.mix || 'normal'}
                  onChange={(e) => updateTheme('mix', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {THEME_MIX_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <input
                  type="text"
                  value={editedCard.theme?.background || ''}
                  onChange={(e) => updateTheme('background', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#FBBAE0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overlay
                </label>
                <input
                  type="text"
                  value={editedCard.theme?.overlay || ''}
                  onChange={(e) => updateTheme('overlay', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="rgba(0, 0, 0, 0.4)"
                />
              </div>
              <div className="flex items-center space-x-4 pt-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="shadow"
                    checked={editedCard.theme?.shadow || false}
                    onChange={(e) => updateTheme('shadow', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="shadow" className="text-sm font-medium text-gray-700">
                    Shadow
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="invert"
                    checked={editedCard.theme?.invert || false}
                    onChange={(e) => updateTheme('invert', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="invert" className="text-sm font-medium text-gray-700">
                    Invert
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title Color
                </label>
                <input
                  type="text"
                  value={editedCard.theme?.title || ''}
                  onChange={(e) => updateTheme('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#37ffce"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle Color
                </label>
                <input
                  type="text"
                  value={editedCard.theme?.subtitle || ''}
                  onChange={(e) => updateTheme('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#FBBAE0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description Color
                </label>
                <input
                  type="text"
                  value={editedCard.theme?.description || ''}
                  onChange={(e) => updateTheme('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA Color
                </label>
                <input
                  type="text"
                  value={editedCard.theme?.cta || ''}
                  onChange={(e) => updateTheme('cta', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#E9F3E6"
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Card'}
          </button>
        </div>
      </form>
    </div>
  )
}