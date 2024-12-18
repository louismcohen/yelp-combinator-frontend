import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgCheese = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="0 0 512 512"
		{...props}
	>
		<path d="M354 327c-13.785 0-25 11.215-25 25s11.215 25 25 25 25-11.215 25-25-11.215-25-25-25M284 97c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35m0 0" />
		<path d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256c0 8.285 6.715 15 15 15h226v226c0 8.285 6.715 15 15 15 68.379 0 132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02M144 207c-24.812 0-45-20.187-45-45s20.188-45 45-45 45 20.188 45 45-20.187 45-45 45m75-75c0-35.84 29.16-65 65-65s65 29.16 65 65-29.16 65-65 65-65-29.16-65-65m135 275c-30.328 0-55-24.672-55-55s24.672-55 55-55 55 24.672 55 55-24.672 55-55 55m55-160c-8.285 0-15-6.715-15-15s6.715-15 15-15 15 6.715 15 15-6.715 15-15 15m0 0" />
		<path d="M144 147c-8.27 0-15 6.73-15 15s6.73 15 15 15 15-6.73 15-15-6.73-15-15-15m0 0" />
	</svg>
);
const Memo = memo(SvgCheese);
export default Memo;
