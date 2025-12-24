import { motion } from "motion/react";
import { initialFilterState } from "../../store/searchFilterStore";

interface VisitedButtonProps {
	visited: boolean;
	onClick: () => void;
}

export const VisitedButton = ({ visited, onClick }: VisitedButtonProps) => {
	const visitedColor = visited ? "text-gray-50" : "text-green-400";

	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.95 }}
			className={`h-[24px] flex px-3 py-4 gap-2 pointer-events-auto cursor-pointer justify-center items-center transition-all duration-150 ease-in-out bg-gray-900/50 rounded-lg outline-none hover:outline-none focus:outline-none hover:border-green-400/50 shadow-md hover:drop-shadow-lg backdrop-blur-sm text-sm text-gray-50 ${
				visited ? "bg-green-600/75 text-gray-50" : ""
			}`}
			onClick={onClick}
		>
			<span className={`${visitedColor}`}>
				{visited
					? initialFilterState.visited.trueIcon
					: initialFilterState.visited.falseIcon}
			</span>
			{visited ? "Visited" : "Not Visited"}
		</motion.button>
	);
};
