export interface WinePairing {
  wineName: string
  vintage: string
  region: string
  grape: string
  glassPrice: string
  bottlePrice: string
  profile: string[]
  pairingRationale: string
}

export interface CellarWine {
  id: string
  name: string
  vintage: string
  producer: string
  region: string
  country: string
  category: 'sparkling' | 'white' | 'skin-contact' | 'red' | 'sweet'
  grape: string
  alcohol: string
  price: string
  terroir: string
  notes: string
  pairedDish: string
}

// Curated Mediterranean Cellar Collection
export const cellarWines: CellarWine[] = [
  {
    id: 'wine-1',
    name: 'Santorini Assyrtiko',
    vintage: '2022',
    producer: 'Domaine Sigalas',
    region: 'Oia, Santorini',
    country: 'Greece',
    category: 'white',
    grape: '100% Assyrtiko (Centuries-Old Ungrafted Vines)',
    alcohol: '14.0%',
    price: 'RM 280',
    terroir: 'Volcanic pumice, black basalt, zero organic matter, intense maritime Aegean winds.',
    notes: 'Flint smoke, crushed sea shells, preserved lemon, razor-sharp salinity with crystalline length.',
    pairedDish: 'Charred Octopus & Pan-Seared Sea Bass',
  },
  {
    id: 'wine-2',
    name: 'Etna Rosso "Guardiola"',
    vintage: '2020',
    producer: 'Tenuta delle Terre Nere',
    region: 'Mount Etna, Sicily',
    country: 'Italy',
    category: 'red',
    grape: '98% Nerello Mascalese, 2% Nerello Cappuccio',
    alcohol: '13.5%',
    price: 'RM 360',
    terroir: 'Volcanic ash terraces situated at 850m elevation on the northern slopes of active Mount Etna.',
    notes: 'Wild red cherry, dried thyme, tobacco leaf, iron-rich mineral tension, and silky smoke tannins.',
    pairedDish: 'Ember Lamb & Wagyu Ribeye',
  },
  {
    id: 'wine-3',
    name: 'Prieuré de Saint-Jean de Bébian Blanc',
    vintage: '2021',
    producer: 'Domaine de Bébian',
    region: 'Languedoc-Roussillon',
    country: 'France',
    category: 'white',
    grape: 'Roussanne, Grenache Blanc, Marsanne, Clairette',
    alcohol: '13.5%',
    price: 'RM 240',
    terroir: 'Arid limestone scree and Mediterranean garrigue scrubland overlooking the Mediterranean.',
    notes: 'White peach, toasted almonds, wild fennel, beeswax, and a rich, texturally layered palate.',
    pairedDish: 'Charred Burrata & Lobster Linguine',
  },
  {
    id: 'wine-4',
    name: 'Viña Tondonia Reserva Tinto',
    vintage: '2011',
    producer: 'R. López de Heredia',
    region: 'Rioja Alta',
    country: 'Spain',
    category: 'red',
    grape: '75% Tempranillo, 15% Garnacha, 10% Graciano & Mazuelo',
    alcohol: '13.0%',
    price: 'RM 420',
    terroir: 'Alluvial limestone clay terraces along the Ebro river basin, aged 6 years in American oak.',
    notes: 'Dried cranberries, cedar chest, balsamic reduction, black tea leaves, and velvet acidity.',
    pairedDish: 'Lamb Chops & Pappardelle Ragu',
  },
  {
    id: 'wine-5',
    name: 'Bandol Rosé',
    vintage: '2022',
    producer: 'Domaine Tempier',
    region: 'Bandol, Provence',
    country: 'France',
    category: 'skin-contact',
    grape: '55% Mourvèdre, 25% Grenache, 20% Cinsault',
    alcohol: '13.5%',
    price: 'RM 290',
    terroir: 'Amphitheater clay-limestone terraced slopes directly facing the Mediterranean Sea.',
    notes: 'Blood orange peel, wild pomegranate, white pepper, rosemary garrigue, bone-dry mineral grip.',
    pairedDish: 'Tuna Tartare & Lamb Kofta',
  },
  {
    id: 'wine-6',
    name: 'Priorat "Les Terrasses"',
    vintage: '2021',
    producer: 'Álvaro Palacios',
    region: 'Gratallops, Priorat',
    country: 'Spain',
    category: 'red',
    grape: 'Garnacha, Cariñena (Old Steep Vines)',
    alcohol: '14.5%',
    price: 'RM 340',
    terroir: 'Black slate (llicorella) precipitous terraces subjected to scorching sun and dry mountain nights.',
    notes: 'Crushed blackberries, graphite minerality, lavender flowers, wild thyme, and deep volcanic warmth.',
    pairedDish: 'Slow-Roasted Chicken & Ember Lamb',
  },
  {
    id: 'wine-7',
    name: 'Franciacorta Satèn Brut Millesimato',
    vintage: '2019',
    producer: 'Ca del Bosco',
    region: 'Lombardy',
    country: 'Italy',
    category: 'sparkling',
    grape: '100% Chardonnay',
    alcohol: '12.5%',
    price: 'RM 310',
    terroir: 'Morainic gravelly hills shaped by ancient Alpine glaciers near Lake Iseo.',
    notes: 'Silky micro-bubbles, brioche crumb, roasted hazelnut, white blossoms, crisp golden apple acidity.',
    pairedDish: 'Whole Branzino & Truffle Risotto',
  },
  {
    id: 'wine-8',
    name: 'Samos Nectar Vin Doux Naturel',
    vintage: '2015',
    producer: 'UWC Samos',
    region: 'Island of Samos, Aegean',
    country: 'Greece',
    category: 'sweet',
    grape: '100% Muscat Blanc à Petits Grains',
    alcohol: '14.0%',
    price: 'RM 220',
    terroir: 'High altitude mountain terraces (800m) sun-dried for 10 days before slow barrel aging.',
    notes: 'Sun-dried apricot, candied bitter orange peel, wild mountain honey, cinnamon bark, walnut oils.',
    pairedDish: 'Burnt Fig Tart & Baklava',
  },
]
