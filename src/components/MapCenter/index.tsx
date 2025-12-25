import type { BBox } from 'geojson';
import type { MapEvent } from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MapRef, ViewStateChangeEvent } from 'react-map-gl';
import { useDebounce } from 'use-debounce';
import useBusinesses from '../../hooks/useBusinesses';
import useLocation, { type LocationState } from '../../hooks/useLocation';
import { useSearchFilterStore } from '../../store/searchFilterStore';
import type { Business } from '../../types';
import { MapboxMapScreen, getBbox } from '../MapRender';
import { SearchBar } from '../SearchBar';
import UserLocationMarker from '../UserLocationMarker';
import { CurrentLocationButton } from './components/CurrentLocationButton';
import { MapMarkers } from './components/MapMarkers';
import { MapOverlay } from './components/MapOverlay';
import { useClusterClick } from './hooks/useClusterClick';
import { useFilteredBusinesses } from './hooks/useFilteredBusinesses';
import { useMapInteractions } from './hooks/useMapInteractions';
import { useMapboxViewport } from './hooks/useMapboxViewport';
import { useSupercluster } from './hooks/useSupercluster';

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
	lat: 34.04162072763611,
	lng: -118.26326182991187,
};

const DEFAULT_ZOOM = 13;
const DEFAULT_DEBOUNCE = 300;

const OVERRIDE_USER_LOCATION =
	JSON.parse(import.meta.env.VITE_OVERRIDE_USER_LOCATION) ?? false;

const MapCenter = () => {
	const mapboxMapRef = useRef<MapRef>(null);
	const overrideLocation = OVERRIDE_USER_LOCATION
		? ({
				latitude: DEFAULT_CENTER.lat,
				longitude: DEFAULT_CENTER.lng,
				error: null,
				loading: false,
		  } as LocationState)
		: null;
	const userLocation = useLocation(overrideLocation);
	const [bounds, setBounds] = useState<BBox>();
	const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM + 1);
	const { data: businesses, isFetching } = useBusinesses();

	const [selectedBusiness, setSelectedBusiness] = useState<Business>();

	const {
		searchTerm,
		updateSearchInputFocused,
		filters,
		aiSearch,
		aiSearchEnabled,
	} = useSearchFilterStore();

	const [debouncedSearchTerm] = useDebounce(searchTerm, DEFAULT_DEBOUNCE);
	const [debouncedBounds] = useDebounce(bounds, DEFAULT_DEBOUNCE);
	const [debouncedZoom] = useDebounce(zoom, DEFAULT_DEBOUNCE);

	const deselectBusiness = useCallback(
		() => setSelectedBusiness(undefined),
		[],
	);

	const handleMarkerPress = useCallback((marker: Business) => {
		setSelectedBusiness(marker);
	}, []);

	const { handleMapPress, handleMapInitialInteraction } = useMapInteractions({
		userLocation,
		mapboxMapRef,
		deselectBusiness,
		updateSearchInputFocused,
	});

	const filteredMarkers = useFilteredBusinesses({
		businesses,
		debouncedSearchTerm,
		filters,
		aiSearch,
		aiSearchEnabled,
		isFetching,
		selectedBusiness,
		deselectBusiness,
	});

	const { supercluster, clusters } = useSupercluster({
		filteredMarkers,
		debouncedBounds,
		debouncedZoom,
	});

	const handleClusterClick = useClusterClick({
		mapboxMapRef,
		supercluster,
	});

	const checkAndUpdateViewport = useMapboxViewport();

	// Update selected business when businesses data changes
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
	}, [businesses, selectedBusiness, deselectBusiness]);

	const handleMapMoveEnd = (e: ViewStateChangeEvent) => {
		if (mapboxMapRef.current) {
			checkAndUpdateViewport(mapboxMapRef.current);
			setBounds(getBbox(mapboxMapRef.current));
			setZoom(e.viewState.zoom);
		}
	};

	const handleMapLoad = (m: MapEvent) => {
		if (mapboxMapRef.current) {
			checkAndUpdateViewport(mapboxMapRef.current);
			setBounds(getBbox(mapboxMapRef.current));
		}
	};

	return (
		<>
			<MapboxMapScreen
				defaultCenter={DEFAULT_CENTER}
				defaultZoom={DEFAULT_ZOOM}
				onClick={handleMapPress}
				onLoad={handleMapLoad}
				onMoveEnd={handleMapMoveEnd}
				onMove={handleMapInitialInteraction}
				ref={mapboxMapRef}
			>
				<SearchBar />
				<MapMarkers
					clusters={clusters}
					selectedBusiness={selectedBusiness}
					handleClusterClick={handleClusterClick}
					handleMarkerPress={handleMarkerPress}
				/>
				<UserLocationMarker userLocation={userLocation} />
			</MapboxMapScreen>
			<CurrentLocationButton
				userLocation={userLocation}
				onClick={() =>
					userLocation.latitude &&
					userLocation.longitude &&
					mapboxMapRef?.current?.flyTo({
						center: [userLocation.longitude, userLocation.latitude],
						maxDuration: 1000,
					})
				}
			/>
			<MapOverlay isFetching={isFetching} selectedBusiness={selectedBusiness} />
		</>
	);
};

export default MapCenter;
