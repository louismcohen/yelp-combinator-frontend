import { Map, MapCameraChangedEvent, useMap } from '@vis.gl/react-google-maps';
import useMarkers from './hooks/useMarkers';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Business } from './types';
import BusinessInfoWindow from './components/BusinessInfoWindow';
import SearchBar from './components/SearchBar';
import { AnimatePresence } from 'motion/react';
import { useDebounce } from 'use-debounce';
import IconMarker from './components/IconMarker';
import { FilterMode, useSearchFilter } from './contexts/searchFilterContext';
import { getBusinessHoursStatus } from './utils/businessHours';

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
	lat: 34.04162072763611,
	lng: -118.26326182991187,
};

const GoogleMap = () => {
	const map = useMap();
	const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral>();
	const { data: businesses, isLoading } = useMarkers();
	const [selectedBusiness, setSelectedBusiness] = useState<Business>();
	const [searchTerm, setSearchTerm] = useState<string>('');
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [searchInputFocused, setSearchInputFocused] = useState<boolean>(false);

	const { state, dispatch } = useSearchFilter();

	map?.setClickableIcons(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				deselectBusiness();
				setSearchInputFocused(false);
			} else if (e.metaKey && e.key === 'k') {
				setSearchInputFocused(true);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const [debouncedSearchTerm] = useDebounce(state?.searchTerm, 300);
	const [debouncedBounds] = useDebounce(bounds, 300);

	const handleMarkerPress = useCallback((marker: Business) => {
		setSelectedBusiness(marker);
	}, []);

	const deselectBusiness = () => setSelectedBusiness(undefined);

	const filteredMarkers = useMemo(() => {
		if (!businesses || businesses.length === 0 || isLoading) return [];

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
					(state.openFilter.mode === FilterMode.Disabled ||
						(state.openFilter.mode === FilterMode.True && isOpen) ||
						(state.openFilter.mode === FilterMode.False && !isOpen)) &&
					(state.visitedFilter.mode === FilterMode.Disabled ||
						(state.visitedFilter.mode === FilterMode.True && isVisited) ||
						(state.visitedFilter.mode === FilterMode.False && !isVisited)) &&
					(state.claimedFilter.mode === FilterMode.Disabled ||
						(state.claimedFilter.mode === FilterMode.True && isClaimed) ||
						(state.claimedFilter.mode === FilterMode.False && !isClaimed))
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
		state.openFilter.mode,
		state.visitedFilter.mode,
		state.claimedFilter.mode,
	]);

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

	return (
		<Map
			className="w-screen h-screen outline-none focus:outline-none"
			mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
			defaultCenter={DEFAULT_CENTER}
			defaultZoom={14}
			gestureHandling="greedy"
			disableDefaultUI
			onClick={deselectBusiness}
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
			<SearchBar
				ref={searchInputRef}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				searchInputFocused={searchInputFocused}
				setSearchInputFocused={setSearchInputFocused}
			/>
			<AnimatePresence>
				{selectedBusiness && <BusinessInfoWindow business={selectedBusiness} />}
			</AnimatePresence>
		</Map>
	);
};

export default GoogleMap;
