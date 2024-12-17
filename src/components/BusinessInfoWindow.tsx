import { Business } from '../types';
import { motion } from 'motion/react';
import { FaXmark } from 'react-icons/fa6';

const CloseButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<p
			onClick={onClick}
			className="bg-slate-400 hover:bg-slate-500 cursor-pointer rounded-full h-[30px] w-[30px] flex items-center justify-center text-slate-50"
		>
			<FaXmark />
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
			className="absolute flex justify-center bottom-0 outline-none h-[300px] w-full p-4 focus:outline-none"
		>
			<div className="relative flex flex-row items-start h-full w-screen max-w-[500px] p-4 rounded-2xl bg-slate-50/95 border border-slate-900/10 shadow-lg">
				<div className="flex flex-row w-full justify-between items-start gap-4">
					<div className="flex-grow">
						<p className="text-2xl font-bold">{business.name}</p>
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
