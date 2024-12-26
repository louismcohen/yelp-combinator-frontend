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
import { AnimatePresence, motion } from 'motion/react';
import { useDebounce } from 'use-debounce';
import IconMarker from './IconMarker';
import { FilterMode, useSearchFilter } from '../contexts/searchFilterContext';
import { getBusinessHoursStatus } from '../utils/businessHours';
import useBusinesses from '../hooks/useBusinesses';
import { CircleLoader, GridLoader } from 'react-spinners';
import Supercluster from 'supercluster';
import ClusterMarker from './ClusterMarker';
import { MapRef, Marker, ViewStateChangeEvent } from 'react-map-gl';
import { getBbox, GoogleMapScreen, MapboxMapScreen } from './MapRender';
import { MapEvent } from 'mapbox-gl';
import { BBox } from 'geojson';
import { useMap as useGoogleMap } from '@vis.gl/react-google-maps';

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
	lat: 34.04162072763611,
	lng: -118.26326182991187,
};

const DEFAULT_ZOOM = 14;

const LoadingOverlay = () => {
	return (
		<motion.div
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="fixed inset-0 flex flex-col gap-2 justify-center items-center bg-black/65 z-50"
		>
			{/* <CircleLoader color="#fff" size={48} /> */}
			<GridLoader color="#fff" size={12} />
			<p className="text-gray-50 text-lg">Loading businesses</p>
		</motion.div>
	);
};

interface MapContentsProps {
	isFetching: boolean;
	renderMarkers: React.ReactNode;
	selectedBusiness: Business | undefined;
}

const MapContents = React.memo(
	({ isFetching, renderMarkers, selectedBusiness }: MapContentsProps) => {
		return (
			<>
				<AnimatePresence>
					{isFetching && <LoadingOverlay />}
					{renderMarkers}
				</AnimatePresence>
				<SearchBar />
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
	const googleMap = mapService === MapService.GOOGLE && useGoogleMap();
	const mapboxMapRef = useRef<MapRef>(null);
	const [bounds, setBounds] = useState<BBox>();
	const [zoom, setZoom] = useState<number>(
		mapService === MapService.GOOGLE ? DEFAULT_ZOOM : DEFAULT_ZOOM + 1,
	);
	const { data: businesses, isFetching } = useBusinesses();
	const [selectedBusiness, setSelectedBusiness] = useState<Business>();

	const { state, dispatch } = useSearchFilter();

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
	const [debouncedZoom] = useDebounce(zoom, 300);

	const deselectBusiness = () => setSelectedBusiness(undefined);

	const handleMarkerPress = useCallback((marker: Business) => {
		setSelectedBusiness(marker);
	}, []);

	const handleMapPress = () => {
		deselectBusiness();
		dispatch({ type: 'SET_SEARCH_INPUT_FOCUSED', payload: false });
	};

	const filteredMarkers = useMemo(() => {
		if (!businesses || businesses.length === 0 || isFetching) return [];

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

				const { isOpen } = getBusinessHoursStatus(business);
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

	const supercluster = useMemo(() => {
		const instance = new Supercluster({
			extent: mapService === MapService.GOOGLE ? 256 : 512,
			radius: 50,
			maxZoom: mapService === MapService.GOOGLE ? 15 : 16,
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
		console.log('cluster clicked', cluster);
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
					// speed: 1.5,
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

	const mapContentsProps = {
		isFetching,
		renderMarkers,
		selectedBusiness,
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
				handleMapPress={handleMapPress}
			>
				<MapContents {...mapContentsProps} />
			</GoogleMapScreen>
		);
	} else if (mapService === MapService.MAPBOX) {
		const handleMapMoveEnd = (e: ViewStateChangeEvent) => {
			if (mapboxMapRef.current) {
				setBounds(getBbox(mapboxMapRef.current));
				console.log('zoom', e.viewState.zoom);
				setZoom(e.viewState.zoom);
			}
		};

		const handleMapLoad = (m: MapEvent) => {
			if (mapboxMapRef.current) {
				setBounds(getBbox(mapboxMapRef.current));
			}
		};

		return (
			<MapboxMapScreen
				defaultCenter={DEFAULT_CENTER}
				defaultZoom={DEFAULT_ZOOM}
				handleMapPress={handleMapPress}
				onLoad={handleMapLoad}
				onMoveEnd={handleMapMoveEnd}
				ref={mapboxMapRef}
			>
				<MapContents {...mapContentsProps} />
			</MapboxMapScreen>
		);
	}
};

export default MapCenter;
