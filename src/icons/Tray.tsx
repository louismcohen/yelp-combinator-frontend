import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgTray = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="0 -81 512 512"
		{...props}
	>
		<path d="M408.027 122.973C370.977 85.922 322.781 64.066 271 60.523V30h15c8.285 0 15-6.715 15-15s-6.715-15-15-15h-60c-8.285 0-15 6.715-15 15s6.715 15 15 15h15v30.523c-51.781 3.543-99.977 25.399-137.027 62.45-29.785 29.78-49.739 66.77-58.27 107.027h420.594c-8.531-40.258-28.485-77.246-58.27-107.027M497 260H15c-8.285 0-15 6.715-15 15 0 41.355 33.645 75 75 75h362c41.355 0 75-33.645 75-75 0-8.285-6.715-15-15-15m0 0" />
	</svg>
);
const Memo = memo(SvgTray);
export default Memo;
