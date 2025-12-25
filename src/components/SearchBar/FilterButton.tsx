import { motion } from 'motion/react';
import type { MouseEventHandler } from 'react';
import type { Filter, FilterColor } from '../../types/searchFilter';
import { FilterMode } from '../../types/searchFilter';
import { cn } from '../../utils/cn';
import { textColorVariants } from './contants';

interface FilterButtonProps {
	text: string;
	filter: Filter;
	onClick: MouseEventHandler<HTMLButtonElement> | (() => void);
}

export const FilterButton = ({ text, filter, onClick }: FilterButtonProps) => {
	const containerColorVariants: Record<FilterColor, string> = {
		green: 'border-green-700 drop-shadow-lg',
		red: 'border-red-70 drop-shadow-lg',
		purple: 'border-purple-700 drop-shadow-lg',
		blue: 'border-blue-700 drop-shadow-lg',
	};

	const hoverColorVariants: Record<FilterColor, string> = {
		green: 'hover:border-green-700/70 hover:bg-green-50/95',
		red: 'hover:border-red-700/70 hover:bg-red-50/95',
		purple: 'hover:border-purple-700/70 hover:bg-purple-50/95',
		blue: 'hover:border-blue-700/70 hover:bg-blue-50/95',
	};

	const determineFilterStyles = (status: FilterMode, color: FilterColor) => {
		if (status === FilterMode.True) {
			return `${containerColorVariants[color]} ${textColorVariants[color]}`;
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else if (status === FilterMode.False) {
			return `${containerColorVariants[color]} ${textColorVariants[color]}`;
		}

		return 'text-neutral-500 border-neutral-700/30';
	};

	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.95 }}
			className={cn(
				'h-[38px] relative w-1/3 flex flex-row gap-1 md:gap-2 justify-center items-center outline-hidden transition-all',
				hoverColorVariants[filter.color],
				'!focus:outline-hidden bg-neutral-50/95 border rounded-xl py-2 shadow-lg z-10',
				determineFilterStyles(filter.mode, filter.color),
			)}
			onClick={onClick}
		>
			{/* <div className="md:absolute md:left-0 md:py-2 md:px-3"> */}
			<div>
				{filter.mode === FilterMode.False ? filter.falseIcon : filter.trueIcon}
			</div>
			{/* <div className="relative w-full flex flex-row justify-end md:justify-center items-center"></div> */}
			<p className="font-semibold text-xs md:text-sm">{text}</p>
		</motion.button>
	);
};
