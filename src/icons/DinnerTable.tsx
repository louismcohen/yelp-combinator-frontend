import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgDinnerTable = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="0 -76 512 512"
		{...props}
	>
		<path d="M75 150H30V15c0-8.285-6.715-15-15-15S0 6.715 0 15v330c0 8.285 6.715 15 15 15s15-6.715 15-15V240h90v105c0 8.285 6.715 15 15 15s15-6.715 15-15V226c0-.168-.02-.332-.023-.5.003-.168.023-.332.023-.5 0-41.355-33.645-75-75-75M497 0c-8.285 0-15 6.715-15 15v135h-45c-41.355 0-75 33.645-75 75 0 .168.02.332.023.5-.003.168-.023.332-.023.5v119c0 8.285 6.715 15 15 15s15-6.715 15-15V240h90v105c0 8.285 6.715 15 15 15s15-6.715 15-15V15c0-8.285-6.715-15-15-15m0 0" />
		<path d="M306 330h-35V108h115c8.285 0 15-6.715 15-15s-6.715-15-15-15H126c-8.285 0-15 6.715-15 15s6.715 15 15 15h115v222h-35c-8.285 0-15 6.715-15 15s6.715 15 15 15h100c8.285 0 15-6.715 15-15s-6.715-15-15-15m0 0" />
	</svg>
);
const Memo = memo(SvgDinnerTable);
export default Memo;
