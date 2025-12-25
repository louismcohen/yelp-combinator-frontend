import { AnimatePresence, motion } from 'motion/react';
import type { Filter, SearchFilter } from '../../types/searchFilter';
import { FilterMode } from '../../types/searchFilter';
import { textColorVariants } from './contants';

export const ActiveFilters = ({ filters }: Pick<SearchFilter, 'filters'>) => {
	if (!filters) return null;

	const showOpenFilter = filters.open.mode !== FilterMode.Disabled;
	const showVisitedFilter = filters.visited.mode !== FilterMode.Disabled;
	const showClaimedFilter = filters.claimed.mode !== FilterMode.Disabled;

	const returnRelevantIcon = (filter: Filter): React.ReactNode => {
		if (filter.mode === FilterMode.True) {
			return filter.trueIcon;
		}
		return filter.falseIcon;
	};

	const animationSettings = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 0.15 },
	};

	return (
		<div className="flex flex-grow flex-row gap-2 justify-end items-center transition-all text-md pr-1">
			<AnimatePresence>
				{showOpenFilter && (
					<motion.div
						{...animationSettings}
						className={textColorVariants[filters.open.color]}
					>
						{returnRelevantIcon(filters.open)}
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{showVisitedFilter && (
					<motion.div
						{...animationSettings}
						className={textColorVariants[filters.visited.color]}
					>
						{returnRelevantIcon(filters.visited)}
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{showClaimedFilter && (
					<motion.div
						{...animationSettings}
						className={textColorVariants[filters.claimed.color]}
					>
						{returnRelevantIcon(filters.claimed)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
