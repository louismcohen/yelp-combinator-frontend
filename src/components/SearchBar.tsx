import { forwardRef, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';

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
					className={`w-full max-w-[500px] bg-slate-50/95 flex justify-center items-center px-4 shadow-xl rounded-lg overflow-hidden border-slate-300/5 ${
						isFocused && 'outline-2 outline-red-500'
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
						className="w-full h-[48px] bg-transparent outline-none text-lg text-gray-900 p-3 rounded-lg"
					/>
					<button onClick={() => setSearchTerm('')}></button>
				</div>
			</div>
		);
	},
);

export default SearchBar;