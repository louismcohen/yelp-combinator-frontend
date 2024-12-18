import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgSeasoning = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="-61 0 511 512"
		{...props}
	>
		<path d="M54.59 180h280c8.281 0 15-6.715 15-15v-30c0-8.285-6.719-15-15-15h-5.84C321.266 52.594 263.957 0 194.59 0 125.219 0 67.914 52.594 60.426 120H54.59c-8.285 0-15 6.715-15 15v30c0 8.285 6.715 15 15 15m180-105c8.281 0 15 6.715 15 15s-6.719 15-15 15c-8.285 0-15-6.715-15-15s6.715-15 15-15m-40-27c8.281 0 15 6.715 15 15s-6.719 15-15 15c-8.285 0-15-6.715-15-15s6.715-15 15-15m-40 27c8.281 0 15 6.715 15 15s-6.719 15-15 15c-8.285 0-15-6.715-15-15s6.715-15 15-15M338.43 270h11.543l-15.895-60H55.098l-15.895 60zM385.797 405.234 357.922 300H31.258L3.378 405.234c-6.808 25.704-1.413 52.532 14.806 73.606S58.954 512 85.547 512h218.086c26.59 0 51.144-12.086 67.36-33.16 16.218-21.07 21.612-47.902 14.804-73.606m0 0" />
	</svg>
);
const Memo = memo(SvgSeasoning);
export default Memo;
