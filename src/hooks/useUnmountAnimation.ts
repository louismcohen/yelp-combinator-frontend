import { useEffect, useState } from 'react';

export const useUnmountAnimation = (
	isDisappearing: boolean,
	duration: number,
	onAnimationComplete?: () => void,
) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if (!isDisappearing) {
			setMounted(true);
		} else {
			const timer = setTimeout(() => {
				setMounted(false);
				onAnimationComplete?.();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [isDisappearing, duration, onAnimationComplete]);

	return mounted;
};
