import { AnimatePresence, motion } from 'motion/react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import {
	FaMagnifyingGlass,
	FaXmark,
	FaDoorOpen,
	FaDoorClosed,
	FaCircleCheck,
	FaRegCircleCheck,
	FaHandshakeSimple,
	FaHandshakeSimpleSlash,
} from 'react-icons/fa6';

interface SearchBarProps {
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	searchInputFocused: boolean;
	setSearchInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
}

enum FilterMode {
	Disabled,
	True,
	False,
}

type FilterColor = 'green' | 'red' | 'purple' | 'blue';

type FilterType = 'open' | 'visited' | 'claimed';

interface Filter {
	type: FilterType;
	mode: FilterMode;
	color: FilterColor;
	trueIcon: React.ReactNode;
	falseIcon: React.ReactNode;
}

interface FilterButtonProps {
	text: string;
	filter: Filter;
}

const FilterButton = ({ text, filter }: FilterButtonProps) => {
	const textColorVariants = {
		green: 'text-green-600',
		red: 'text-red-600',
		purple: 'text-purple-600',
		blue: 'text-blue-600',
	};

	const containerColorVariants = {
		green: 'border-green-700',
		red: 'border-red-700',
		purple: 'border-purple-700',
		blue: 'border-blue-700',
	};

	const statusVariants = {
		[FilterMode.Disabled]: 'text-neutral-600',
		[FilterMode.True]: 'opacity-100',
		[FilterMode.False]: 'opacity-100',
	};

	const determineFilterStyles = (status: FilterMode, color: FilterColor) => {
		if (status === FilterMode.True) {
			return `${containerColorVariants[color]} ${textColorVariants[color]}`;
		} else if (status === FilterMode.False) {
			return `${containerColorVariants[color]} ${textColorVariants[color]}`;
		} else {
			return 'text-neutral-600 border-neutral-400';
		}
	};

	return (
		<div
			className={`flex flex-row gap-2 justify-center items-center bg-neutral-50/95 border rounded-md py-2 px-3 shadow-lg z-10 cursor-pointer ${determineFilterStyles(
				filter.mode,
				filter.color,
			)}`}
		>
			{filter.mode === FilterMode.False ? filter.falseIcon : filter.trueIcon}
			<p className={`text-sm font-semibold`}>{text}</p>
		</div>
	);
};

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
	(
		{ searchTerm, setSearchTerm, searchInputFocused, setSearchInputFocused },
		ref,
	) => {
		const searchBarRef = useRef<HTMLInputElement>(null);

		useEffect(() => {
			if (searchBarRef.current) {
				searchInputFocused
					? searchBarRef.current.focus()
					: searchBarRef.current.blur();
			}
		}, [searchInputFocused]);

		return (
			<div className="absolute top-0 flex flex-col gap-2 justify-center items-center w-full p-4">
				<div
					tabIndex={0}
					className={`w-full max-w-[500px] hover:outline-2 hover:outline-offset-0 hover:outline-red-500 bg-neutral-50/95 transition-all duration-300 flex justify-center items-center px-3 gap-2 rounded-lg overflow-hidden border border-neutral-500/10 outline ${
						searchInputFocused
							? 'outline-2 outline-offset-0 outline-red-500 backdrop-blur-md shadow-xl'
							: 'outline-none shadow-lg'
					}`}
					onClick={() => setSearchInputFocused(true)}
					onBlur={(e) => console.log('div onBlur', e.relatedTarget)}
				>
					<p className="text-lg text-neutral-400">
						<FaMagnifyingGlass />
					</p>
					<input
						ref={searchBarRef}
						type="text"
						placeholder="Search by name, note, or category"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
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
						className="w-full h-[48px] bg-transparent outline-none text-lg text-gray-900 rounded-lg"
					/>
					<AnimatePresence>
						{searchTerm !== '' && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
								onClick={() => setSearchTerm('')}
								className="h-[36px] w-[36px] flex justify-center items-center cursor-pointer"
							>
								<div className="w-[24px] h-[24px] flex justify-center items-center bg-neutral-400 hover:bg-neutral-500 rounded-full">
									<FaXmark size={16} color={'white'} />
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<AnimatePresence>
					{searchInputFocused && (
						<motion.div
							onClick={(e) => e.preventDefault()}
							className="w-full max-w-[500px] flex flex-row gap-2 justify-starttransition-all"
							initial={{ opacity: 0, transform: 'translateY(-16px)' }}
							animate={{ opacity: 1, transform: 'translateY(0px)' }}
							exit={{ opacity: 0, transform: 'translateY(-16px)' }}
							transition={{ duration: 0.15 }}
						>
							<FilterButton
								text="Open now"
								filter={{
									type: 'open',
									mode: FilterMode.Disabled,
									color: 'purple',
									trueIcon: <FaDoorOpen />,
									falseIcon: <FaDoorClosed />,
								}}
							/>
							<FilterButton
								text="Visited"
								filter={{
									type: 'visited',
									mode: FilterMode.True,
									color: 'green',
									trueIcon: <FaCircleCheck />,
									falseIcon: <FaRegCircleCheck />,
								}}
							/>
							<FilterButton
								text="Claimed"
								filter={{
									type: 'claimed',
									mode: FilterMode.False,
									color: 'blue',
									trueIcon: <FaHandshakeSimple />,
									falseIcon: <FaHandshakeSimpleSlash />,
								}}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	},
);

export default SearchBar;
