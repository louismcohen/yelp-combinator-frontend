import { AdvancedMarker, Marker } from '@vis.gl/react-google-maps';
import { Business } from '../types';
import { motion } from 'motion/react';

interface YCMarkerProps {
	business: Business;
	onMarkerPress: (marker: Business) => void;
}
const YCMarker = ({ business, onMarkerPress }: YCMarkerProps) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			<AdvancedMarker
				key={business.alias}
				position={{
					lat: business.coordinates.latitude,
					lng: business.coordinates.longitude,
				}}
				onClick={() => onMarkerPress(business)}
			/>
		</motion.div>
	);
};

export default YCMarker;
