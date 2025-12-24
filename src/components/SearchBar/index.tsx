import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';
import { FaMagnifyingGlass, FaWandMagicSparkles } from 'react-icons/fa6';
import { useAiSearch } from '../../hooks/useAiSearch';
import { useMapStore } from '../../store/mapStore';
import { useSearchFilterStore } from '../../store/searchFilterStore';
import { FilterType } from '../../types/searchFilter';
import { FilterMode } from '../../types/searchFilter';
import { cn } from '../../utils/cn';
import { ActiveFilters } from './ActiveFilters';
import { ClearButton } from './ClearButton';
import { FilterButton } from './FilterButton';
import { ResetButton } from './ResetButton';
import { SearchButton } from './SearchButton';

const ENABLE_AI_SEARCH_FEATURE =
	import.meta.env.VITE_ENABLE_AI_SEARCH_FEATURE === 'true';

export const SearchBar = () => {
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
				if (searchTerm !== '' && aiSearchEnabled && searchInputFocused) {
					mutation.mutate({ query: searchTerm });
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [
		searchTerm,
		aiSearchEnabled,
		searchInputFocused,
		viewport,
		mutation.mutate,
	]);

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
				focused: 'outline-2 outline-teal-500',
				normal: 'outline-offset-0 outline-neutral-700/15 outline-1',
		  }
		: {
				hover: 'hover:outline-red-500',
				focused: 'outline-2 outline-red-500',
				normal: 'outline-offset-0 outline-neutral-700/15 outline-1',
		  };

	const handleSearchClick = useCallback(() => {
		if (aiSearchEnabled && searchTerm !== '') {
			mutation.mutate({ query: searchTerm });
		}
	}, [aiSearchEnabled, searchTerm, mutation.mutate]);

	return (
		<div className="absolute top-0 flex flex-col gap-2 justify-center items-center w-full p-4 pointer-events-none">
			<div
				className={cn(
					'w-full max-w-[500px] transition-all duration-150 rounded-full overflow-hidden pointer-events-auto outline-none outline-offset-1 hover:outline-2 hover:outline-offset-0',
					'flex flex-row items-center',
					'pl-1 pr-3',
					outline.hover,
					searchInputFocused
						? `${outline.focused} bg-gray-50/90 backdrop-blur-md shadow-xl`
						: `shadow-lg ${outline.normal}`,
					mutation.isPending
						? 'bg-teal-50/85'
						: 'bg-gray-50/85 backdrop-blur-sm',
				)}
			>
				<div className="flex flex-row w-full gap-0 justify-center items-center">
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							if (!ENABLE_AI_SEARCH_FEATURE) {
								searchBarRef.current?.focus();
							} else {
								updateAiSearchEnabled(!aiSearchEnabled);
							}
						}}
						className={cn(
							'cursor-pointer flex justify-center items-center h-[48px] w-[48px] transition-all duration-300 text-lg text-neutral-400 bg-transparent border-none outline-none p-0',
							'focus:outline-none',
							aiSearchEnabled
								? 'hover:text-teal-500'
								: ENABLE_AI_SEARCH_FEATURE && 'hover:text-red-500',
							aiSearchEnabled
								? 'hover:text-shadow-lg hover:shadow-teal-500'
								: ENABLE_AI_SEARCH_FEATURE &&
										'hover:text-shadow-lg hover:shadow-red-500',
						)}
					>
						{aiSearchEnabled ? (
							<FaWandMagicSparkles size={16} />
						) : (
							<FaMagnifyingGlass size={16} />
						)}
					</button>
					<input
						id="search-term"
						ref={searchBarRef}
						tabIndex={0}
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
						className="w-full h-[48px] bg-transparent outline-none md:text-lg text-md text-gray-900 text-ellipsis focus:outline-none"
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
				<AnimatePresence>
					{!aiSearchEnabled && searchTerm !== '' && (
						<ClearButton
							searchTerm={searchTerm}
							updateSearchTerm={updateSearchTerm}
						/>
					)}
				</AnimatePresence>
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
						<div className="flex-grow flex flex-row gap-2 justify-center items-center">
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
