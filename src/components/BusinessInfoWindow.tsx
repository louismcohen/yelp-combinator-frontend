import { Business } from '../types';
import { motion } from 'motion/react';
import { FaXmark } from 'react-icons/fa6';

const CloseButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<p
			onClick={onClick}
			className="bg-neutral-400 hover:bg-neutral-500 cursor-pointer rounded-full h-[30px] w-[30px] flex items-center justify-center text-neutral-50"
		>
			<FaXmark size={16} />
		</p>
	);
};
const BusinessInfoWindow = ({
	business,
	handleClose,
}: {
	business?: Business;
	handleClose: () => void;
}) => {
	if (!business) return;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95, transform: 'translateY(32px)' }}
			animate={{ opacity: 1, scale: 1.0, transform: 'translateY(0px)' }}
			exit={{ opacity: 0, scale: 1.02, transform: 'translateY(32px)' }}
			transition={{ duration: 0.15 }}
			className="absolute flex justify-center bottom-0 outline-none h-[400px] max-h-[50%] w-full p-2 focus:outline-none"
		>
			<div className="relative flex flex-row items-start h-full w-screen max-w-[500px] p-4 rounded-xl bg-neutral-50/95 border border-neutral-500/10 backdrop-blur-sm shadow-[0_16px_20px_-4px_rgba(0,0,0,0.25),0_6px_8px_-4px_rgba(0,0,0,0.25)]">
				<div className="flex flex-row w-full justify-between items-start gap-4">
					<div className="flex-grow">
						<p className="text-2xl font-bold text-gray-900">{business.name}</p>
					</div>
					<div className="flex-shrink">
						<CloseButton onClick={handleClose} />
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default BusinessInfoWindow;
