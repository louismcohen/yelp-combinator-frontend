import type { BBox } from 'geojson';
import type { MapEvent } from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MapRef, ViewStateChangeEvent } from 'react-map-gl';
import { useDebounce } from 'use-debounce';
import useBusinesses from '../../hooks/useBusinesses';
import useLocation, { type LocationState } from '../../hooks/useLocation';
import { useSearchFilterStore } from '../../store/searchFilterStore';
import type { Business, ElementBounds } from '../../types';
import { MapboxMapScreen, getBbox } from '../MapRender';
import { SearchBar } from '../SearchBar';
import UserLocationMarker from '../UserLocationMarker';
import { CurrentLocationButton } from './components/CurrentLocationButton';
import { MapMarkers } from './components/MapMarkers';
import { MapOverlay } from './components/MapOverlay';
import {
	DEFAULT_CENTER,
	DEFAULT_DEBOUNCE,
	DEFAULT_ZOOM,
	MAX_MAP_ANIMATION_DURATION_MS,
	PAN_DELAY_MS,
} from './constants';
import { useClusterClick } from './hooks/useClusterClick';
import { useFilteredBusinesses } from './hooks/useFilteredBusinesses';
import { useMapInteractions } from './hooks/useMapInteractions';
import { useMapboxViewport } from './hooks/useMapboxViewport';
import { useMarkerPanning } from './hooks/useMarkerPanning';
import { useSupercluster } from './hooks/useSupercluster';

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
	const [infoWindowBounds, setInfoWindowBounds] =
		useState<ElementBounds | null>(null);

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
		deselectBusiness,
	});

	const checkAndUpdateViewport = useMapboxViewport();

	const panToKeepMarkerVisible = useMarkerPanning({
		mapboxMapRef,
	});

	const handleInfoWindowBoundsMeasured = useCallback(
		(bounds: ElementBounds) => {
			setInfoWindowBounds(bounds);
		},
		[],
	);

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

	// Pan map to keep marker visible when business is selected and bounds are measured
	useEffect(() => {
		if (
			selectedBusiness?.yelpData?.coordinates &&
			infoWindowBounds &&
			infoWindowBounds.height > 0 &&
			mapboxMapRef.current
		) {
			const { latitude, longitude } = selectedBusiness.yelpData.coordinates;
			// Use setTimeout to ensure the map is ready and measurements are complete
			const timeoutId = setTimeout(() => {
				panToKeepMarkerVisible(latitude, longitude, infoWindowBounds);
			}, PAN_DELAY_MS);

			return () => clearTimeout(timeoutId);
		}
	}, [selectedBusiness, infoWindowBounds, panToKeepMarkerVisible]);

	// Reset info window bounds when business is deselected
	useEffect(() => {
		if (!selectedBusiness) {
			setInfoWindowBounds(null);
		}
	}, [selectedBusiness]);

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
						maxDuration: MAX_MAP_ANIMATION_DURATION_MS,
					})
				}
			/>
			<MapOverlay
				isFetching={isFetching}
				selectedBusiness={selectedBusiness}
				onInfoWindowBoundsMeasured={handleInfoWindowBoundsMeasured}
			/>
		</>
	);
};

export default MapCenter;
