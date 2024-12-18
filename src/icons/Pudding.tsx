import type { SVGProps } from 'react';
import { memo } from 'react';
const SvgPudding = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="true"
		height="true"
		viewBox="0 0 512 512"
		{...props}
	>
		<path d="M497 452H15c-8.285 0-15 6.715-15 15 0 24.852 20.148 45 45 45h422c24.852 0 45-20.148 45-45 0-8.285-6.715-15-15-15M256 0c-41.352 0-75 33.648-75 75v.309c-15.246 11.496-25.191 28.43-28.48 46.98-13.41 4.25-24.067 15.57-28.801 28.711h264.554c-4.71-13.059-15.257-24.336-28.55-28.633C353.672 87.04 323.027 60 286 60c-8.277 0-15-6.723-15-15V15c0-8.29-6.71-15-15-15M85.77 215.086l-6.555 26.223c16.14.785 30.996 8.914 40.012 22.441 7.941 11.926 27.101 11.926 35.039 0 9.492-14.238 25.37-22.734 42.48-22.734s32.988 8.496 42.48 22.734c7.938 11.926 27.102 11.926 35.04 0 9.492-14.238 25.37-22.734 42.48-22.734s32.988 8.496 42.48 22.734c7.938 11.926 27.098 11.926 35.04 0 8.879-13.305 23.082-20.93 38.597-22.137l-6.636-26.539C421.219 195.02 403.262 181 382.578 181H129.422a44.93 44.93 0 0 0-43.652 34.086m0 0" />
		<path d="M319.867 331.453c7.969-2.05 16.172 3.871 18.18 11.914L357.703 422h120l-37.289-150.184c-.785-.14-1.387-.703-2.203-.757-7.777-.645-14.75 2.96-18.984 9.332a50.95 50.95 0 0 1-42.48 22.734 50.95 50.95 0 0 1-42.477-22.734c-7.942-11.926-27.102-11.926-35.04 0-9.492 14.238-25.37 22.734-42.48 22.734s-32.988-8.496-42.48-22.734c-7.942-11.926-27.102-11.926-35.04 0-9.492 14.238-25.37 22.734-42.48 22.734s-32.988-8.496-42.48-22.734c-3.97-5.95-10.329-9.36-17.477-9.375h-.043c-1.898 0-3.52.828-5.281 1.289L34.297 422h120l19.656-78.633c1.992-8.043 10.152-13.992 18.18-11.914 8.043 2.008 12.933 11.152 10.914 19.18L185.203 422h141.594l-17.844-71.367c-2.02-8.028 2.871-17.172 10.914-19.18m0 0" />
	</svg>
);
const Memo = memo(SvgPudding);
export default Memo;
