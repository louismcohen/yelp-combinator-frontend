import {
	createContext,
	Dispatch,
	useCallback,
	useContext,
	useReducer,
} from 'react';
import {
	FaDoorOpen,
	FaDoorClosed,
	FaCircleCheck,
	FaRegCircleCheck,
	FaHandshakeSimple,
	FaHandshakeSimpleSlash,
} from 'react-icons/fa6';

export enum FilterMode {
	Disabled = 0,
	True,
	False,
}

export type FilterColor = 'green' | 'red' | 'purple' | 'blue';

export type FilterType = 'open' | 'visited' | 'claimed';

export interface Filter {
	type: FilterType;
	mode: FilterMode;
	color: FilterColor;
	trueIcon: React.ReactNode;
	falseIcon: React.ReactNode;
}

export const initialFilterState: Record<FilterType, Filter> = {
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
	filters: Record<FilterType, Filter>;
	isReset: boolean;
}

const initialSearchFilterState: SearchFilterState = {
	searchTerm: '',
	searchInputFocused: false,
	filters: initialFilterState,
	isReset: true,
};

interface SearchFilterAction {
	type:
		| 'SET_SEARCH_TERM'
		| 'SET_SEARCH_INPUT_FOCUSED'
		| 'SET_OPEN_FILTER'
		| 'SET_VISITED_FILTER'
		| 'SET_CLAIMED_FILTER';
	payload?: any;
}

interface SearchFilterProviderProps {
	children: React.ReactNode;
}

const incrementFilterMode = (mode: FilterMode): FilterMode => (mode + 1) % 3;

export interface SearchFilterContext {
	state: SearchFilterState;
	dispatch: Dispatch<SearchFilterAction>;
}

export const SearchFilterContext = createContext<SearchFilterContext>({
	state: initialSearchFilterState,
	dispatch: () => undefined,
});

const determineIsReset = (state: SearchFilterState) => {
	const noSearchTerm = state.searchTerm === '';
	const noFilters = Object.values(state.filters).every(
		(filter) => filter.mode === FilterMode.Disabled,
	);

	return noSearchTerm && noFilters;
};

export const SearchFilterProvider = ({
	children,
}: SearchFilterProviderProps) => {
	const [state, dispatch]: [SearchFilterState, Dispatch<SearchFilterAction>] =
		useReducer(
			(
				state: SearchFilterState,
				action: SearchFilterAction,
			): SearchFilterState => {
				let updated: SearchFilterState;
				switch (action.type) {
					case 'SET_SEARCH_TERM':
						updated = { ...state, searchTerm: action.payload };
						break;
					case 'SET_SEARCH_INPUT_FOCUSED':
						updated = { ...state, searchInputFocused: action.payload };
						break;
					case 'SET_OPEN_FILTER':
						updated = {
							...state,
							filters: {
								...state.filters,
								open: {
									...state.filters.open,
									mode: incrementFilterMode(state.filters.open.mode),
								},
							},
						};
						break;
					case 'SET_VISITED_FILTER':
						updated = {
							...state,
							filters: {
								...state.filters,
								visited: {
									...state.filters.visited,
									mode: incrementFilterMode(state.filters.visited.mode),
								},
							},
						};
						break;
					case 'SET_CLAIMED_FILTER':
						updated = {
							...state,
							filters: {
								...state.filters,
								claimed: {
									...state.filters.claimed,
									mode: incrementFilterMode(state.filters.claimed.mode),
								},
							},
						};
						break;
					default:
						return state;
				}

				updated.isReset = determineIsReset(updated);
				return updated;
			},
			initialSearchFilterState,
		);

	return (
		<SearchFilterContext.Provider value={{ state, dispatch }}>
			{children}
		</SearchFilterContext.Provider>
	);
};

export const useSearchFilter = (): SearchFilterContext => {
	const context = useContext(SearchFilterContext);
	if (!context) {
		throw new Error(
			'useSearchFilter must be used within a SearchFilterProvider',
		);
	}
	return context;
};
