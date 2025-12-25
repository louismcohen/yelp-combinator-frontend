import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
	isActive: boolean;
	trueIcon: ReactNode;
	falseIcon: ReactNode;
	trueLabel: string;
	falseLabel: string;
	activeIconColor: string;
	inactiveIconColor: string;
	activeBgColor: string;
	inactiveBgColor?: string;
	hoverBorderColor?: string;
	onClick?: () => void;
	className?: string;
}

export const Badge = ({
	isActive,
	trueIcon,
	falseIcon,
	trueLabel,
	falseLabel,
	activeIconColor,
	inactiveIconColor,
	activeBgColor,
	inactiveBgColor,
	hoverBorderColor,
	onClick,
	className,
}: BadgeProps) => {
	const iconColor = isActive ? activeIconColor : inactiveIconColor;
	const icon = isActive ? trueIcon : falseIcon;
	const label = isActive ? trueLabel : falseLabel;

	const baseClasses =
		'h-[24px] flex px-3 py-4 gap-2 justify-center items-center transition-all duration-150 ease-in-out bg-neutral-900/50 rounded-lg outline-none hover:outline-none focus:outline-none shadow-md backdrop-blur-sm text-sm text-neutral-50';

	const isButton = onClick !== undefined;

	const getStateClasses = () => {
		if (isActive) {
			if (activeBgColor) {
				return `${activeBgColor} text-neutral-50 font-medium border border-neutral-50/10`;
			}
			return 'border border-neutral-700/15';
		}
		if (inactiveBgColor) {
			return `${inactiveBgColor} text-neutral-50 font-medium border border-neutral-50/10`;
		}
		return 'border border-neutral-700/15';
	};

	const children = (
		<>
			<span className={iconColor}>{icon}</span>
			{label}
		</>
	);

	if (isButton) {
		return (
			<motion.button
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.95 }}
				className={cn(
					baseClasses,
					'pointer-events-auto cursor-pointer',
					hoverBorderColor,
					'hover:drop-shadow-lg',
					getStateClasses(),
					className,
				)}
				onClick={onClick}
			>
				{children}
			</motion.button>
		);
	}

	return (
		<div
			className={cn(
				baseClasses,
				'pointer-events-none',
				getStateClasses(),
				className,
			)}
		>
			{children}
		</div>
	);
};
