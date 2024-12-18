import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgBubbleTea = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="0 0 512 512"
		{...props}
	>
		<circle cx={320} cy={440} r={8} />
		<circle cx={296} cy={384} r={8} />
		<circle cx={216} cy={384} r={8} />
		<circle cx={256} cy={440} r={8} />
		<path d="M224 176h-87.59l2.4 48H224zM400 152a8.01 8.01 0 0 0-8-8H120a8.01 8.01 0 0 0-8 8v8h288zM240 176h32v48h-32zM288 224h85.19l2.4-48H288zM149.71 442a39.97 39.97 0 0 0 39.95 38h132.68a39.97 39.97 0 0 0 39.95-38l10.1-202H139.61zM344 440a24 24 0 1 1-24-24 24.03 24.03 0 0 1 24 24m-48-80a24 24 0 1 1-24 24 24.03 24.03 0 0 1 24-24m-16 80a24 24 0 1 1-24-24 24.027 24.027 0 0 1 24 24m-64-80a24 24 0 1 1-24 24 24.027 24.027 0 0 1 24-24m-24 56a24 24 0 1 1-24 24 24.027 24.027 0 0 1 24-24M240 32h32v96h-32z" />
		<circle cx={192} cy={440} r={8} />
	</svg>
);
const Memo = memo(SvgBubbleTea);
export default Memo;
