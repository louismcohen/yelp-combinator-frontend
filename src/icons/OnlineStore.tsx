import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgOnlineStore = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="-81 0 512 512"
		{...props}
	>
		<path d="M0 478.387C0 496.922 15.7 512 35 512h280c19.3 0 35-15.078 35-33.613V361H0zM175 422c8.285 0 15 6.715 15 15s-6.715 15-15 15-15-6.715-15-15 6.715-15 15-15M175 179c-30.68 0-56.465 21.363-63.254 50h126.508c-6.79-28.637-32.574-50-63.254-50m0 0" />
		<path d="M315 0H35C15.7 0 0 15.7 0 35v296h350V35c0-19.3-15.7-35-35-35m-40 259H75c-8.285 0-15-6.715-15-15s6.715-15 15-15h6.188c6.433-40.395 38.417-72.379 78.812-78.812V139h-5c-8.285 0-15-6.715-15-15s6.715-15 15-15h40c8.285 0 15 6.715 15 15s-6.715 15-15 15h-5v11.188c40.395 6.433 72.379 38.417 78.813 78.812H275c8.285 0 15 6.715 15 15s-6.715 15-15 15m0 0" />
	</svg>
);
const Memo = memo(SvgOnlineStore);
export default Memo;
