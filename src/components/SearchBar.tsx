import { AnimatePresence, motion } from 'motion/react';
import {
	MouseEventHandler,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	FaArrowRotateLeft,
	FaArrowUp,
	FaMagnifyingGlass,
	FaWandMagicSparkles,
	FaXmark,
} from 'react-icons/fa6';
import { useSearchFilterStore } from '../store/searchFilterStore';
import { SearchFilter } from '../types/searchFilter';
import {
	Filter,
	FilterColor,
	FilterMode,
	FilterType,
} from '../types/searchFilter';
import { useMapStore } from '../store/mapStore';
import { useAiSearch } from '../hooks/useAiSearch';
import { HashLoader } from 'react-spinners';

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
				className={`w-[24px] h-[24px] flex justify-center items-center transition-all bg-neutral-400 rounded-full outline-hidden hover:outline-hidden hover:border-none focus:outline-hidden p-0 ${
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

const AiSearchButton = () => {
	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			className="w-[36px] h-[36px] flex justify-center items-center transition-all bg-gray-50/95 rounded-full outline-hidden hover:outline-hidden focus:outline-hidden p-0"
		>
			<FaMagnifyingGlass size={16} color={'black'} />
		</motion.button>
	);
};

interface SearchButtonProps {
	searchTerm: string;
	isLoading: boolean;
	onClick: () => void;
}

const SearchButton = ({
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
				className={`w-[24px] h-[24px] flex justify-center items-center transition-all bg-neutral-400 rounded-full outline-hidden hover:outline-hidden hover:border-none focus:outline-hidden p-0 ${
					searchTerm === ''
						? 'disabled opacity-50 cursor-default'
						: ' hover:bg-teal-500 hover:shadow-md hover:shadow-teal-500/25 active:bg-teal-600'
				} ${isLoading && 'bg-teal-500 shadow-md shadow-teal-500/25'}`}
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
		green: 'hover:border-green-700/70 hover:bg-green-50/95',
		red: 'hover:border-red-700/70 hover:bg-red-50/95',
		purple: 'hover:border-purple-700/70 hover:bg-purple-50/95',
		blue: 'hover:border-blue-700/70 hover:bg-blue-50/95',
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
			className={`relative w-1/3 flex flex-row gap-1 md:gap-2 justify-center items-center outline-hidden transition-all cursor-pointer ${
				hoverColorVariants[filter.color]
			} focus:outline-hidden bg-gray-50/95 border rounded-md py-2 px-0 md:px-3 shadow-lg z-10 text-xs md:text-sm  ${determineFilterStyles(
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

const ResetButton = ({
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
			className={`w-[36px] h-auto py-0 px-0 flex justify-center items-center transition-all bg-gray-50/95 text-sm md:text-md text-neutral-500 border-neutral-400 border rounded-md shadow-lg outline-hidden hover:outline-hidden focus:outline-hidden hover:border-amber-500 hover:bg-amber-50/95 ${
				isReset && 'pointer-events-none'
			}`}
			onClick={onClick}
		>
			<FaArrowRotateLeft />
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
			<div className="flex grow flex-row gap-2 justify-end items-center transition-all text-md">
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
	const mutation = useAiSearch();

	const {
		searchTerm,
		updateSearchTerm,
		searchInputFocused,
		updateSearchInputFocused,
		filters,
		updateFilter,
		resetFilters,
		isReset,
		aiSearchEnabled,
		updateAiSearchEnabled,
	} = useSearchFilterStore();

	const { viewport } = useMapStore();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				console.log('MapCenter: Enter key pressed', {
					searchTerm,
					aiSearchEnabled,
					searchInputFocused,
				});
				if (searchTerm !== '' && aiSearchEnabled && searchInputFocused) {
					console.log(
						'MapCenter criteria met for mutation',
						searchTerm,
						viewport,
					);
					mutation.mutate({ query: searchTerm });
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [searchTerm, aiSearchEnabled, searchInputFocused]);

	useEffect(() => {
		if (searchBarRef.current) {
			searchInputFocused
				? searchBarRef.current.focus()
				: searchBarRef.current.blur();
		}
	}, [searchInputFocused]);

	const outline = aiSearchEnabled
		? {
				hover: 'hover:outline-teal-500',
				normal: 'outline-teal-500',
		  }
		: {
				hover: 'hover:outline-red-500',
				normal: 'outline-red-500',
		  };

	const handleSearchClick = useCallback(() => {
		if (aiSearchEnabled && searchTerm !== '') {
			mutation.mutate({ query: searchTerm });
		}
	}, [aiSearchEnabled, searchTerm]);

	return (
		<div className="absolute top-0 flex flex-col gap-2 justify-center items-center w-full p-4 pointer-events-none">
			<div
				tabIndex={0}
				className={`w-full max-w-[500px] pointer-events-auto outline-hidden hover:outline-2 hover:outline-offset-0 ${
					outline.hover
				} backdrop-blur-xs transition-all duration-300 flex justify-center items-center pr-3 gap-2 rounded-lg overflow-hidden border border-neutral-500/10 ${
					searchInputFocused
						? `outline-2 outline-offset-0 ${outline.normal} bg-gray-50/90 backdrop-blur-md shadow-xl`
						: `shadow-lg outline-hidden`
				} ${mutation.isPending ? 'bg-teal-50/85' : 'bg-gray-50/85'}`}
			>
				<div className="flex flex-row w-full gap-0 justify-center items-center">
					<div
						onClick={(e) => {
							e.preventDefault();
							updateAiSearchEnabled(!aiSearchEnabled);
						}}
						className={`cursor-pointer flex justify-center items-center h-[48px] w-[48px] transition-all duration-300 text-lg text-neutral-400 ${
							aiSearchEnabled ? 'hover:text-teal-500' : 'hover:text-red-500'
						} hover:text-shadow-lg hover:shadow-teal-500`}
					>
						{aiSearchEnabled ? <FaWandMagicSparkles /> : <FaMagnifyingGlass />}
					</div>
					<input
						ref={searchBarRef}
						type="text"
						placeholder={
							aiSearchEnabled
								? 'Search using natural language'
								: 'Filter by name, note, or category'
						}
						value={searchTerm}
						onChange={(e) => {
							e.preventDefault();
							updateSearchTerm(e.target.value);
						}}
						onFocus={() => updateSearchInputFocused(true)}
						// onBlur={() => updateSearchInputFocused(false)}
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
						className="w-full h-[48px] bg-transparent outline-hidden md:text-lg text-md text-gray-900 text-ellipsis focus:outline-hidden"
					/>
				</div>
				<ActiveFilters filters={filters} />
				<AnimatePresence>
					{aiSearchEnabled && (
						<SearchButton
							searchTerm={searchTerm}
							onClick={handleSearchClick}
							isLoading={mutation.isPending}
						/>
					)}
				</AnimatePresence>
				{/* <ClearButton
					searchTerm={searchTerm}
					updateSearchTerm={updateSearchTerm}
				/> */}
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
						<ResetButton isReset={isReset} onClick={resetFilters} />
						<div className="grow flex flex-row gap-2 justify-center items-center">
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
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default SearchBar;
