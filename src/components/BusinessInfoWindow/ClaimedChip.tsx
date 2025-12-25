import { initialFilterState } from '../../store/searchFilterStore';
import { Badge } from '../Badge';

interface ClaimedChipProps {
	claimed: boolean;
}

export const ClaimedChip = ({ claimed }: ClaimedChipProps) => {
	return (
		<Badge
			isActive={claimed}
			trueIcon={initialFilterState.claimed.trueIcon}
			falseIcon={initialFilterState.claimed.falseIcon}
			trueLabel="Claimed"
			falseLabel="Unclaimed"
			activeIconColor="text-blue-400"
			inactiveIconColor="text-neutral-50"
			activeBgColor=""
			inactiveBgColor="bg-blue-600/75"
		/>
	);
};
