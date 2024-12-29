import {
	FaDoorOpen,
	FaDoorClosed,
	FaCircleCheck,
	FaRegCircleCheck,
	FaHandshakeSimple,
	FaHandshakeSimpleSlash,
} from 'react-icons/fa6';
import { create } from 'zustand';
import {
	FilterMode,
	FilterState,
	FilterType,
	FilterColor,
	SearchFilterState,
	SearchFilter,
} from '../types/searchFilter';

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
}));
