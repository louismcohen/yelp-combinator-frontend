import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgUtensils = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="0 0 512 512"
		{...props}
	>
		<path d="M422 347v119.203c0 25.18 20.605 46.223 45.781 45.79C492.234 511.573 512 491.554 512 467V332h-75c-8.285 0-15 6.715-15 15M135 0c-8.285 0-15 6.715-15 15v141c0 8.27-6.73 15-15 15H90V15c0-8.285-6.715-15-15-15S60 6.715 60 15v156H45c-8.27 0-15-6.73-15-15V15c0-8.285-6.715-15-15-15S0 6.715 0 15v141c0 24.813 20.188 45 45 45h15v101h30V201h15c24.813 0 45-20.187 45-45V15c0-8.285-6.715-15-15-15M275 0c-48.648 0-85 67.191-85 127.273 0 28.684 8.578 52.563 24.813 69.059 11.976 12.172 27.41 19.809 45.187 22.531V302h30v-83.137c17.777-2.718 33.21-10.36 45.188-22.531C351.422 179.836 360 155.957 360 127.273 360 67.191 323.648 0 275 0M504.016 1.742a14.99 14.99 0 0 0-18.164 3.227c-29.946 33.27-53.332 72.152-69.516 115.558C400.187 163.844 392 209.563 392 256.422V287c0 8.285 6.715 15 15 15h105V15.434c0-5.672-2.969-11.051-7.984-13.692M305 332h-60c-8.285 0-15 6.715-15 15v119.203c0 25.18 20.605 46.223 45.781 45.79C300.234 511.573 320 491.554 320 467V347c0-8.285-6.715-15-15-15M105 332H45c-8.285 0-15 6.715-15 15v119.203c0 25.18 20.605 46.223 45.781 45.79C100.234 511.573 120 491.554 120 467V347c0-8.285-6.715-15-15-15m0 0" />
	</svg>
);
const Memo = memo(SvgUtensils);
export default Memo;
