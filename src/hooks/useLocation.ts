import { useEffect, useState } from 'react';

export interface LocationState {
	latitude: number | null;
	longitude: number | null;
	error: string | null;
	loading: boolean;
}

const useLocation = () => {
	const [location, setLocation] = useState<LocationState>({
		latitude: null,
		longitude: null,
		error: null,
		loading: true,
	});

	useEffect(() => {
		if (!navigator.geolocation) {
			setLocation((prev) => ({
				...prev,
				error: 'Geolocation is not supported',
				loading: false,
			}));
		}

		const handleSuccess = (position: GeolocationPosition) =>
			setLocation({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				error: null,
				loading: false,
			});

		const handleError = (error: GeolocationPositionError) =>
			setLocation((prev) => ({
				...prev,
				error: error.message,
				loading: false,
			}));

		const options: PositionOptions = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		};

		navigator.geolocation.getCurrentPosition(
			handleSuccess,
			handleError,
			options,
		);
	}, []);

	return location;
};

export default useLocation;
