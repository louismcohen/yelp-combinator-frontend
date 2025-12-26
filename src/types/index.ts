export interface Business {
	_id?: string;
	alias: string;
	note?: string;
	website?: string;
	addedIndex: number;
	url: string;
	lastUpdated: Date;
	visited: boolean;
	collectionId: string;
	geoPoint: {
		type: 'Point';
		coordinates: [number, number];
	};
	embedding?: number[];
	yelpData?: {
		name: string;
		image_url?: string;
		is_claimed: boolean;
		is_closed?: boolean;
		rating?: number;
		review_count?: number;
		price?: string;
		phone?: string;
		display_phone?: string;
		coordinates: {
			latitude: number;
			longitude: number;
		};
		location: Location;
		categories: Category[];
		photos: string[];
		hours?: BusinessHours[];
	};
}

export interface Location {
	address1: string;
	address2?: string;
	address3?: string;
	city: string;
	zip_code: string;
	country: string;
	state: string;
	display_address: string[];
	timezone: string;
}

export interface Coordinates {
	latitude: number;
	longitude: number;
}

export interface Category {
	alias: string;
	title: string;
	_id: string;
}

export interface BusinessHours {
	open: OpeningHours[];
}

export interface OpeningHours {
	is_overnight: boolean;
	start: string;
	end: string;
	day: number;
}

export enum MapService {
	GOOGLE = 'GOOGLE',
	MAPBOX = 'MAPBOX',
}

export interface ElementBounds {
	width: number;
	height: number;
	left: number;
	bottom: number;
}
