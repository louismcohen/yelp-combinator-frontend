import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgCocktail = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		viewBox="0 0 448 448"
		width="true"
		height="true"
		{...props}
	>
		<path d="M428.505 26.016c3.84-4.8 4.608-11.392 1.92-16.928C427.737 3.52 422.137 0 415.993 0h-384a16.05 16.05 0 0 0-14.432 9.056c-2.656 5.536-1.92 12.128 1.92 16.928l188.512 235.648V416h-64c-8.832 0-16 7.168-16 16s7.168 16 16 16h160c8.832 0 16-7.168 16-16s-7.168-16-16-16h-64V261.632zM90.905 64l-25.6-32h317.408l-25.6 32z" />
	</svg>
);
const Memo = memo(SvgCocktail);
export default Memo;
