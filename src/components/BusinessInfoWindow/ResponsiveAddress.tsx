import type { Location } from "../../types";

type DisplayAddress = [string, string];

export const generateDisplayAddress = (location: Location): DisplayAddress => {
	if (!location) return ["", ""];

	const lines = ["", ""] as DisplayAddress;
	lines[0] = `${location.address1 !== undefined && location.address1}${
		(location.address2 !== undefined &&
			location.address2 !== "" &&
			`${location.address2} `) ||
		""
	}${
		(location.address3 !== undefined &&
			location.address3 !== "" &&
			 `${location.address3} `) ||
		""
	},`;
	lines[1] = `${location.city}, ${location.state} ${location.zip_code}`;

	return lines;
};

interface ResponsiveAddressProps {
  location: Location;
}

export const ResponsiveAddress = ({
	location,
}: ResponsiveAddressProps) => {
  const displayAddress = generateDisplayAddress(location);

	return (
		<div className="flex flex-wrap justify-end text-sm text-neutral-700 text-right">
			<span>{displayAddress[0]}</span>
			<span className="ml-1">{displayAddress[1]}</span>
		</div>
	);
};
