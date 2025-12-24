import { motion } from 'motion/react';
import { FaXmark } from 'react-icons/fa6';
import type { SearchFilter } from '../../types/searchFilter';
import { cn } from '../../utils/cn';

export const ClearButton = ({
	updateSearchTerm,
}: Pick<SearchFilter, 'searchTerm' | 'updateSearchTerm'>) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.1 }}
			onClick={() => updateSearchTerm('')}
			className="w-fit h-[36px] flex flex-row items-center"
		>
			<motion.button
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				className={cn(
					'w-[24px] h-[24px] flex justify-center items-center transition-all bg-neutral-700/40 rounded-full outline-none hover:outline-none hover:border-none focus:outline-none p-0',
					'hover:bg-neutral-700/50',
				)}
			>
				<FaXmark size={16} color={'white'} />
			</motion.button>
		</motion.div>
	);
};
