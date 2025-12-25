import { motion } from 'motion/react';
import { FaArrowUp } from 'react-icons/fa6';
import { HashLoader } from 'react-spinners';
import { cn } from '../../utils/cn';

export interface SearchButtonProps {
	searchTerm: string;
	isLoading: boolean;
	onClick: () => void;
}

export const SearchButton = ({
	searchTerm,
	isLoading,
	onClick,
}: SearchButtonProps) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.1 }}
			className="w-fit h-[36px] flex flex-row items-center"
		>
			<motion.button
				disabled={searchTerm === ''}
				onClick={onClick}
				whileHover={{ scale: 1.02 }}
				className={cn(
					'w-[24px] h-[24px] flex justify-center items-center transition-all bg-neutral-400 rounded-full outline-hidden hover:outline-hidden hover:border-none focus:outline-hidden p-0',
					searchTerm === ''
						? 'disabled opacity-50 cursor-default'
						: ' hover:bg-teal-500 hover:shadow-md hover:shadow-teal-500/25 active:bg-teal-600',
					isLoading && 'bg-teal-500 shadow-md shadow-teal-500/25',
				)}
			>
				{isLoading ? (
					<HashLoader size={16} color={'white'} />
				) : (
					<FaArrowUp size={16} color={'white'} />
				)}
			</motion.button>
		</motion.div>
	);
};
