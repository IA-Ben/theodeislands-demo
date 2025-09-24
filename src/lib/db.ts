// Simple file-based database for CMS
// In production, this should be replaced with a proper database like PostgreSQL

import fs from 'fs/promises'
import path from 'path'
import { Chapter, Card, MediaAsset, CMSUser } from '@/@typings/cms'

const DATA_DIR = path.join(process.cwd(), 'data/cms')
const CHAPTERS_FILE = path.join(DATA_DIR, 'chapters.json')
const CARDS_FILE = path.join(DATA_DIR, 'cards.json')
const MEDIA_FILE = path.join(DATA_DIR, 'media.json')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Generic file operations
async function readJsonFile<T>(filePath: string, defaultValue: T[]): Promise<T[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return defaultValue
  }
}

async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

// Chapter operations
export async function getAllChapters(): Promise<Chapter[]> {
  return readJsonFile<Chapter>(CHAPTERS_FILE, [])
}

export async function getChapterById(id: string): Promise<Chapter | null> {
  const chapters = await getAllChapters()
  return chapters.find(c => c.id === id) || null
}

export async function createChapter(data: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt' | 'cards'>): Promise<Chapter> {
  const chapters = await getAllChapters()
  const newChapter: Chapter = {
    ...data,
    id: `chapter-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    cards: []
  }
  chapters.push(newChapter)
  await writeJsonFile(CHAPTERS_FILE, chapters)
  return newChapter
}

export async function updateChapter(id: string, data: Partial<Omit<Chapter, 'id' | 'createdAt' | 'cards'>>): Promise<Chapter | null> {
  const chapters = await getAllChapters()
  const index = chapters.findIndex(c => c.id === id)
  if (index === -1) return null
  
  chapters[index] = {
    ...chapters[index],
    ...data,
    updatedAt: new Date()
  }
  await writeJsonFile(CHAPTERS_FILE, chapters)
  return chapters[index]
}

export async function deleteChapter(id: string): Promise<boolean> {
  const chapters = await getAllChapters()
  const index = chapters.findIndex(c => c.id === id)
  if (index === -1) return false
  
  chapters.splice(index, 1)
  await writeJsonFile(CHAPTERS_FILE, chapters)
  
  // Also delete associated cards
  const cards = await getAllCards()
  const remainingCards = cards.filter(c => c.chapterId !== id)
  await writeJsonFile(CARDS_FILE, remainingCards)
  
  return true
}

// Card operations
export async function getAllCards(): Promise<Card[]> {
  return readJsonFile<Card>(CARDS_FILE, [])
}

export async function getCardsByChapter(chapterId: string): Promise<Card[]> {
  const cards = await getAllCards()
  return cards.filter(c => c.chapterId === chapterId).sort((a, b) => a.order - b.order)
}

export async function getCardById(id: string): Promise<Card | null> {
  const cards = await getAllCards()
  return cards.find(c => c.id === id) || null
}

export async function createCard(data: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> {
  const cards = await getAllCards()
  const newCard: Card = {
    ...data,
    id: `card-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  cards.push(newCard)
  await writeJsonFile(CARDS_FILE, cards)
  return newCard
}

export async function updateCard(id: string, data: Partial<Omit<Card, 'id' | 'createdAt'>>): Promise<Card | null> {
  const cards = await getAllCards()
  const index = cards.findIndex(c => c.id === id)
  if (index === -1) return null
  
  cards[index] = {
    ...cards[index],
    ...data,
    updatedAt: new Date()
  }
  await writeJsonFile(CARDS_FILE, cards)
  return cards[index]
}

export async function deleteCard(id: string): Promise<boolean> {
  const cards = await getAllCards()
  const index = cards.findIndex(c => c.id === id)
  if (index === -1) return false
  
  cards.splice(index, 1)
  await writeJsonFile(CARDS_FILE, cards)
  return true
}

export async function reorderCards(chapterId: string, cardIds: string[]): Promise<boolean> {
  const cards = await getAllCards()
  const chapterCards = cards.filter(c => c.chapterId === chapterId)
  
  // Update order based on new positions
  cardIds.forEach((cardId, index) => {
    const card = chapterCards.find(c => c.id === cardId)
    if (card) {
      card.order = index
      card.updatedAt = new Date()
    }
  })
  
  await writeJsonFile(CARDS_FILE, cards)
  return true
}

// Media operations
export async function getAllMedia(): Promise<MediaAsset[]> {
  return readJsonFile<MediaAsset>(MEDIA_FILE, [])
}

export async function createMediaAsset(data: Omit<MediaAsset, 'id' | 'createdAt'>): Promise<MediaAsset> {
  const media = await getAllMedia()
  const newAsset: MediaAsset = {
    ...data,
    id: `media-${Date.now()}`,
    createdAt: new Date()
  }
  media.push(newAsset)
  await writeJsonFile(MEDIA_FILE, media)
  return newAsset
}

// Export functions for syncing with main data file
export async function exportToMainDataFile(): Promise<void> {
  const chapters = await getAllChapters()
  const publishedChapters = chapters.filter(c => c.published).sort((a, b) => a.order - b.order)
  
  const exportData: { [key: string]: any[] } = {}
  
  for (const chapter of publishedChapters) {
    const cards = await getCardsByChapter(chapter.id)
    const formattedCards = cards.map(card => {
      // Convert CMS format to original format
      const formatted: any = {}
      if (card.text) formatted.text = card.text
      if (card.cta) formatted.cta = card.cta
      if (card.ctaStart) formatted.ctaStart = card.ctaStart
      if (card.image) formatted.image = card.image
      if (card.video) formatted.video = card.video
      if (card.theme) formatted.theme = card.theme
      return formatted
    })
    
    exportData[`chapter-${chapter.order}`] = formattedCards
  }
  
  const mainDataPath = path.join(process.cwd(), 'src/app/data/ode-islands.json')
  await fs.writeFile(mainDataPath, JSON.stringify(exportData, null, 2))
}