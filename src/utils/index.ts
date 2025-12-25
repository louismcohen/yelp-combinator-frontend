import convert from "color-convert";
import { type ColorName, colorPalette } from '../constants/ColorPalette';

export const getHexColorByName = (nameInput: ColorName) => {
	const defaultColor = colorPalette.find((color) => color.name === 'jet');
	const identifiedColor = colorPalette.find(
		(color) => color.name === nameInput,
	);

	return identifiedColor ? identifiedColor.hex : defaultColor;
};

export const convertToKebabCase = (input: string) => {
	return input.replace(/([a-z0–9])([A-Z])/g, '$1-$2').toLowerCase();
};

export const getRandomMarkerDelay = () =>
	`${(Math.random() * 0.3).toFixed(2)}s`;

const removeHashFromHex = (hex: string) => {
	return hex.replace(/^#/, '');
};

export interface HslColor {
	h: number;
	s: number;
	l: number;
}

export const convertHexToHsl = (hex: string): HslColor | null => {
	// Remove the hash if it's present
	const hexWithoutHash = removeHashFromHex(hex);

	const hsl = convert.hex.hsl(hexWithoutHash);

	return {
		h: hsl[0],
		s: hsl[1],
		l: hsl[2],
	};
};

export const convertHexToRgb = (hex: string, alpha = 1) => {
	if (hex.length !== 4 && hex.length !== 7 && hex[0] !== '#') {
		console.log('invalid hex color', hex);
		return null;
	}

	// Remove the hash if it exists
	const hexWithoutHash = removeHashFromHex(hex);

	const rgb = convert.hex.rgb(hexWithoutHash);

	return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(2)})`;
};
