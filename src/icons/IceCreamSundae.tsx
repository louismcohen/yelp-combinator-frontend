import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgIceCreamSundae = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="-31 0 512 512"
		{...props}
	>
		<path d="M225 482c-28.547 0-55.766-5.555-80.914-15.297l-19.691 19.692a14.98 14.98 0 0 0-3.25 16.347c2.312 5.61 7.793 9.258 13.855 9.258h180c6.063 0 11.543-3.648 13.855-9.258a14.98 14.98 0 0 0-3.25-16.347l-19.69-19.692C280.764 476.445 253.546 482 225 482M15 271h255v-45c0-8.285-6.715-15-15-15H30c-16.57 0-30 13.43-30 30v15c0 8.285 6.715 15 15 15M450 256v-15c0-16.57-13.43-30-30-30h-45c-8.285 0-15 6.715-15 15v45h75c8.285 0 15-6.715 15-15M414.55 301h-57.312c-6.215 17.422-22.707 30-42.238 30s-36.023-12.578-42.238-30H35.449C55.848 386.863 132.99 452 225 452s169.152-65.137 189.55-151M415.605 4.395c-5.859-5.86-15.351-5.86-21.21 0l-54.122 55.109c.247.887.59 1.723.813 2.617 11.105 1.04 21.816 3.293 31.844 7.16l42.675-43.676c5.86-5.859 5.86-15.351 0-21.21M310.113 63.012C298.293 27.102 264.867 0 225 0s-73.293 27.102-85.113 63.012c36.925 6.218 67.812 29.312 85.113 61.101 17.3-31.789 48.187-54.883 85.113-61.101m0 0" />
		<path d="M315 301c8.285 0 15-6.715 15-15v-60c0-24.852 20.148-45 45-45h45c0-49.707-40.293-90-90-90s-90 40.293-90 90h15c24.852 0 45 20.148 45 45v60c0 8.285 6.715 15 15 15M30 181h180c0-49.707-40.293-90-90-90s-90 40.293-90 90m0 0" />
	</svg>
);
const Memo = memo(SvgIceCreamSundae);
export default Memo;
