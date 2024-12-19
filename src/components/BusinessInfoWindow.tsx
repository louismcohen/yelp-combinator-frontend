import { Business } from '../types';
import { motion } from 'motion/react';
import { FaXmark } from 'react-icons/fa6';

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
			<div className="relative overflow-hidden *:flex flex-col items-start h-full w-screen max-w-[500px] rounded-xl bg-neutral-50/95  backdrop-blur-sm shadow-[0_16px_20px_-4px_rgba(0,0,0,0.25),0_6px_8px_-4px_rgba(0,0,0,0.25)]">
				<div
					className="bg-cover bg-center w-full h-[200px] absolute inset-0 -z-10"
					style={{
						backgroundImage: `url(${business.image_url})`,
					}}
				>
					{/* <div className="absolute top-0 right-0 p-4">
						<CloseButton onClick={handleClose} />
					</div> */}
					<div className="flex flex-row w-full justify-between items-end p-4 bg-gradient-to-b from-black/0 to-black/50 ">
						<div className="flex-grow gap-0">
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
				<div className="absolute h-full w-full border border-black/5" />
			</div>
		</motion.div>
	);
};

export default BusinessInfoWindow;
