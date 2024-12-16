import { Business } from '../types';

const BusinessInfoWindow = ({ business }: { business?: Business }) => {
	if (!business) return;

	return (
		<div className="absolute top-0 left-0 outline-none">
			<h1>{business.name}</h1>
		</div>
	);
};

export default BusinessInfoWindow;
