import { AnimatePresence, motion } from 'motion/react';
import { MouseEventHandler, useEffect, useRef } from 'react';
import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';
import { useSearchFilterStore } from '../store/searchFilterStore';
import { SearchFilter } from '../types/searchFilter';
import {
	Filter,
	FilterColor,
	FilterMode,
	FilterType,
} from '../types/searchFilter';

const ClearButton = ({
	searchTerm,
	updateSearchTerm,
}: Pick<SearchFilter, 'searchTerm' | 'updateSearchTerm'>) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.1 }}
			onClick={() => searchTerm !== '' && updateSearchTerm('')}
			className="w-fit h-[36px] flex flex-row items-center"
		>
			<motion.button
				whileHover={{ scale: 1.02 }}
				className={`w-[24px] h-[24px] flex justify-center items-center transition-all bg-neutral-400 rounded-full outline-none hover:outline-none hover:border-none focus:outline-none p-0 ${
					searchTerm === ''
						? 'disabled opacity-50 cursor-default'
						: ' hover:bg-neutral-500'
				}`}
			>
				<FaXmark size={16} color={'white'} />
			</motion.button>
		</motion.div>
	);
};

interface FilterButtonProps {
	text: string;
	filter: Filter;
	onClick: MouseEventHandler<HTMLButtonElement> | (() => void);
}

const textColorVariants: Record<FilterColor, string> = {
	green: 'text-green-600',
	red: 'text-red-600',
	purple: 'text-purple-600',
	blue: 'text-blue-600',
};

const FilterButton = ({ text, filter, onClick }: FilterButtonProps) => {
	const containerColorVariants: Record<FilterColor, string> = {
		green: `border-green-700 drop-shadow-lg`,
		red: 'border-red-70 drop-shadow-lg',
		purple: 'border-purple-700 drop-shadow-lg',
		blue: 'border-blue-700 drop-shadow-lg',
	};

	const hoverColorVariants: Record<FilterColor, string> = {
		green: 'hover:border-green-700/70',
		red: 'hover:border-red-700/70',
		purple: 'hover:border-purple-700/70',
		blue: 'hover:border-blue-700/70',
	};

	const determineFilterStyles = (status: FilterMode, color: FilterColor) => {
		if (status === FilterMode.True) {
			return `${containerColorVariants[color]} ${textColorVariants[color]}`;
		} else if (status === FilterMode.False) {
			return `${containerColorVariants[color]} ${textColorVariants[color]}`;
		} else {
			return 'text-neutral-500 border-neutral-400';
		}
	};

	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			className={`relative w-1/3 flex flex-row gap-2 justify-center items-center outline-none transition-all ${
				hoverColorVariants[filter.color]
			} focus:outline-none bg-gray-50/95 border rounded-md py-2 px-3 shadow-lg z-10 text-xs md:text-sm  ${determineFilterStyles(
				filter.mode,
				filter.color,
			)}`}
			onClick={onClick}
		>
			{/* <div className="md:absolute md:left-0 md:py-2 md:px-3"> */}
			<div>
				{filter.mode === FilterMode.False ? filter.falseIcon : filter.trueIcon}
			</div>
			{/* <div className="relative w-full flex flex-row justify-end md:justify-center items-center"></div> */}
			<p className={`font-semibold`}>{text}</p>
		</motion.button>
	);
};

const ActiveFilters = ({ filters }: Pick<SearchFilter, 'filters'>) => {
	if (!filters) return null;

	const showOpenFilter = filters.open.mode !== FilterMode.Disabled;
	const showVisitedFilter = filters.visited.mode !== FilterMode.Disabled;
	const showClaimedFilter = filters.claimed.mode !== FilterMode.Disabled;

	const returnRelevantIcon = (filter: Filter): React.ReactNode => {
		if (filter.mode === FilterMode.True) {
			return filter.trueIcon;
		} else if (filter.mode === FilterMode.False) {
			return filter.falseIcon;
		} else {
			return null;
		}
	};

	const animationSettings = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 0.15 },
	};

	return (
		<AnimatePresence>
			<div className="flex flex-grow flex-row gap-2 justify-end items-center transition-all text-md">
				<AnimatePresence>
					{showOpenFilter && (
						<motion.div
							{...animationSettings}
							className={`${textColorVariants[filters.open.color]}`}
						>
							{returnRelevantIcon(filters.open)}
						</motion.div>
					)}
				</AnimatePresence>
				{showVisitedFilter && (
					<motion.div
						{...animationSettings}
						className={`${textColorVariants[filters.visited.color]}`}
					>
						{returnRelevantIcon(filters.visited)}
					</motion.div>
				)}
				{showClaimedFilter && (
					<motion.div
						{...animationSettings}
						className={`${textColorVariants[filters.claimed.color]}`}
					>
						{returnRelevantIcon(filters.claimed)}
					</motion.div>
				)}
			</div>
		</AnimatePresence>
	);
};

const SearchBar = () => {
	const searchBarRef = useRef<HTMLInputElement>(null);
	// const { state, dispatch } = useSearchFilter();
	// const state = useSearchFilterStore();
	const {
		searchTerm,
		updateSearchTerm,
		searchInputFocused,
		updateSearchInputFocused,
		filters,
		updateFilter,
	} = useSearchFilterStore();
	// const searchInputFocused = useSearchFilterStore((state) => state.searchInputFocused);
	// const updateSearchInputFocused = useSearchFilterStore((state) => state.updateSearchInputFocused);

	useEffect(() => {
		if (searchBarRef.current) {
			searchInputFocused
				? searchBarRef.current.focus()
				: searchBarRef.current.blur();
		}
	}, [searchInputFocused]);

	return (
		<div className="absolute top-0 flex flex-col gap-2 justify-center items-center w-full p-4 pointer-events-none">
			<div
				tabIndex={0}
				className={`w-full max-w-[500px] pointer-events-auto hover:outline-2 hover:outline-offset-0 hover:outline-red-500 bg-gray-50/85 backdrop-blur-sm transition-all duration-300 flex justify-center items-center px-3 gap-2 rounded-lg overflow-hidden border border-neutral-500/10 outline ${
					searchInputFocused
						? 'outline-2 outline-offset-0 outline-red-500 bg-gray-50/90 backdrop-blur-md shadow-xl'
						: 'outline-none shadow-lg'
				}`}
				onClick={() => updateSearchInputFocused(true)}
			>
				<p className="text-lg text-neutral-400">
					<FaMagnifyingGlass />
				</p>
				<input
					ref={searchBarRef}
					type="text"
					placeholder="Search by name, note, or category"
					value={searchTerm}
					onChange={(e) => updateSearchTerm(e.target.value)}
					// onFocus={() => setSearchInputFocused(true)}
					// onBlur={(e) => {
					// 	console.log(e.relatedTarget);
					// 	if (e.relatedTarget === null) {
					// 		e.target.focus();
					// 		setSearchInputFocused(true);
					// 	} else {
					// 		setSearchInputFocused(false);
					// 	}
					// }}
					className="w-full h-[48px] bg-transparent outline-none md:text-lg text-md text-gray-900 text-ellipsis"
				/>
				<ActiveFilters filters={filters} />
				<ClearButton
					searchTerm={searchTerm}
					updateSearchTerm={updateSearchTerm}
				/>
			</div>
			<AnimatePresence>
				{searchInputFocused && (
					<motion.div
						onClick={(e) => e.preventDefault()}
						className="w-full max-w-[500px] flex flex-row gap-2 justify-center pointer-events-auto"
						initial={{ opacity: 0, transform: 'translateY(-16px)' }}
						animate={{ opacity: 1, transform: 'translateY(0px)' }}
						exit={{ opacity: 0, transform: 'translateY(-16px)' }}
						transition={{ duration: 0.15 }}
					>
						<FilterButton
							text={
								filters.open.mode === FilterMode.False
									? 'Closed now'
									: 'Open now'
							}
							filter={filters.open}
							onClick={() => updateFilter(FilterType.Open)}
						/>
						<FilterButton
							text={
								filters.visited.mode === FilterMode.False
									? 'Not visited'
									: 'Visited'
							}
							filter={filters.visited}
							onClick={() => updateFilter(FilterType.Visited)}
						/>
						<FilterButton
							text={
								filters.claimed.mode === FilterMode.False
									? 'Unclaimed'
									: 'Claimed'
							}
							filter={filters.claimed}
							onClick={() => updateFilter(FilterType.Claimed)}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default SearchBar;
