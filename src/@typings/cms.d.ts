// CMS Types for Ode Islands Content Management

export interface Chapter {
  id: string
  title: string
  description?: string
  order: number
  published: boolean
  createdAt: Date
  updatedAt: Date
  cards: Card[]
}

export interface Card {
  id: string
  chapterId: string
  order: number
  text?: {
    title?: string
    subtitle?: string
    description?: string
  }
  cta?: {
    title: string
    url: string
  }
  ctaStart?: string
  image?: {
    url: string
    width: number
    height: number
    alt?: string
  }
  video?: {
    type?: 'background' | 'immersive'
    url: string
    width: number
    height: number
    audio?: boolean
    poster?: string
  }
  theme?: {
    mix?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'
    shadow?: boolean
    background?: string
    overlay?: string
    invert?: boolean
    title?: string
    subtitle?: string
    description?: string
    cta?: string
    ctaStart?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface MediaAsset {
  id: string
  filename: string
  originalName: string
  path: string
  url: string
  mimeType: string
  size: number
  width?: number
  height?: number
  createdAt: Date
}

export interface CMSUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt: Date
  lastLogin?: Date
}

export interface CMSSession {
  id: string
  userId: string
  expiresAt: Date
  createdAt: Date
}

// API Request/Response types
export interface CreateChapterRequest {
  title: string
  description?: string
  order: number
}

export interface UpdateChapterRequest {
  title?: string
  description?: string
  order?: number
  published?: boolean
}

export interface CreateCardRequest {
  chapterId: string
  order: number
  text?: Card['text']
  cta?: Card['cta']
  ctaStart?: string
  image?: Card['image']
  video?: Card['video']
  theme?: Card['theme']
}

export interface UpdateCardRequest {
  order?: number
  text?: Card['text']
  cta?: Card['cta']
  ctaStart?: string
  image?: Card['image']
  video?: Card['video']
  theme?: Card['theme']
}

export interface CMSApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends CMSApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}