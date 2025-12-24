import { initialFilterState } from '../../store/searchFilterStore';
import { cn } from '../../utils/cn';

interface ClaimedChipProps {
	claimed: boolean;
}

export const ClaimedChip = ({ claimed }: ClaimedChipProps) => {
	const claimedColor = claimed ? 'text-blue-400' : 'text-gray-50';

	return (
		<div
			className={cn(
				'h-[24px] flex px-3 py-4 gap-2 pointer-events-none justify-center items-center transition-all duration-150 ease-in-out bg-gray-900/50 rounded-lg outline-none hover:outline-none focus:outline-none shadow-md backdrop-blur-sm text-sm text-gray-50',
				claimed ? '' : 'bg-blue-600/75 text-gray-50 font-medium',
			)}
		>
			<span className={`${claimedColor}`}>
				{claimed
					? initialFilterState.claimed.trueIcon
					: initialFilterState.claimed.falseIcon}
			</span>
			{claimed ? 'Claimed' : 'Unclaimed'}
		</div>
	);
};
