import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgFoodTrolley = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="0 0 512 512"
		{...props}
	>
		<path d="M497 200H15c-8.285 0-15 6.715-15 15s6.715 15 15 15h36v157c0 8.285 6.715 15 15 15h17v21.922C64.508 429.516 51 446.707 51 467c0 24.813 20.188 45 45 45s45-20.187 45-45c0-18.8-11.594-34.934-28-41.656V402h286v23.344c-16.406 6.722-28 22.855-28 41.656 0 24.813 20.188 45 45 45s45-20.187 45-45c0-20.293-13.508-37.484-32-43.078V402h17c8.285 0 15-6.715 15-15V230h36c8.285 0 15-6.715 15-15s-6.715-15-15-15M96 482c-8.27 0-15-6.73-15-15s6.73-15 15-15 15 6.73 15 15-6.73 15-15 15m335-15c0 8.27-6.73 15-15 15s-15-6.73-15-15 6.73-15 15-15 15 6.73 15 15M271 40.992V30h5c8.285 0 15-6.715 15-15s-6.715-15-15-15h-40c-8.285 0-15 6.715-15 15s6.715 15 15 15h5v10.992c-40.926 5.36-75.156 32.301-90.824 69.008h211.648C346.156 73.293 311.926 46.352 271 40.992M136 170h240c8.285 0 15-6.715 15-15s-6.715-15-15-15H136c-8.285 0-15 6.715-15 15s6.715 15 15 15m0 0" />
	</svg>
);
const Memo = memo(SvgFoodTrolley);
export default Memo;
