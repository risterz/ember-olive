export interface GalleryImage {
  id: number
  src: string
  alt: string
  caption: string
  size: 'large' | 'medium' | 'small'
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    alt: 'Elegant restaurant interior with warm lighting',
    caption: 'The Main Dining Room',
    size: 'large',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    alt: 'Beautifully plated Mediterranean dish',
    caption: 'Seasonal Tasting Menu',
    size: 'medium',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    alt: 'Restaurant bar area with ambient lighting',
    caption: 'The Copper Bar',
    size: 'small',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
    alt: 'Modern restaurant dining space',
    caption: 'Private Dining',
    size: 'medium',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    alt: 'Wood-fired oven with flames',
    caption: 'The Heart of Ember',
    size: 'large',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
    alt: 'Fresh Mediterranean ingredients on a table',
    caption: 'Farm to Table',
    size: 'small',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80',
    alt: 'Chef preparing dishes in the kitchen',
    caption: 'Behind the Pass',
    size: 'medium',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
    alt: 'Wine selection displayed on shelves',
    caption: 'The Wine Collection',
    size: 'small',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=900&q=80',
    alt: 'Outdoor terrace seating area at dusk',
    caption: 'Terrace at Dusk',
    size: 'large',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1432139509613-5c4255a1d000?w=800&q=80',
    alt: 'Close-up of a dessert with garnish',
    caption: 'Sweet Endings',
    size: 'medium',
  },
]
