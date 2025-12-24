import type { MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import { useMap as useGoogleMap } from '@vis.gl/react-google-maps';
import type { BBox } from 'geojson';
import type { MapEvent } from 'mapbox-gl';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import { map } from 'motion/react-client';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { FaLocationArrow } from 'react-icons/fa6';
import { type MapRef, Marker, type ViewStateChangeEvent } from 'react-map-gl';
import Supercluster from 'supercluster';
import { useDebounce } from 'use-debounce';
import { useAiSearch } from '../hooks/useAiSearch';
import useBusinesses from '../hooks/useBusinesses';
import useLocation, { type LocationState } from '../hooks/useLocation';
import { useMapStore } from '../store/mapStore';
import { useSearchFilterStore } from '../store/searchFilterStore';
import { type Business, MapService } from '../types';
import { FilterMode } from '../types/searchFilter';
import { getBusinessHoursStatus } from '../utils/businessHours';
import { BusinessInfoWindow } from './BusinessInfoWindow/';
import { ClusterMarker } from './ClusterMarker';
import { DebugOverlay } from './DebugOverlay';
import { IconMarker } from './IconMarker/';
import { LoadingOverlay } from './LoadingOverlay';
import { GoogleMapScreen, MapboxMapScreen, getBbox } from './MapRender';
import { SearchBar } from './SearchBar';
import UserLocationMarker from './UserLocationMarker';

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
	lat: 34.04162072763611,
	lng: -118.26326182991187,
};

const DEFAULT_ZOOM = 13;

const OVERRIDE_USER_LOCATION =
	JSON.parse(import.meta.env.VITE_OVERRIDE_USER_LOCATION) ?? false;

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

interface CurrentLocationButtonProps {
	userLocation: LocationState;
	onClick: () => void;
}

const CurrentLocationButton = ({
	userLocation,
	onClick,
}: CurrentLocationButtonProps) => {
	if (
		userLocation.loading ||
		userLocation.error ||
		!userLocation.latitude ||
		!userLocation.longitude
	)
		return null;

	return (
		<motion.div className="absolute right-0 bottom-safe flex justify-center p-4 md:py-8">
			<motion.div
				className="flex justify-center rounded-full"
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.98 }}
			>
				<motion.button
					className="w-[48px] h-[48px] pop-in p-0 rounded-full shadow-lg hover:shadow-blue-500/25 bg-gray-50/90 backdrop-blur-sm hover:backdrop-blur-md border border-gray-950/10 active:border-blue-500/50 hover:border-blue-500/50 pointer-events-auto flex justify-center items-center text-gray-500 active:bg-blue-500/5 text-2xl outline:none focus:outline-none transition-all touch-manipulation overflow-hidden hover:text-blue-500 active:text-blue-500"
					onClick={onClick}
				>
					<div className="w-full h-full md:hover:bg-blue-500/5 active:bg-blue-500/5 flex justify-center items-center rounded-full">
						<FaLocationArrow />
					</div>
				</motion.button>
			</motion.div>
		</motion.div>
	);
};

const MapCenter = ({ mapService }: { mapService: MapService }) => {
	const { viewport, updateViewport } = useMapStore();
	const googleMap = mapService === MapService.GOOGLE && useGoogleMap();
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
	const userHasInteracted = useRef(false);
	const [bounds, setBounds] = useState<BBox>();
	const [zoom, setZoom] = useState<number>(
		mapService === MapService.GOOGLE ? DEFAULT_ZOOM : DEFAULT_ZOOM + 1,
	);
	const { data: businesses, isFetching } = useBusinesses();

	const [selectedBusiness, setSelectedBusiness] = useState<Business>();

	const {
		searchTerm,
		searchInputFocused,
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
	}, [userLocation, googleMap, mapService]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				deselectBusiness();
				updateSearchInputFocused(false);
			} else if (e.metaKey && e.key === 'k') {
				updateSearchInputFocused(true);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [updateSearchInputFocused]);

	const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
	const [debouncedBounds] = useDebounce(bounds, 300);
	const [debouncedZoom] = useDebounce(zoom, 300);

	const deselectBusiness = useCallback(
		() => setSelectedBusiness(undefined),
		[],
	);

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

	// useEffect(() => {
	// 	console.log('aiSearch', aiSearch);
	// }, [aiSearch]);

	const filteredMarkers = useMemo(() => {
		if (!businesses || businesses.length === 0 || isFetching) return [];

		if (isReset) return businesses;

		if (aiSearchEnabled && searchTerm !== '' && aiSearch.query !== searchTerm)
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
	}, [
		businesses,
		debouncedSearchTerm,
		filters,
		aiSearch,
		aiSearchEnabled,
		deselectBusiness,
		isReset,
		selectedBusiness?.alias,
		isFetching,
		searchTerm,
	]);

	const supercluster = useMemo(() => {
		const instance = new Supercluster({
			extent: mapService === MapService.GOOGLE ? 256 : 512,
			radius: import.meta.env.VITE_SUPERCLUSTER_RADIUS ?? 50,
			maxZoom: mapService === MapService.GOOGLE ? 15 : 15,
			minPoints: 2, // Minimum points to form a cluster
		});

		const points = filteredMarkers.map((business) => ({
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [
					business.yelpData?.coordinates.longitude,
					business.yelpData?.coordinates.latitude,
				],
			},
			properties: business,
		})) as Supercluster.PointFeature<Supercluster.AnyProps>[];

		// Load your points into the index
		instance.load(points);

		return instance;
	}, [filteredMarkers, mapService]);

	const clusters = useMemo(() => {
		if (!debouncedBounds || !supercluster || !debouncedZoom) return [];

		const clusters = supercluster.getClusters(
			debouncedBounds as BBox,
			Math.floor(debouncedZoom),
		);

		return clusters;
	}, [debouncedBounds, debouncedZoom, supercluster]);

	const handleClusterClick = useCallback(
		(cluster: Supercluster.ClusterFeature<Supercluster.AnyProps>) => {
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
		},
		[googleMap, mapService, supercluster],
	);

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
						onClick={() =>
							'cluster' in cluster.properties &&
							handleClusterClick(
								cluster as Supercluster.ClusterFeature<Supercluster.AnyProps>,
							)
						}
					/>
				);
			}
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
		});
	}, [
		clusters,
		selectedBusiness,
		handleClusterClick,
		handleMarkerPress,
		mapService,
	]);

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
	}
	if (mapService === MapService.MAPBOX) {
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
			[updateViewport],
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
					{renderMarkers}
					<UserLocationMarker
						mapService={mapService}
						userLocation={userLocation}
					/>
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
				<MapOverlay {...MapOverlayProps} />
				{/* <DebugOverlay title="User Location" message={userLocation.error} /> */}
				<div
					style={{
						position: 'absolute',
						bottom: 0,
						height: 'env(safe-area-inset-bottom)',
						width: '100vh',
						pointerEvents: 'auto',
						border: '1px red solid',
						backgroundColor: 'rgba(255,0,0,0.1)',
					}}
				/>
			</>
		);
	}
};

export default MapCenter;
