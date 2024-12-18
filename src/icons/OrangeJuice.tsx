import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgOrangeJuice = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="-52 0 512 512"
		{...props}
	>
		<path d="M210 142c0-57.898-47.102-105-105-105S0 84.102 0 142s47.102 105 105 105 105-47.102 105-105m-55.293 56.094a75 75 0 0 1-25.965 15.031L105 172l-23.742 41.125a74.95 74.95 0 0 1-25.965-15.027L79.02 157H31.508C30.52 152.152 30 147.137 30 142s.52-10.152 1.508-15H79.02L55.293 85.906a75 75 0 0 1 25.965-15.031L105 112l23.742-41.125a74.95 74.95 0 0 1 25.965 15.027L130.98 127h47.512c.988 4.848 1.508 9.863 1.508 15s-.52 10.152-1.508 15H130.98zM392 0h-50c-24.812 0-45 20.188-45 45v52h30V45c0-8.27 6.73-15 15-15h50c8.285 0 15-6.715 15-15s-6.715-15-15-15M375 127H239.16c.55 4.926.84 9.93.84 15 0 27.73-8.41 53.535-22.805 75h163.418l9.27-73.113A15 15 0 0 0 375 127M106.988 276.977l28.133 221.91A14.996 14.996 0 0 0 150 512h180c7.555 0 13.934-5.617 14.883-13.113L376.809 247H189.75c-22.707 18.363-51.46 29.52-82.762 29.977m0 0" />
	</svg>
);
const Memo = memo(SvgOrangeJuice);
export default Memo;
