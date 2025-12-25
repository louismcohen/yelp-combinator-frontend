import {
	FaCircleCheck,
	FaDoorClosed,
	FaDoorOpen,
	FaHandshakeSimple,
	FaHandshakeSimpleSlash,
	FaRegCircleCheck,
} from 'react-icons/fa6';
import { create } from 'zustand';
import { FilterColor, FilterMode, FilterType } from '../types/searchFilter';
import type {
	FilterState,
	SearchFilter,
	SearchFilterState,
} from '../types/searchFilter';

const USE_AI_SEARCH_DEFAULT = import.meta.env.VITE_USE_AI_SEARCH_DEFAULT === 'true';

const incrementFilterMode = (mode: FilterMode): FilterMode => (mode + 1) % 3;

export const initialFilterState: FilterState = {
	open: {
		type: FilterType.Open,
		mode: FilterMode.Disabled,
		color: FilterColor.Purple,
		trueIcon: <FaDoorOpen />,
		falseIcon: <FaDoorClosed />,
	},
	visited: {
		type: FilterType.Visited,
		mode: FilterMode.Disabled,
		color: FilterColor.Green,
		trueIcon: <FaCircleCheck />,
		falseIcon: <FaRegCircleCheck />,
	},
	claimed: {
		type: FilterType.Claimed,
		mode: FilterMode.Disabled,
		color: FilterColor.Blue,
		trueIcon: <FaHandshakeSimple />,
		falseIcon: <FaHandshakeSimpleSlash />,
	},
};

const initialSearchFilterState: SearchFilterState = {
	searchTerm: '',
	searchInputFocused: false,
	filters: initialFilterState,
	isReset: true,
	aiSearch: {
		query: '',
		results: [],
		searchConfig: {
			totalResults: 0,
		},
	},
	aiSearchEnabled: USE_AI_SEARCH_DEFAULT,
};

const determineIsReset = (state: SearchFilterState) => {
	const noSearchTerm = state.searchTerm === '';
	const noFilters = Object.values(state.filters).every(
		(filter) => filter.mode === FilterMode.Disabled,
	);

	return noSearchTerm && noFilters;
};

export const useSearchFilterStore = create<SearchFilter>()((set) => ({
	...initialSearchFilterState,
	updateSearchTerm: (searchTerm) =>
		set((state) => ({
			...state,
			searchTerm,
			isReset: determineIsReset({ ...state, searchTerm }),
		})),
	updateSearchInputFocused: (searchInputFocused) =>
		set((state) => ({ ...state, searchInputFocused })),
	updateFilter: (filterType) =>
		set((state) => {
			const updatedFilters = { ...state.filters };
			updatedFilters[filterType].mode = incrementFilterMode(
				updatedFilters[filterType].mode,
			);
			return {
				...state,
				filters: updatedFilters,
				isReset: determineIsReset({ ...state, filters: updatedFilters }),
			};
		}),
	updateIsReset: (isReset) => set((state) => ({ ...state, isReset })),
	resetFilters: () =>
		set((state) => {
			const updatedFilters = { ...state.filters };
			updatedFilters.open.mode = FilterMode.Disabled;
			updatedFilters.visited.mode = FilterMode.Disabled;
			updatedFilters.claimed.mode = FilterMode.Disabled;
			return {
				...state,
				searchTerm: '',
				filters: updatedFilters,
				aiSearch: { ...initialSearchFilterState.aiSearch },
				isReset: true,
			};
		}),
	updateAiSearch: (aiSearch) =>
		set((state) => {
			const updatedFilters = { ...state.filters };
			if (state.aiSearchEnabled) {
				if ('visited' in aiSearch.searchConfig) {
					updatedFilters.visited.mode = aiSearch.searchConfig.visited
						? FilterMode.True
						: FilterMode.False;
				}
				if ('isClaimed' in aiSearch.searchConfig) {
					updatedFilters.claimed.mode = aiSearch.searchConfig.isClaimed
						? FilterMode.True
						: FilterMode.False;
				}
				if ('shouldCheckHours' in aiSearch.searchConfig) {
					updatedFilters.open.mode = aiSearch.searchConfig.shouldCheckHours
						? FilterMode.True
						: FilterMode.False;
				}
			}
			return { ...state, filters: updatedFilters, aiSearch: aiSearch };
		}),
	updateAiSearchEnabled: (aiSearchEnabled) =>
		set((state) => ({ ...state, aiSearchEnabled })),
}));
