import { motion } from 'motion/react';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export const AiSearchButton = () => {
	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			className="w-[36px] h-[36px] flex justify-center items-center transition-all bg-neutral-50/95 rounded-full outline-hidden hover:outline-hidden focus:outline-hidden p-0"
		>
			<FaMagnifyingGlass size={16} color={'black'} />
		</motion.button>
	);
};
