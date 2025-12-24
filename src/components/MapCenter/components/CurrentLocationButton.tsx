import { motion } from 'motion/react';
import React from 'react';
import { FaLocationArrow } from 'react-icons/fa6';
import type { LocationState } from '../../../hooks/useLocation';

interface CurrentLocationButtonProps {
	userLocation: LocationState;
	onClick: () => void;
}

export const CurrentLocationButton = ({
	userLocation,
	onClick,
}: CurrentLocationButtonProps) => {
	if (
		userLocation.loading ||
		userLocation.error ||
		!userLocation.latitude ||
		!userLocation.longitude
	)
		return null;

	return (
		<motion.div className="absolute right-0 bottom-safe flex justify-center p-4 md:py-8">
			<motion.div
				className="flex justify-center rounded-full"
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.95 }}
			>
				<motion.button
					className="w-[48px] h-[48px] pop-in p-0 rounded-full shadow-lg hover:shadow-blue-500/25 bg-gray-50/90 backdrop-blur-sm hover:backdrop-blur-md border border-gray-950/10 active:border-blue-500/50 hover:border-blue-500/50 pointer-events-auto flex justify-center items-center text-gray-500 active:bg-blue-500/5 text-2xl outline:none focus:outline-none transition-all touch-manipulation overflow-hidden hover:text-blue-500 active:text-blue-500"
					onClick={onClick}
				>
					<div className="w-full h-full md:hover:bg-blue-500/5 active:bg-blue-500/5 flex justify-center items-center rounded-full">
						<FaLocationArrow />
					</div>
				</motion.button>
			</motion.div>
		</motion.div>
	);
};
