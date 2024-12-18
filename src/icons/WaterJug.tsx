import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgWaterJug = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="0 0 512 512"
		{...props}
	>
		<path d="M482 90h-70v70h30v125c0 19.328 15.668 35 35 35 19.328 0 35-15.672 35-35V120c0-16.57-13.43-30-30-30M367 0H15A14.998 14.998 0 0 0 2.52 23.32L46.973 90H382V15c0-8.285-6.715-15-15-15M75 120H60v30h75c8.285 0 15 6.715 15 15s-6.715 15-15 15H60v30h75c8.285 0 15 6.715 15 15s-6.715 15-15 15H60v30h75c8.285 0 15 6.715 15 15s-6.715 15-15 15H60v30h75c8.285 0 15 6.715 15 15s-6.715 15-15 15H60v30h75c8.285 0 15 6.715 15 15s-6.715 15-15 15H60v77c0 8.285 6.715 15 15 15h292c8.285 0 15-6.715 15-15V120zm0 0" />
	</svg>
);
const Memo = memo(SvgWaterJug);
export default Memo;
