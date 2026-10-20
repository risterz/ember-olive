export interface Experience {
  id: number
  title: string
  description: string
  image: string
}

export const experiences: Experience[] = [
  {
    id: 1,
    title: 'Dinner',
    description: 'An intimate Mediterranean dining experience shaped by seasonal ingredients and open fire.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
  },
  {
    id: 2,
    title: 'Private Events',
    description: 'Bespoke gatherings for up to 40 guests in our private dining room with a curated menu.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
  },
  {
    id: 3,
    title: "Chef's Table",
    description: 'A front-row seat to the kitchen. Six courses, guided by Chef Syifa, limited to 8 guests.',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=900&q=80',
  },
]
