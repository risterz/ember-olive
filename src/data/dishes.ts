export interface Dish {
  id: number
  number: string
  name: string
  description: string
  price: string
  image: string
}

// Unsplash images selected for Mediterranean food photography
export const signatureDishes: Dish[] = [
  {
    id: 1,
    number: '01',
    name: 'Charred Octopus',
    description: 'Smoked paprika · Lemon · Olive oil',
    price: 'RM 48',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=800&q=80',
  },
  {
    id: 2,
    number: '02',
    name: 'Ember Lamb',
    description: 'Rosemary · Garlic · Charred vegetables',
    price: 'RM 68',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
  },
  {
    id: 3,
    number: '03',
    name: 'Truffle Risotto',
    description: 'Wild mushroom · Parmesan · Black truffle',
    price: 'RM 58',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80',
  },
  {
    id: 4,
    number: '04',
    name: 'Burnt Fig Tart',
    description: 'Honey · Mascarpone · Pistachio',
    price: 'RM 32',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
  },
]
