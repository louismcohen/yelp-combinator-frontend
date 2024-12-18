import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgChocolate = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="-61 0 512 512"
		{...props}
	>
		<path d="M390 285c0-24.812-20.187-45-45-45H45c-24.812 0-45 20.188-45 45v30c0 7.34 5.305 14.594 12.54 15.797l360 60a14.974 14.974 0 0 0 12.156-3.355A14.96 14.96 0 0 0 390 376zM120 379.117V421h150v-16.883zm0 0" />
		<path d="M30 364.117V497c0 8.29 6.71 15 15 15h300c8.29 0 15-6.71 15-15v-77.883l-60-10V436c0 8.29-6.71 15-15 15H105c-8.29 0-15-6.71-15-15v-61.883zM360 120H210v90h150zm-60 60h-30c-8.29 0-15-6.71-15-15s6.71-15 15-15h30c8.29 0 15 6.71 15 15s-6.71 15-15 15M180 0H45c-8.29 0-15 6.71-15 15v75h150zm-60 60H90c-8.29 0-15-6.71-15-15s6.71-15 15-15h30c8.29 0 15 6.71 15 15s-6.71 15-15 15M30 210h150v-90H30zm60-60h30c8.29 0 15 6.71 15 15s-6.71 15-15 15H90c-8.29 0-15-6.71-15-15s6.71-15 15-15M345 0H210v90h150V15c0-8.29-6.71-15-15-15m-45 60h-30c-8.29 0-15-6.71-15-15s6.71-15 15-15h30c8.29 0 15 6.71 15 15s-6.71 15-15 15m0 0" />
	</svg>
);
const Memo = memo(SvgChocolate);
export default Memo;
