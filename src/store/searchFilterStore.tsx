import {
	FaDoorOpen,
	FaDoorClosed,
	FaCircleCheck,
	FaRegCircleCheck,
	FaHandshakeSimple,
	FaHandshakeSimpleSlash,
} from 'react-icons/fa6';
import { create } from 'zustand';

export enum FilterMode {
	Disabled = 0,
	True,
	False,
}

const incrementFilterMode = (mode: FilterMode): FilterMode => (mode + 1) % 3;

export type FilterColor = 'green' | 'red' | 'purple' | 'blue';

export type FilterType = 'open' | 'visited' | 'claimed';

export interface Filter {
	type: FilterType;
	mode: FilterMode;
	color: FilterColor;
	trueIcon: React.ReactNode;
	falseIcon: React.ReactNode;
}

export type FilterState = Record<FilterType, Filter>;

export const initialFilterState: FilterState = {
	open: {
		type: 'open',
		mode: FilterMode.Disabled,
		color: 'purple',
		trueIcon: <FaDoorOpen />,
		falseIcon: <FaDoorClosed />,
	},
	visited: {
		type: 'visited',
		mode: FilterMode.Disabled,
		color: 'green',
		trueIcon: <FaCircleCheck />,
		falseIcon: <FaRegCircleCheck />,
	},
	claimed: {
		type: 'claimed',
		mode: FilterMode.Disabled,
		color: 'blue',
		trueIcon: <FaHandshakeSimple />,
		falseIcon: <FaHandshakeSimpleSlash />,
	},
};

export interface SearchFilterState {
	searchTerm: string;
	searchInputFocused: boolean;
	filters: FilterState;
	isReset: boolean;
}

const initialSearchFilterState: SearchFilterState = {
	searchTerm: '',
	searchInputFocused: false,
	filters: initialFilterState,
	isReset: true,
};

export interface SearchFilterActions {
	updateSearchTerm: (searchTerm: string) => void;
	updateSearchInputFocused: (focused: boolean) => void;
	updateFilter: (filterType: FilterType) => void;
	updateIsReset: (isReset: boolean) => void;
}

const determineIsReset = (state: SearchFilterState) => {
	const noSearchTerm = state.searchTerm === '';
	const noFilters = Object.values(state.filters).every(
		(filter) => filter.mode === FilterMode.Disabled,
	);

	return noSearchTerm && noFilters;
};

export type SearchFilter = SearchFilterState & SearchFilterActions;

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
}));
