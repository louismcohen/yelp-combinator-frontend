import { initialFilterState } from '../../store/searchFilterStore';
import { Badge } from '../Badge';

interface VisitedButtonProps {
	visited: boolean;
	onClick: () => void;
}

export const VisitedButton = ({ visited, onClick }: VisitedButtonProps) => {
	return (
		<Badge
			isActive={visited}
			trueIcon={initialFilterState.visited.trueIcon}
			falseIcon={initialFilterState.visited.falseIcon}
			trueLabel="Visited"
			falseLabel="Not Visited"
			activeIconColor="text-neutral-50"
			inactiveIconColor="text-green-400"
			activeBgColor="bg-green-600/75"
			hoverBorderColor="hover:border-green-400/50"
			onClick={onClick}
		/>
	);
};
