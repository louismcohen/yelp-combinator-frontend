import { AnimatePresence, motion } from 'motion/react';
import { forwardRef, useState } from 'react';
import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';

interface SearchBarProps {
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
	({ searchTerm, setSearchTerm }, ref) => {
		const [isFocused, setIsFocused] = useState(false);

		return (
			<div className="absolute top-0 flex justify-center items-center flex-row w-full p-4">
				<div
					className={`w-full max-w-[500px] bg-neutral-50/95 transition-all flex justify-center items-center px-3 gap-2 shadow-xl rounded-lg overflow-hidden border-neutral-300/5 ${
						isFocused && 'outline-2 outline-red-500' && 'backdrop-blur-md'
					}`}
				>
					<p className="text-lg text-neutral-400">
						<FaMagnifyingGlass />
					</p>
					<input
						ref={ref}
						type="text"
						placeholder="Search by name, note, category"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
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
			</div>
		);
	},
);

export default SearchBar;
