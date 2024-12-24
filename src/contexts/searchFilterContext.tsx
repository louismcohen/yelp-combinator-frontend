import { createContext, Dispatch, useContext, useReducer } from 'react';
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

type FilterColor = 'green' | 'red' | 'purple' | 'blue';

type FilterType = 'open' | 'visited' | 'claimed';

interface Filter {
	type: FilterType;
	mode: FilterMode;
	color: FilterColor;
	trueIcon: React.ReactNode;
	falseIcon: React.ReactNode;
}

const initialFilterState: Record<FilterType, Filter> = {
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
		mode: FilterMode.True,
		color: 'blue',
		trueIcon: <FaHandshakeSimple />,
		falseIcon: <FaHandshakeSimpleSlash />,
	},
};

interface SearchFilterState {
	searchTerm: string;
	searchInputFocused: boolean;
	openFilter: Filter;
	visitedFilter: Filter;
	claimedFilter: Filter;
}

const initialSearchFilterState: SearchFilterState = {
	searchTerm: '',
	searchInputFocused: false,
	openFilter: initialFilterState.open,
	visitedFilter: initialFilterState.visited,
	claimedFilter: initialFilterState.claimed,
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

interface SearchFilterContext {
	state: SearchFilterState;
	dispatch: Dispatch<SearchFilterAction>;
}

export const SearchFilterContext = createContext<SearchFilterContext>({
	state: initialSearchFilterState,
	dispatch: () => undefined,
});

export const SearchFilterProvider = ({
	children,
}: SearchFilterProviderProps) => {
	const [state, dispatch]: [SearchFilterState, Dispatch<SearchFilterAction>] =
		useReducer(
			(
				state: SearchFilterState,
				action: SearchFilterAction,
			): SearchFilterState => {
				switch (action.type) {
					case 'SET_SEARCH_TERM':
						return { ...state, searchTerm: action.payload };
					case 'SET_SEARCH_INPUT_FOCUSED':
						return { ...state, searchInputFocused: action.payload };
					case 'SET_OPEN_FILTER':
						return {
							...state,
							openFilter: {
								...state.openFilter,
								mode: incrementFilterMode(state.openFilter.mode),
							},
						};
					case 'SET_VISITED_FILTER':
						return {
							...state,
							visitedFilter: {
								...state.visitedFilter,
								mode: incrementFilterMode(state.visitedFilter.mode),
							},
						};
					case 'SET_CLAIMED_FILTER':
						return {
							...state,
							claimedFilter: {
								...state.claimedFilter,
								mode: incrementFilterMode(state.claimedFilter.mode),
							},
						};
					default:
						return state;
				}
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
