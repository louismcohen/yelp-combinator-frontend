import { useMemo } from 'react';
import type { Business } from '../../../types';
import { FilterMode } from '../../../types/searchFilter';
import type { AiSearch, FilterState } from '../../../types/searchFilter';
import { getBusinessHoursStatus } from '../../../utils/businessHours';

interface UseFilteredBusinessesParams {
	businesses: Business[] | undefined;
	debouncedSearchTerm: string;
	filters: FilterState;
	aiSearch: AiSearch;
	aiSearchEnabled: boolean;
	isFetching: boolean;
	selectedBusiness: Business | undefined;
	deselectBusiness: () => void;
}

export const useFilteredBusinesses = ({
	businesses,
	debouncedSearchTerm,
	filters,
	aiSearch,
	aiSearchEnabled,
	isFetching,
	selectedBusiness,
	deselectBusiness,
}: UseFilteredBusinessesParams) => {
	const filteredMarkers = useMemo(() => {
		if (!businesses || businesses.length === 0 || isFetching) return [];

		// Calculate isReset based on debouncedSearchTerm to prevent re-renders on every keystroke
		const noSearchTerm = debouncedSearchTerm === '';
		const noFilters = Object.values(filters).every(
			(filter) => filter.mode === FilterMode.Disabled,
		);
		const isResetDebounced = noSearchTerm && noFilters;

		if (isResetDebounced) return businesses;

		if (
			aiSearchEnabled &&
			debouncedSearchTerm !== '' &&
			aiSearch.query !== debouncedSearchTerm
		)
			return businesses;

		const filtered = businesses.reduce(
			(acc: Business[], business: Business) => {
				const isName = aiSearchEnabled
					? true
					: business.yelpData?.name
							.toLocaleLowerCase()
							.includes(debouncedSearchTerm.toLocaleLowerCase());
				const isNote = aiSearchEnabled
					? true
					: business?.note
							?.toLocaleLowerCase()
							.includes(debouncedSearchTerm.toLocaleLowerCase());
				const isCategory = aiSearchEnabled
					? 'categories' in aiSearch.searchConfig &&
					  business.yelpData?.categories.some((category) =>
							aiSearch.searchConfig.categories
								?.map((category: string) => category.toLocaleLowerCase())
								.includes(category.title.toLocaleLowerCase()),
					  )
					: business.yelpData?.categories.some((category) =>
							category.title
								.toLocaleLowerCase()
								.includes(debouncedSearchTerm.toLocaleLowerCase()),
					  );
				const isClosed = business.yelpData?.is_closed;

				const { isOpen } = getBusinessHoursStatus(business);
				const isVisited = business.visited;
				const isClaimed = business.yelpData?.is_claimed;

				const aiSearchResults =
					aiSearchEnabled &&
					debouncedSearchTerm !== '' &&
					aiSearch.query === debouncedSearchTerm
						? aiSearch.results.find((result) => result.alias === business.alias)
						: true;

				if (
					(isName || isNote || isCategory) &&
					!isClosed &&
					aiSearchResults &&
					(filters.open.mode === FilterMode.Disabled ||
						(filters.open.mode === FilterMode.True && isOpen) ||
						(filters.open.mode === FilterMode.False && !isOpen)) &&
					(filters.visited.mode === FilterMode.Disabled ||
						(filters.visited.mode === FilterMode.True && isVisited) ||
						(filters.visited.mode === FilterMode.False && !isVisited)) &&
					(filters.claimed.mode === FilterMode.Disabled ||
						(filters.claimed.mode === FilterMode.True && isClaimed) ||
						(filters.claimed.mode === FilterMode.False && !isClaimed))
				) {
					acc.push(business);
				} else {
					if (selectedBusiness?.alias === business.alias) {
						deselectBusiness();
					}
				}

				return acc;
			},
			[],
		);

		return filtered;
	}, [
		businesses,
		debouncedSearchTerm,
		filters,
		aiSearch,
		aiSearchEnabled,
		deselectBusiness,
		selectedBusiness?.alias,
		isFetching,
	]);

	return filteredMarkers;
};

