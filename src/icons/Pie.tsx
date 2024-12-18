import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgPie = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="0 0 512 512"
		{...props}
	>
		<path d="M234.848 150C125.133 150 32.086 227.04 6.992 329.117c.11-.047.192-.137.305-.183 37.785-15.516 98.941-14.008 136.762 6.605 13.207 7.148 30.77 8.2 43.27 1.16 42.327-23.965 97.269-24.203 140.026.117 12.524 7.067 30.266 5.618 43.45-1.48 19.699-10.664 47.52-16.785 76.257-16.785 14.797 0 36.637 1.64 56.735 9.445.398.156.7.473 1.098.637C479.629 226.8 386.69 150 277.152 150zm-58.243 116.605-30 30c-5.859 5.86-15.351 5.86-21.21 0s-5.86-15.351 0-21.21l30-30c5.859-5.86 15.351-5.86 21.21 0s5.86 15.351 0 21.21M271 286c0 8.29-6.71 15-15 15s-15-6.71-15-15v-30c0-8.29 6.71-15 15-15s15 6.71 15 15zm65.395-40.605c5.859-5.86 15.351-5.86 21.21 0l30 30c5.86 5.859 5.86 15.351 0 21.21s-15.351 5.86-21.21 0l-30-30c-5.86-5.859-5.86-15.351 0-21.21M426.027 441.992c-45.152 30.13-102.316 30.797-146.75 6.547-12.941-7.07-30.636-8.16-43.172-1.055-44.765 25.368-104.015 24.254-148.64-5.492-3.985-2.594-17.317-5.46-30.102-2.328l34.453 64.484A15.02 15.02 0 0 0 105 512h302a15 15 0 0 0 13.184-7.852l34.785-65.222c-11.606-2.547-25.074.496-28.942 3.066M497 60c-8.29 0-15 6.71-15 15 0 8.277-6.723 15-15 15h-60c-24.812 0-45 20.188-45 45 0 8.29 6.71 15 15 15s15-6.71 15-15c0-8.277 6.723-15 15-15h60c24.813 0 45-20.187 45-45 0-8.29-6.71-15-15-15M452 15c0-8.29-6.71-15-15-15s-15 6.71-15 15c0 8.277-6.723 15-15 15h-60c-24.812 0-45 20.188-45 45 0 8.29 6.71 15 15 15s15-6.71 15-15c0-8.277 6.723-15 15-15h60c24.813 0 45-20.187 45-45m0 0" />
		<path d="M492.914 355.96c-29.965-11.663-79.719-9.44-107.887 5.786-23.129 12.453-51.535 13.008-72.496 1.145-33.34-18.957-77.066-18.97-110.453-.075-21.105 11.926-49.512 11.442-72.379-.937C100.555 346 48.773 344.324 18.676 356.69 7.5 361.277 0 372.703 0 385.11c0 20.641 22.281 35.918 41.266 28.114 21.547-8.871 49.914-4.82 62.84 3.808 34.308 22.88 81.437 24.621 117.238 4.336 21.105-11.937 50.656-11.543 73.304.832 35.227 19.219 79.38 18.422 114.739-5.168 13.086-8.722 41.25-12.91 61.203-4.73 17.328 7.101 41.41-4.324 41.41-28.04 0-12.495-7.676-23.874-19.086-28.3m0 0" />
	</svg>
);
const Memo = memo(SvgPie);
export default Memo;
