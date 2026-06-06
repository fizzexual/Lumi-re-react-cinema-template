import type { Cinema } from './types'

/**
 * Local cinema network. The template is brand-agnostic — rename these and the
 * wordmark in <Navbar/> to white-label for any operator.
 */
export const cinemas: Cinema[] = [
  {
    id: 'c1',
    name: 'Lumière Picturehouse',
    city: 'Riverside',
    area: 'Old Town',
    address: '14 Mercer Lane, Riverside RS1 4QP',
    distanceKm: 1.2,
    amenities: ['Recliner seats', 'Licensed bar', 'Step-free access', 'Hearing loop'],
    screens: 6,
    formats: ['Standard', 'IMAX', 'Dolby Atmos', 'Premium'],
    lat: 51.45,
    lng: -0.97,
  },
  {
    id: 'c2',
    name: 'Lumière Quayside',
    city: 'Riverside',
    area: 'Harbour District',
    address: '2 Saltworks Quay, Riverside RS3 9HB',
    distanceKm: 3.8,
    amenities: ['4DX', 'Dolby Atmos', 'Rooftop café', 'Parking'],
    screens: 9,
    formats: ['Standard', 'IMAX', '4DX', 'Dolby Atmos'],
    lat: 51.46,
    lng: -0.93,
  },
  {
    id: 'c3',
    name: 'Lumière Garden Square',
    city: 'Ashford',
    area: 'Garden Square',
    address: '88 Linden Walk, Ashford AS2 1RT',
    distanceKm: 9.1,
    amenities: ['35mm projection', 'Licensed bar', 'Independent programme', 'Step-free access'],
    screens: 3,
    formats: ['Standard', '35mm', 'Premium'],
    lat: 51.15,
    lng: -0.87,
  },
  {
    id: 'c4',
    name: 'Lumière Northgate',
    city: 'Ashford',
    area: 'Northgate Retail Park',
    address: 'Unit 4, Northgate Park, Ashford AS6 7DL',
    distanceKm: 12.4,
    amenities: ['Recliner seats', 'IMAX', 'Parking', 'Family screenings'],
    screens: 12,
    formats: ['Standard', 'IMAX', 'Dolby Atmos', '4DX', 'Premium'],
    lat: 51.18,
    lng: -0.82,
  },
]

export const cinemaById = (id: string) => cinemas.find((c) => c.id === id)

export const cities = Array.from(new Set(cinemas.map((c) => c.city))).sort()
