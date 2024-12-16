import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import useMarkers from './hooks/useMarkers';
import { useEffect, useState } from 'react';
import { Business } from './types';
import BusinessInfoWindow from './components/BusinessInfoWindow';

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
	lat: 34.04162072763611,
	lng: -118.26326182991187,
};

const GoogleMap = () => {
	const map = useMap();
	const { markers, isLoading, error } = useMarkers();
	const [selectedBusiness, setSelectedBusiness] = useState<Business>();

	map?.setClickableIcons(false);

	const handleMarkerPress = (marker: Business) => {
		setSelectedBusiness(marker);
	};

	const handleMapPress = () => {
		setSelectedBusiness(undefined);
	};

	return (
		<Map
			className="w-screen h-screen outline-none focus:outline-none"
			defaultCenter={DEFAULT_CENTER}
			defaultZoom={14}
			gestureHandling="greedy"
			disableDefaultUI
			onClick={handleMapPress}
		>
			{markers.length > 0 &&
				!error &&
				!isLoading &&
				markers.map((marker, index) => (
					<Marker
						key={index}
						position={{
							lat: marker.coordinates.latitude,
							lng: marker.coordinates.longitude,
						}}
						onClick={() => handleMarkerPress(marker)}
					/>
				))}
			<BusinessInfoWindow business={selectedBusiness} />
		</Map>
	);
};

export default GoogleMap;
