import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgBreakfast = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="0 0 510 510"
		{...props}
	>
		<path d="M255 0C114.39 0 0 114.39 0 255s114.39 255 255 255 255-114.39 255-255S395.61 0 255 0M70.14 349.31l-4.08 6.96c-4.17 7.114-13.326 9.57-20.53 5.35-7.14-4.19-9.54-13.38-5.35-20.52l4.08-6.96c4.19-7.15 13.38-9.55 20.53-5.36s9.54 13.38 5.35 20.53m-9.6-54.22c-2.3-7.96 2.29-16.28 10.25-18.57l8.36-2.41c7.95-2.3 16.27 2.29 18.57 10.25 2.29 7.96-2.3 16.27-10.26 18.57l-8.35 2.41c-7.952 2.29-16.265-2.279-18.57-10.25m46.65 96.57-4.08 6.96c-4.154 7.087-13.305 9.583-20.53 5.35-7.14-4.19-9.54-13.38-5.35-20.52l4.08-6.96c4.19-7.15 13.38-9.55 20.53-5.36 7.14 4.19 9.54 13.38 5.35 20.53m.12-36.29c-8.081 2.1-16.223-2.765-18.3-10.73l-2.03-7.81c-2.09-8.01 2.71-16.21 10.73-18.3 8.01-2.09 16.21 2.72 18.29 10.73l2.04 7.81c2.09 8.02-2.71 16.21-10.73 18.3m56.62 17.6c-4.181 7.134-13.379 9.538-20.53 5.35l-6.96-4.08c-7.15-4.19-9.54-13.38-5.35-20.53s13.38-9.54 20.53-5.35l6.96 4.08c7.14 4.19 9.54 13.38 5.35 20.53m300.76-34.59c-11.895 72.888-80.519 121.819-152.87 109.96l-52.04-8.5c-50.53-8.256-84.747-55.816-76.49-106.35l4.16-25.47c-61.68-12.67-108.2-67.38-108.2-132.75 0-74.73 60.79-135.52 135.52-135.52 59.21 0 109.67 38.16 128.07 91.18 18.96-11.52 41.16-15.86 63.29-12.25 50.72 8.29 85.25 56.29 76.97 107.02z" />
		<path d="M261.34 252.37c15.31 2.49 29.8-7.92 32.3-23.23l5.47-33.49c2.59-15.86 9.07-30.46 18.79-42.73-10.27-47.48-52.61-83.17-103.13-83.17-58.18 0-105.52 47.34-105.52 105.52 0 52.55 38.61 96.24 88.94 104.21 13.58-19.87 37.87-31.24 63.15-27.11m-55.62-34.84c-31.66 0-57.42-25.76-57.42-57.42s25.76-57.42 57.42-57.42c31.67 0 57.42 25.76 57.42 57.42s-25.75 57.42-57.42 57.42" />
		<circle
			cx={205.72}
			cy={160.11}
			r={27.42}
			transform="rotate(-84.32 205.813 160.12)"
		/>
		<path d="M401.29 148.29c-34.524-5.637-66.982 17.815-72.57 52.2-4.616 28.226-3.488 21.32-5.47 33.479-5.16 31.645-35.108 53.176-66.74 48.01-17.881-2.898-35.903 8.685-39.12 28.79l-4.5 27.55c-5.577 34.231 17.614 66.355 51.73 71.91l52.03 8.5c56.379 9.203 109.268-29.009 118.44-85.18l18.4-112.69c5.62-34.399-17.8-66.949-52.2-72.569M365.1 343.34l-49.07 11.07c-8.072 1.818-16.108-3.243-17.93-11.33-1.82-8.09 3.25-16.12 11.33-17.94l49.07-11.06c8.08-1.82 16.11 3.25 17.93 11.33s-3.25 16.11-11.33 17.93m31.87-68.3-49.07 11.07c-8.101 1.825-16.113-3.273-17.93-11.34-1.83-8.08 3.25-16.11 11.33-17.93l49.07-11.06c8.08-1.82 16.11 3.25 17.93 11.33s-3.25 16.11-11.33 17.93" />
	</svg>
);
const Memo = memo(SvgBreakfast);
export default Memo;
