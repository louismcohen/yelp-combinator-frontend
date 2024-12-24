import { Map, MapCameraChangedEvent, useMap } from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Business } from './types';
import BusinessInfoWindow from './components/BusinessInfoWindow';
import SearchBar from './components/SearchBar';
import { AnimatePresence, motion } from 'motion/react';
import { useDebounce } from 'use-debounce';
import IconMarker from './components/IconMarker';
import { FilterMode, useSearchFilter } from './contexts/searchFilterContext';
import { getBusinessHoursStatus } from './utils/businessHours';
import useBusinesses from './hooks/useBusinesses';
import { CircleLoader, GridLoader } from 'react-spinners';
import Supercluster from 'supercluster';
import ClusterMarker from './components/ClusterMarker';

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

const GoogleMap = () => {
	const map = useMap();
	const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral>();
	const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
	const { data: businesses, isFetching } = useBusinesses();
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
	const [debouncedZoom] = useDebounce(zoom, 300);

	const deselectBusiness = () => setSelectedBusiness(undefined);

	const handleMarkerPress = useCallback((marker: Business) => {
		setSelectedBusiness(marker);
	}, []);

	const handleMapPress = () => {
		console.log('handleMapPress');
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

	const supercluster = useMemo(() => {
		const instance = new Supercluster({
			extent: 256,
			radius: 50,
			maxZoom: 20,
			minPoints: 2, // Minimum points to form a cluster
		});

		// Load your points into the index
		instance.load(
			visibleMarkers.map((business) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [
						business.coordinates.longitude,
						business.coordinates.latitude,
					],
				},
				properties: business,
			})),
		);

		return instance;
	}, [visibleMarkers]);

	const clusters = useMemo(() => {
		if (!debouncedBounds || !supercluster || !debouncedZoom) return [];

		return supercluster.getClusters(
			[
				debouncedBounds.west,
				debouncedBounds.south,
				debouncedBounds.east,
				debouncedBounds.north,
			],
			Math.floor(debouncedZoom),
		);
	}, [debouncedBounds, debouncedZoom, supercluster]);

	const handleClusterClick = (cluster: Supercluster.ClusterFeature<any>) => {
		const [longitude, latitude] = cluster.geometry.coordinates;

		// Get the cluster expansion zoom
		const expansionZoom = Math.min(
			supercluster.getClusterExpansionZoom(cluster.properties.cluster_id),
			20,
		);

		// Smoothly zoom and pan to the cluster
		if (map) {
			map.panTo({ lat: latitude, lng: longitude });
			map.setZoom(expansionZoom);
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
						key={cluster.id}
						position={{ lat: latitude, lng: longitude }}
						points={pointCount}
						onClick={() => handleClusterClick(cluster)}
					/>
				);
			} else {
				const marker = cluster.properties as Business;
				return (
					<IconMarker
						key={marker.alias}
						business={marker}
						selected={selectedBusiness?.alias === marker.alias}
						onMarkerPress={handleMarkerPress}
					/>
				);
			}
		});
	}, [clusters]);

	return (
		<Map
			className="w-screen h-screen outline-none focus:outline-none"
			mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
			defaultCenter={DEFAULT_CENTER}
			defaultZoom={DEFAULT_ZOOM}
			gestureHandling="greedy"
			disableDefaultUI
			onClick={handleMapPress}
			onBoundsChanged={(e: MapCameraChangedEvent) => {
				console.log('onBoundsChanged');
				setBounds(e.detail.bounds);
				setZoom(e.detail.zoom);
			}}
		>
			<AnimatePresence>
				{isFetching && <LoadingOverlay />}
				{renderMarkers}
				{/* {visibleMarkers.map((marker) => (
					<IconMarker
						key={marker.alias}
						business={marker}
						selected={selectedBusiness?.alias === marker.alias}
						onMarkerPress={handleMarkerPress}
						setMarkerRef={setMarkerRef}
					/>
				))} */}
			</AnimatePresence>
			<SearchBar />
			<AnimatePresence>
				{selectedBusiness && <BusinessInfoWindow business={selectedBusiness} />}
			</AnimatePresence>
		</Map>
	);
};

export default GoogleMap;
