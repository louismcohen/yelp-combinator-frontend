import { Business } from '../types';

const BusinessInfoWindow = ({ business }: { business?: Business }) => {
	if (!business) return;

	return (
		<div className="absolute top-0 left-0 outline-none h-screen w-[400px] p-4 focus:outline-none">
			<div className="relative h-full p-4 rounded-2xl bg-slate-50/95 border border-slate-900/10 shadow-lg">
				<h1>
					<b>{business.name}</b>
				</h1>
			</div>
		</div>
	);
};

export default BusinessInfoWindow;
