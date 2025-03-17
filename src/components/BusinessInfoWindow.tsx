import { Business, Location } from '../types';
import { motion } from 'motion/react';
import {
	FaRegClock,
	FaXmark,
	FaRegNoteSticky,
	FaRegMap,
} from 'react-icons/fa6';
import { generateHexColorFromCategoryAlias } from '../utils/IconGenerator';
import { getBusinessHoursStatus } from '../utils/businessHours';
import { initialFilterState } from '../store/searchFilterStore';
import yelpLogo from '../assets/yelp_logo_dark_bg.png';
import useMutateBusiness, {
	useUpdateVisitedBusiness,
} from '../hooks/useMutateBusiness';
import { convertHexToRgb } from '../utils';

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
	icon,
	children,
}: {
	title: string;
	icon: React.ReactNode;
	children?: any;
}) => {
	return (
		<div className="flex flex-row justify-between items-start w-full gap-8 md:gap-12 text-neutral-700">
			<div className="flex flex-row justify-start items-center gap-2">
				{icon}
				<p className="text-sm font-bold uppercase">{title}</p>
			</div>

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
	const visitedColor = visited ? 'text-gray-50' : 'text-green-400';

	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.95 }}
			className={`h-[24px] flex px-3 py-4 gap-2 pointer-events-auto cursor-pointer justify-center items-center transition-all duration-150 ease-in-out bg-gray-900/50 rounded-lg outline-none hover:outline-none focus:outline-none hover:border-green-400/50 shadow-md hover:drop-shadow-lg backdrop-blur-sm text-sm text-gray-50 ${
				visited ? 'bg-green-600/75 text-gray-50' : ''
			}`}
			onClick={onClick}
		>
			<span className={`${visitedColor}`}>
				{visited
					? initialFilterState.visited.trueIcon
					: initialFilterState.visited.falseIcon}
			</span>
			{visited ? `Visited` : `Not Visited`}
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
		`${location.address1 !== undefined && location.address1}` +
		`${
			(location.address2 !== undefined &&
				location.address2 !== '' &&
				' ' + location.address2) ||
			''
		}` +
		`${
			(location.address3 !== undefined &&
				location.address3 !== '' &&
				' ' + location.address3) ||
			''
		}` +
		',';
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

const YelpLogo = ({ alias }: { alias: string }) => (
	<div className="shrink-0">
		<a
			href={`https://www.yelp.com/biz/${alias}`}
			target="_blank"
			rel="noopener noreferrer"
			title="Go to Yelp page"
		>
			<img className="h-[24px]" src={yelpLogo} alt="Yelp Logo" />
		</a>
	</div>
);

const BusinessInfoWindow = ({ business }: { business?: Business }) => {
	if (!business || !business.yelpData) return;

	console.log({ business });

	const updateVisitedMutation = useUpdateVisitedBusiness();

	const handleVisitedButtonClick = (business: Business) => {
		const updatedBusiness: Business = {
			...business,
			visited: !business?.visited,
		};

		updateVisitedMutation.mutate({
			alias: updatedBusiness.alias,
			visited: updatedBusiness.visited,
		});
	};

	const categoryColor = generateHexColorFromCategoryAlias(
		business.yelpData.categories[0].alias,
	);

	const { status, auxStatus } = getBusinessHoursStatus(business);

	console.log(business.alias, status, auxStatus);

	const statusColor = status.includes('Open')
		? 'text-green-600'
		: 'text-red-600';

	const displayAddress = generateDisplayAddress(business.yelpData.location);

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
			className="absolute flex justify-center bottom-safe z-50 outline-none sm:min-h-[50%] md:min-h-[200px] w-full p-2 focus:outline-none pointer-events-none"
		>
			<motion.div
				layout
				transition={{ duration: 0.15 }}
				className={`relative pointer-events-auto overflow-hidden *:flex flex-col items-start h-fit w-screen max-w-[500px] rounded-3xl md:rounded-xl bg-neutral-50/95  backdrop-blur-sm`}
				style={{
					boxShadow: `0 16px 20px -4px rgba(0,0,0,0.25), 0 6px 8px -4px rgba(0,0,0,0.25), 0 0 0 1px ${convertHexToRgb(
						categoryColor,
						0.2,
					)}`,
				}}
			>
				<div
					className="bg-cover bg-center w-full h-[200px] pointer-events-auto"
					style={{
						backgroundImage: `url(${business.yelpData.image_url})`,
						backgroundColor: categoryColor,
					}}
				>
					{/* <div className="absolute top-0 right-0 p-4">
						<CloseButton onClick={handleClose} />
					</div> */}
					<div className="flex flex-col w-full justify-between items-start p-4 bg-gradient-to-b from-transparent via-25% via-transparent to-black/75 pointer-events-auto">
						<VisitedButton
							visited={business.visited}
							onClick={() => handleVisitedButtonClick(business)}
						/>
						<div className="flex flex-grow w-full flex-row justify-between items-end gap-3">
							<div className="flex flex-shrink flex-col gap-0">
								<a
									href={business?.website}
									target="_blank"
									rel="noopener noreferrer"
									title="Go to business website"
									className="text-3xl font-bold text-white/95 hover:text-white/95 leading-tight"
								>
									{business.yelpData.name}
								</a>
								<p className="text-sm md:text-md text-white/85 leading-none">
									{business.yelpData.categories
										.map((category) => category.title)
										.join(', ')}
								</p>
							</div>
							<YelpLogo alias={business.alias} />
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
						{business.yelpData.hours && business.yelpData.hours.length > 0 && (
							<>
								<InfoSection title="hours" icon={<FaRegClock />}>
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
								<InfoSection title="note" icon={<FaRegNoteSticky />}>
									<p className="text-sm text-neutral-700 text-right">
										{business.note || ''}
									</p>
								</InfoSection>
								<Divider />
							</>
						)}
						<InfoSection title="address" icon={<FaRegMap />}>
							<ResponsiveAddress displayAddress={displayAddress} />
						</InfoSection>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default BusinessInfoWindow;
