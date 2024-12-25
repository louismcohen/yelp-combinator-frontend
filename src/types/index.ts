export interface Business {
  location: Location
  coordinates: Coordinates
  _id: string
  alias: string
  __v: number
  addedIndex: number
  createdAt: string
  note: string
  updatedAt: string
  yelpCollectionId: string
  categories: Category[]
  display_phone: string
  hours: BusinessHours[]
  image_url: string
  name: string
  phone: string
  photos: string[]
  rating: number
  review_count: number
  special_hours: any[]
  visited: boolean
  website: string
  is_claimed: boolean
  is_closed: boolean
}

export interface Location {
  address1: string
  address2: string
  address3: string
  city: string
  zip_code: string
  country: string
  state: string
  display_address: string[]
  timezone: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Category {
  alias: string
  title: string
  _id: string
}

export interface BusinessHours {
  open: OpeningHours[]
  hours_type: string
  is_open_now: boolean
  _id: string
}

export interface OpeningHours {
  is_overnight: boolean
  start: string
  end: string
  day: number
  _id: string
}

export enum MapProvider {
  Google = 'google',
  Mapbox = 'mapbox',
}