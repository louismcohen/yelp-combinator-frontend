import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Business } from '../types';
import {
	generateHexColorFromCategoryAlias,
	IconGenerated,
} from '../utils/IconGenerator';

const iconFillVisited = `#ffffff`;

interface IconMarkerProps {
	business: Business;
	onMarkerPress: (marker: Business) => void;
}

const IconMarker = ({ business, onMarkerPress }: IconMarkerProps) => {
	const isVisited = business?.visited;
	const primaryCategoryAlias = business.categories[0].alias;
	const iconHexColor = generateHexColorFromCategoryAlias(primaryCategoryAlias);
	const iconColor = isVisited ? iconFillVisited : iconHexColor;
	const backgroundColor = isVisited ? iconHexColor : '#fff';
	const borderColor = isVisited ? 'rgba(255,255,255,0.1)' : iconHexColor;

	return (
		<AdvancedMarker
			position={{
				lat: business.coordinates.latitude,
				lng: business.coordinates.longitude,
			}}
			onClick={() => onMarkerPress(business)}
		>
			<div
				className={`w-[32px] h-[32px] flex justify-center items-center rounded-full opacity-[0.97] cursor-pointer shadow-[0px_3px_5px_rgba(0,0,0,0.33)]`}
				style={{
					backgroundColor,
					borderColor,
					borderWidth: '1px',
				}}
			>
				<IconGenerated
					categoryAlias={primaryCategoryAlias}
					iconProps={{ fill: iconColor }}
				/>
			</div>
		</AdvancedMarker>
	);
};

export default IconMarker;
