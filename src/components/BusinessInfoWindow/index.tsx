import { motion } from 'motion/react';
import { FaRegClock, FaRegMap, FaRegNoteSticky } from 'react-icons/fa6';
import useMutateBusiness, {
	useUpdateVisitedBusiness,
} from '../../hooks/useMutateBusiness';
import type { Business } from '../../types';
import { convertHexToRgb } from '../../utils';
import { generateHexColorFromCategoryAlias } from '../../utils/IconGenerator';
import { getBusinessHoursStatus } from '../../utils/businessHours';
import { ClaimedChip } from './ClaimedChip';
import { InfoSection } from './InfoSection';
import { ResponsiveAddress } from './ResponsiveAddress';
import { VisitedButton } from './VisitedButton';
import { YelpLogo } from './YelpLogo';

const Divider = () => {
	return <div className="h-[1px] my-2 w-full bg-neutral-700/10" />;
};

export const BusinessInfoWindow = ({ business }: { business?: Business }) => {
	if (!business || !business.yelpData) return;

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

	const statusColor = status.includes('Open')
		? 'text-green-600'
		: 'text-red-600';

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95, y: 16 }}
			animate={{ opacity: 1, scale: 1.0, y: 0 }}
			exit={{
				opacity: 0,
				scale: 1.02,
				transition: { duration: 0.15 },
			}}
			transition={{ duration: 0.2 }}
			className="absolute flex justify-center bottom-safe z-50 outline-hidden sm:min-h-[50%] md:min-h-[200px] w-full p-2 focus:outline-hidden pointer-events-none"
		>
			<motion.div
				layout
				transition={{ duration: 0.15 }}
				className="relative pointer-events-auto overflow-hidden *:flex flex-col items-start h-fit w-screen max-w-[500px] rounded-3xl md:rounded-xl bg-neutral-50/95  backdrop-blur-sm"
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
						<div className="w-full flex flex-row justify-between items-center">
							<VisitedButton
								visited={business.visited}
								onClick={() => handleVisitedButtonClick(business)}
							/>
							<ClaimedChip claimed={business.yelpData.is_claimed} />
						</div>
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
							<ResponsiveAddress location={business.yelpData.location} />
						</InfoSection>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};
