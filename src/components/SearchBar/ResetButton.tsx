import { motion } from 'motion/react';
import { FaArrowRotateLeft } from 'react-icons/fa6';
import { cn } from '../../utils/cn';

export const ResetButton = ({
	isReset,
	onClick,
}: {
	isReset: boolean;
	onClick: () => void;
}) => {
	return (
		<motion.button
			disabled={isReset}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.95 }}
			className={cn(
				'aspect-[1.1] h-[38px] self-stretch py-0 px-0 flex justify-center items-center transition-all bg-gray-50/95 text-sm md:text-md text-neutral-500 border-neutral-400 border rounded-xl shadow-lg outline-none hover:outline-none focus:outline-none hover:border-amber-500 hover:bg-amber-50/95',
				isReset && 'pointer-events-none text-neutral-400 border-neutral-300',
			)}
			onClick={onClick}
		>
			<FaArrowRotateLeft />
		</motion.button>
	);
};
