import { Business, Location } from '../types';
import { motion } from 'motion/react';
import { FaXmark } from 'react-icons/fa6';
import { generateHexColorFromCategoryAlias } from '../utils/IconGenerator';
import { getBusinessHoursStatus } from '../utils/businessHours';
import { FaCheckCircle } from 'react-icons/fa';
import { initialFilterState } from '../contexts/searchFilterContext';
import { useState } from 'react';

const CloseButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<p
			onClick={onClick}
			className="bg-neutral-300/50 hover:bg-neutral-300/60 transition-all cursor-pointer rounded-full h-[30px] w-[30px] flex items-center justify-center text-neutral-50 border border-neutral-100/25 shadow-lg"
		>
			<FaXmark size={16} />
		</p>
	);
};

const InfoSection = ({
	title,
	children,
}: {
	title: string;
	children?: any;
}) => {
	return (
		<div className="flex flex-row justify-between items-start w-full gap-8 md:gap-12">
			<p className="text-sm font-bold text-neutral-700 uppercase">{title}</p>
			{children}
		</div>
	);
};

const VisitedButton = ({
	visited,
	onClick,
}: {
	visited: boolean;
	onClick: () => void;
}) => {
	const [visitedState, setVisited] = useState(visited);
	const visitedColor = 'text-green-400';

	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.95 }}
			className={`h-[24px] flex px-3 py-4 gap-2 pointer-events-auto cursor-pointer justify-center items-center transition-all duration-150 ease-in-out bg-gray-900/50 rounded-lg outline-none hover:outline-none focus:outline-none hover:border-green-400/50 shadow-md hover:drop-shadow-lg backdrop-blur-sm text-sm text-gray-50 ${
				visited ? '' : ''
			}`}
			onClick={() => setVisited(!visitedState)}
		>
			<span className={`${visitedColor}`}>
				{visitedState
					? initialFilterState.visited.trueIcon
					: initialFilterState.visited.falseIcon}
			</span>
			{visitedState ? `Visited` : `Not Visited`}
		</motion.button>
	);
};

const Divider = () => {
	return <div className="h-[1px] my-2 w-full bg-neutral-700/10" />;
};

type DisplayAddress = [string, string];

const generateDisplayAddress = (location: Location): DisplayAddress => {
	if (!location) return ['', ''];

	let lines = ['', ''] as DisplayAddress;
	lines[0] =
		`${location.address1 !== null && location.address1}` +
		`${
			(location.address2 !== null &&
				location.address2 !== '' &&
				' ' + location.address2) ||
			''
		}` +
		`${
			(location.address3 !== null &&
				location.address3 !== '' &&
				' ' + location.address3) ||
			''
		}`;
	lines[1] = `${location.city}, ${location.state} ${location.zip_code}`;

	return lines;
};

const ResponsiveAddress = ({
	displayAddress,
}: {
	displayAddress: DisplayAddress;
}) => {
	return (
		<div className="flex flex-wrap justify-end text-sm text-neutral-700 text-right">
			<span>{displayAddress[0]}</span>
			<span className="ml-1">{displayAddress[1]}</span>
		</div>
	);
};

const BusinessInfoWindow = ({ business }: { business?: Business }) => {
	if (!business) return;

	console.log(business);

	const categoryColor = generateHexColorFromCategoryAlias(
		business.categories[0].alias,
	);

	const { status, auxStatus } = getBusinessHoursStatus(business.hours);

	const statusColor = status.includes('Open')
		? 'text-green-600'
		: 'text-red-600';

	const displayAddress = generateDisplayAddress(business.location);

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95, transform: 'translateY(32px)' }}
			animate={{ opacity: 1, scale: 1.0, transform: 'translateY(0px)' }}
			exit={{
				opacity: 0,
				scale: 1.0,
				transform: 'translateY(32px)',
				transition: { duration: 0.3 },
			}}
			transition={{ duration: 0.15 }}
			className="absolute flex justify-center bottom-0 outline-none sm:min-h-[50%] md:min-h-[200px] w-full p-2 focus:outline-none pointer-events-auto"
		>
			<motion.div
				layout
				transition={{ duration: 0.15 }}
				className="relative overflow-hidden *:flex flex-col items-start h-fit w-screen max-w-[500px] rounded-xl bg-neutral-50/95  backdrop-blur-sm shadow-[0_16px_20px_-4px_rgba(0,0,0,0.25),0_6px_8px_-4px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.1)]"
			>
				<div
					className="bg-cover bg-center w-full h-[200px] pointer-events-auto"
					style={{
						backgroundImage: `url(${business.image_url})`,
						backgroundColor: categoryColor,
					}}
				>
					{/* <div className="absolute top-0 right-0 p-4">
						<CloseButton onClick={handleClose} />
					</div> */}
					<div className="flex flex-col w-full justify-between items-start p-4 bg-gradient-to-b from-transparent via-25% via-transparent to-black/75 pointer-events-auto">
						<VisitedButton visited={business.visited} onClick={() => {}} />
						<div className="flex-shrink gap-0">
							<p className="text-3xl font-bold text-white/95 leading-tight">
								{business.name}
							</p>
							<p className="text-sm md:text-md text-white/85 leading-none">
								{business.categories
									.map((category) => category.title)
									.join(', ')}
							</p>
						</div>
					</div>
				</div>
				<div
					className="h-full w-full transition-all pb-4"
					style={{
						backgroundImage: `linear-gradient(to top, ${categoryColor}34 0%, transparent 40px)`,
					}}
				>
					<div className="relative flex-grow flex-col p-4 gap-4">
						{business.hours.length > 0 && (
							<>
								<InfoSection title="hours">
									<p className="text-sm text-neutral-700 text-right">
										<span className={`font-bold ${statusColor}`}>{status}</span>
										{auxStatus}
									</p>
								</InfoSection>
								<Divider />
							</>
						)}
						{business?.note && (
							<>
								<InfoSection title="note">
									<p className="text-sm text-neutral-700 text-right">
										{business.note || ''}
									</p>
								</InfoSection>
								<Divider />
							</>
						)}
						<InfoSection title="address">
							<ResponsiveAddress displayAddress={displayAddress} />
						</InfoSection>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default BusinessInfoWindow;
