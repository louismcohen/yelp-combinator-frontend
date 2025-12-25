import type { Business } from '.';

export enum FilterMode {
	Disabled = 0,
	True = 1,
	False = 2,
}

export enum FilterColor {
	Green = 'green',
	Red = 'red',
	Purple = 'purple',
	Blue = 'blue',
}

export enum FilterType {
	Open = 'open',
	Visited = 'visited',
	Claimed = 'claimed',
}

export interface Filter {
	type: FilterType;
	mode: FilterMode;
	color: FilterColor;
	trueIcon: React.ReactNode;
	falseIcon: React.ReactNode;
}

export interface AiSearchConfig {
	categories?: string[];
	textSearch?: string[];
	visited?: boolean;
	isClaimed?: boolean;
	shouldCheckHours?: boolean;
	useProximity?: boolean;
	location?: {
		near: [number, number];
		maxDistance?: number;
	};
	totalResults: number;
}

export interface AiSearch {
	query: string;
	results: Business[];
	searchConfig: AiSearchConfig;
}

export type FilterState = Record<FilterType, Filter>;
export interface SearchFilterState {
	searchTerm: string;
	searchInputFocused: boolean;
	filters: FilterState;
	isReset: boolean;
	aiSearch: AiSearch;
	aiSearchEnabled: boolean;
}
export interface SearchFilterActions {
	updateSearchTerm: (searchTerm: string) => void;
	updateSearchInputFocused: (focused: boolean) => void;
	updateFilter: (filterType: FilterType) => void;
	updateIsReset: (isReset: boolean) => void;
	resetFilters: () => void;
	updateAiSearch: (aiSearch: AiSearch) => void;
	updateAiSearchEnabled: (enabled: boolean) => void;
}

export type SearchFilter = SearchFilterState & SearchFilterActions;
