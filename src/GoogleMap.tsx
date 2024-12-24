import { Map, MapCameraChangedEvent, useMap } from '@vis.gl/react-google-maps';
import useMarkers from './hooks/useBusinesses';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Business } from './types';
import BusinessInfoWindow from './components/BusinessInfoWindow';
import SearchBar from './components/SearchBar';
import { AnimatePresence } from 'motion/react';
import { useDebounce } from 'use-debounce';
import IconMarker from './components/IconMarker';
import { FilterMode, useSearchFilter } from './contexts/searchFilterContext';
import { getBusinessHoursStatus } from './utils/businessHours';
import useBusinesses from './hooks/useBusinesses';

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
	lat: 34.04162072763611,
	lng: -118.26326182991187,
};

const GoogleMap = () => {
	const map = useMap();
	const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral>();
	const { query, mutation } = useBusinesses();
	const { data: businesses, isLoading } = query;
	const [selectedBusiness, setSelectedBusiness] = useState<Business>();

	const { state, dispatch } = useSearchFilter();

	map?.setClickableIcons(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				deselectBusiness();
				dispatch({ type: 'SET_SEARCH_INPUT_FOCUSED', payload: false });
			} else if (e.metaKey && e.key === 'k') {
				dispatch({ type: 'SET_SEARCH_INPUT_FOCUSED', payload: true });
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const [debouncedSearchTerm] = useDebounce(state?.searchTerm, 300);
	const [debouncedBounds] = useDebounce(bounds, 300);

	const deselectBusiness = () => setSelectedBusiness(undefined);

	const handleMarkerPress = useCallback((marker: Business) => {
		setSelectedBusiness(marker);
	}, []);

	const handleMapPress = () => {
		deselectBusiness();
		dispatch({ type: 'SET_SEARCH_INPUT_FOCUSED', payload: false });
	};

	const filteredMarkers = useMemo(() => {
		if (!businesses || businesses.length === 0 || isLoading) return [];

		if (state.isReset) return businesses;

		const filtered = businesses.reduce(
			(acc: Business[], business: Business) => {
				const isName = business.name
					.toLocaleLowerCase()
					.includes(debouncedSearchTerm.toLocaleLowerCase());
				const isNote =
					business?.note &&
					business?.note
						.toLocaleLowerCase()
						.includes(debouncedSearchTerm.toLocaleLowerCase());
				const isCategory = business.categories.some((category) =>
					category.title
						.toLocaleLowerCase()
						.includes(debouncedSearchTerm.toLocaleLowerCase()),
				);
				const isClosed = business.is_closed;

				const { isOpen } = getBusinessHoursStatus(business.hours);
				const isVisited = business.visited;
				const isClaimed = business.is_claimed;

				if (
					(isName || isNote || isCategory) &&
					!isClosed &&
					(state.filters.open.mode === FilterMode.Disabled ||
						(state.filters.open.mode === FilterMode.True && isOpen) ||
						(state.filters.open.mode === FilterMode.False && !isOpen)) &&
					(state.filters.visited.mode === FilterMode.Disabled ||
						(state.filters.visited.mode === FilterMode.True && isVisited) ||
						(state.filters.visited.mode === FilterMode.False && !isVisited)) &&
					(state.filters.claimed.mode === FilterMode.Disabled ||
						(state.filters.claimed.mode === FilterMode.True && isClaimed) ||
						(state.filters.claimed.mode === FilterMode.False && !isClaimed))
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
	}, [businesses, debouncedSearchTerm, state.filters]);

	const visibleMarkers = useMemo(() => {
		if (!debouncedBounds) return filteredMarkers;

		return filteredMarkers.filter((marker) => {
			return (
				marker.coordinates.latitude >= debouncedBounds.south &&
				marker.coordinates.latitude <= debouncedBounds.north &&
				marker.coordinates.longitude >= debouncedBounds.west &&
				marker.coordinates.longitude <= debouncedBounds.east
			);
		});
	}, [debouncedBounds, filteredMarkers]);

	useEffect(() => {
		if (businesses && businesses.length > 0 && selectedBusiness) {
			const selected = businesses.find(
				(business) => business.alias === selectedBusiness.alias,
			);
			if (!selected) {
				deselectBusiness();
			} else {
				setSelectedBusiness(selected);
			}
		}
	}, [businesses]);

	return (
		<Map
			className="w-screen h-screen outline-none focus:outline-none"
			mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
			defaultCenter={DEFAULT_CENTER}
			defaultZoom={14}
			gestureHandling="greedy"
			disableDefaultUI
			onClick={handleMapPress}
			onBoundsChanged={(e: MapCameraChangedEvent) => setBounds(e.detail.bounds)}
		>
			<AnimatePresence>
				{visibleMarkers.map((marker) => (
					<IconMarker
						key={marker.alias}
						business={marker}
						selected={selectedBusiness?.alias === marker.alias}
						onMarkerPress={handleMarkerPress}
					/>
				))}
			</AnimatePresence>
			<SearchBar />
			<AnimatePresence>
				{selectedBusiness && <BusinessInfoWindow business={selectedBusiness} />}
			</AnimatePresence>
		</Map>
	);
};

export default GoogleMap;
