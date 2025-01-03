import { MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Business, MapService } from '../types';
import BusinessInfoWindow from './BusinessInfoWindow';
import SearchBar from './SearchBar';
import { AnimatePresence } from 'motion/react';
import { useDebounce } from 'use-debounce';
import IconMarker from './IconMarker';
import { FilterMode } from '../types/searchFilter';
import { getBusinessHoursStatus } from '../utils/businessHours';
import useBusinesses from '../hooks/useBusinesses';
import Supercluster from 'supercluster';
import ClusterMarker from './ClusterMarker';
import { MapRef, Marker, ViewStateChangeEvent } from 'react-map-gl';
import { getBbox, GoogleMapScreen, MapboxMapScreen } from './MapRender';
import { MapEvent } from 'mapbox-gl';
import { BBox } from 'geojson';
import { useMap as useGoogleMap } from '@vis.gl/react-google-maps';
import useLocation, { LocationState } from '../hooks/useLocation';
import UserLocationMarker from './UserLocationMarker';
import DebugOverlay from './DebugOverlay';
import LoadingOverlay from './LoadingOverlay';
import { useSearchFilterStore } from '../store/searchFilterStore';
import { useMapStore } from '../store/mapStore';
import { map } from 'motion/react-client';
import { useAiSearch } from '../hooks/useAiSearch';

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
	lat: 34.04162072763611,
	lng: -118.26326182991187,
};

const DEFAULT_ZOOM = 13;

const OVERRIDE_USER_LOCATION = true;

interface MapOverlayProps {
	isFetching: boolean;
	message?: string;
	selectedBusiness: Business | undefined;
}

const MapOverlay = React.memo(
	({ isFetching, message, selectedBusiness }: MapOverlayProps) => {
		return (
			<>
				<AnimatePresence>{isFetching && <LoadingOverlay />}</AnimatePresence>
				<AnimatePresence>
					{selectedBusiness && (
						<BusinessInfoWindow business={selectedBusiness} />
					)}
				</AnimatePresence>
			</>
		);
	},
);

const MapCenter = ({ mapService }: { mapService: MapService }) => {
	const { viewport, updateViewport } = useMapStore();
	const googleMap = mapService === MapService.GOOGLE && useGoogleMap();
	const mapboxMapRef = useRef<MapRef>(null);
	const userLocation = OVERRIDE_USER_LOCATION
		? ({
				latitude: DEFAULT_CENTER.lat,
				longitude: DEFAULT_CENTER.lng,
				error: null,
				loading: false,
		  } as LocationState)
		: useLocation();
	// const userLocation: LocationState = {
	// 	latitude: DEFAULT_CENTER.lat,
	// 	longitude: DEFAULT_CENTER.lng,
	// 	error: null,
	// 	loading: false,
	// };
	const userHasInteracted = useRef(false);
	const [bounds, setBounds] = useState<BBox>();
	const [zoom, setZoom] = useState<number>(
		mapService === MapService.GOOGLE ? DEFAULT_ZOOM : DEFAULT_ZOOM + 1,
	);
	const { data: businesses, isFetching } = useBusinesses();
	const [selectedBusiness, setSelectedBusiness] = useState<Business>();

	const {
		searchTerm,
		updateSearchInputFocused,
		isReset,
		filters,
		aiSearch,
		aiSearchEnabled,
	} = useSearchFilterStore();

	const mutation = useAiSearch();

	useEffect(() => {
		if (
			!userLocation.loading &&
			userLocation.latitude &&
			userLocation.longitude &&
			!userHasInteracted.current
		) {
			if (mapService === MapService.GOOGLE) {
				if (googleMap) {
					googleMap.panTo({
						lat: userLocation.latitude,
						lng: userLocation.longitude,
					});
					googleMap.setZoom(DEFAULT_ZOOM);
				}
			} else if (mapService === MapService.MAPBOX) {
				if (mapboxMapRef.current) {
					const map = mapboxMapRef.current;
					map.flyTo({
						center: [userLocation.longitude, userLocation.latitude],
						zoom: DEFAULT_ZOOM,
						maxDuration: 1000,
					});
				}
			}
		}
	}, [userLocation]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				deselectBusiness();
				updateSearchInputFocused(false);
			} else if (e.metaKey && e.key === 'k') {
				updateSearchInputFocused(true);
			} else if (e.key === 'Enter') {
				if (searchTerm !== '' && aiSearchEnabled) {
					mutation.mutate({ query: searchTerm, viewport });
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
	const [debouncedBounds] = useDebounce(bounds, 300);
	const [debouncedZoom] = useDebounce(zoom, 300);

	const deselectBusiness = () => setSelectedBusiness(undefined);

	const handleMarkerPress = useCallback((marker: Business) => {
		setSelectedBusiness(marker);
	}, []);

	const handleMapPress = () => {
		deselectBusiness();
		updateSearchInputFocused(false);
	};

	const handleMapInitialInteraction = () => {
		userHasInteracted.current = true;
	};

	useEffect(() => {
		console.log('aiSearch', aiSearch);
	}, [aiSearch]);

	const filteredMarkers = useMemo(() => {
		if (!businesses || businesses.length === 0 || isFetching) return [];

		if (isReset) return businesses;

		if (aiSearchEnabled && searchTerm !== '' && aiSearch.query !== searchTerm)
			return businesses;

		const filtered = businesses.reduce(
			(acc: Business[], business: Business) => {
				const isName = aiSearchEnabled
					? true
					: business.name
							.toLocaleLowerCase()
							.includes(debouncedSearchTerm.toLocaleLowerCase());
				const isNote = aiSearchEnabled
					? true
					: business?.note &&
					  business?.note
							.toLocaleLowerCase()
							.includes(debouncedSearchTerm.toLocaleLowerCase());
				const isCategory = aiSearchEnabled
					? 'categories' in aiSearch.searchConfig &&
					  business.categories.some((category) =>
							aiSearch.searchConfig.categories
								?.map((category: string) => category.toLocaleLowerCase())
								.includes(category.title.toLocaleLowerCase()),
					  )
					: business.categories.some((category) =>
							category.title
								.toLocaleLowerCase()
								.includes(debouncedSearchTerm.toLocaleLowerCase()),
					  );
				const isClosed = business.is_closed;

				const { isOpen } = getBusinessHoursStatus(business);
				const isVisited = business.visited;
				const isClaimed = business.is_claimed;

				const aiSearchResults =
					aiSearchEnabled && searchTerm !== '' && aiSearch.query === searchTerm
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
	}, [businesses, debouncedSearchTerm, filters, aiSearch, aiSearchEnabled]);

	const supercluster = useMemo(() => {
		const instance = new Supercluster({
			extent: mapService === MapService.GOOGLE ? 256 : 512,
			radius: 50,
			maxZoom: mapService === MapService.GOOGLE ? 15 : 15,
			minPoints: 2, // Minimum points to form a cluster
		});

		const points = filteredMarkers.map((business) => ({
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [
					business.coordinates.longitude,
					business.coordinates.latitude,
				],
			},
			properties: business,
		})) as Supercluster.PointFeature<Supercluster.AnyProps>[];

		// Load your points into the index
		instance.load(points);

		return instance;
	}, [filteredMarkers]);

	const clusters = useMemo(() => {
		if (!debouncedBounds || !supercluster || !debouncedZoom) return [];

		const clusters = supercluster.getClusters(
			debouncedBounds as BBox,
			Math.floor(debouncedZoom),
		);

		return clusters;
	}, [debouncedBounds, debouncedZoom, supercluster]);

	const handleClusterClick = (cluster: Supercluster.ClusterFeature<any>) => {
		const [longitude, latitude] = cluster.geometry.coordinates;

		// Get the cluster expansion zoom
		const expansionZoom = Math.min(
			supercluster.getClusterExpansionZoom(cluster.properties.cluster_id),
			20,
		);

		if (mapService === MapService.GOOGLE) {
			if (googleMap) {
				googleMap.panTo({ lat: latitude, lng: longitude });
				googleMap.setZoom(expansionZoom);
			}
		} else if (mapService === MapService.MAPBOX) {
			if (mapboxMapRef.current) {
				const map = mapboxMapRef.current;
				map.flyTo({
					center: [longitude, latitude],
					zoom: expansionZoom,
				});
			}
		}
	};

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

	const renderMarkers = useMemo(() => {
		return clusters.map((cluster) => {
			const [longitude, latitude] = cluster.geometry.coordinates;
			const { cluster: isCluster, point_count: pointCount } =
				cluster.properties;

			if (isCluster) {
				return (
					<ClusterMarker
						mapService={mapService}
						key={cluster.id}
						latitude={latitude}
						longitude={longitude}
						points={pointCount}
						onClick={() => handleClusterClick(cluster)}
					/>
				);
			} else {
				const marker = cluster.properties as Business;
				return (
					<IconMarker
						mapService={mapService}
						key={marker.alias}
						business={marker}
						selected={selectedBusiness?.alias === marker.alias}
						onMarkerPress={handleMarkerPress}
					/>
				);
			}
		});
	}, [clusters, selectedBusiness?.alias]);

	const MapOverlayProps = {
		isFetching,
		selectedBusiness,
		message: 'Test alert',
	};

	if (mapService === MapService.GOOGLE) {
		return (
			<GoogleMapScreen
				defaultCenter={DEFAULT_CENTER}
				defaultZoom={DEFAULT_ZOOM}
				onBoundsChanged={(e: MapCameraChangedEvent) => {
					setBounds([
						e.detail.bounds.west,
						e.detail.bounds.south,
						e.detail.bounds.east,
						e.detail.bounds.north,
					]);
					setZoom(e.detail.zoom);
				}}
				onClick={handleMapPress}
				onMove={handleMapInitialInteraction}
			>
				<MapOverlay {...MapOverlayProps} />
			</GoogleMapScreen>
		);
	} else if (mapService === MapService.MAPBOX) {
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

		const checkAndUpdateViewport = useCallback(
			(mapRef: MapRef) => {
				if (mapRef) {
					const southwest = mapRef.getBounds()?.getSouthWest().toArray();
					const northeast = mapRef.getBounds()?.getNorthEast().toArray();
					if (southwest && northeast) {
						updateViewport({ southwest, northeast });
					}
				}
			},
			[mapboxMapRef],
		);

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
					<UserLocationMarker
						mapService={mapService}
						userLocation={userLocation}
					/>
					{renderMarkers}
				</MapboxMapScreen>
				<MapOverlay {...MapOverlayProps} />
				<DebugOverlay title="User Location" message={userLocation.error} />
			</>
		);
	}
};

export default MapCenter;
