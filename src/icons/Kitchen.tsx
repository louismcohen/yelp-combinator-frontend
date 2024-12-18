import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgKitchen = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="0 0 512 512"
		{...props}
	>
		<path d="M15 90h111c8.285 0 15-6.715 15-15V15c0-8.285-6.715-15-15-15H15C6.715 0 0 6.715 0 15v60c0 8.285 6.715 15 15 15M497 0H386c-8.285 0-15 6.715-15 15v60c0 8.285 6.715 15 15 15h111c8.285 0 15-6.715 15-15V15c0-8.285-6.715-15-15-15M121 512h270V302H121zm60-135c0-8.285 6.715-15 15-15h120c8.285 0 15 6.715 15 15v60c0 8.285-6.715 15-15 15H196c-8.285 0-15-6.715-15-15zm0 0" />
		<path d="M211 392h90v30h-90zM131 215c0 8.285 6.715 15 15 15h220c8.285 0 15-6.715 15-15v-45H131zM373.21 140 341 99.738V15c0-8.285-6.715-15-15-15H186c-8.285 0-15 6.715-15 15v84.738L138.79 140zM497 302h-76v60h91v-45c0-8.285-6.715-15-15-15M421 512h76c8.285 0 15-6.715 15-15V392h-91zM0 317v45h91v-60H15c-8.285 0-15 6.715-15 15M0 497c0 8.285 6.715 15 15 15h76V392H0zm0 0" />
	</svg>
);
const Memo = memo(SvgKitchen);
export default Memo;
