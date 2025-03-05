import { ColorName, colorPalette } from '../constants/ColorPalette';

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
	(Math.random() * 0.3).toFixed(2) + 's';

export interface HslColor {
	h: number;
	s: number;
	l: number;
}

export const convertHexToHsl = (hex: string): HslColor | null => {
	// Remove the hash if it's present
	hex = hex.replace(/^#/, '');

	// Parse r, g, b values from the hex string
	if (hex.length === 3) {
		// Short format: #RGB -> #RRGGBB
		hex = hex
			.split('')
			.map((char) => char + char)
			.join('');
	}

	if (hex.length !== 6) {
		return null; // Invalid hex format
	}

	const r = parseInt(hex.slice(0, 2), 16) / 255;
	const g = parseInt(hex.slice(2, 4), 16) / 255;
	const b = parseInt(hex.slice(4, 6), 16) / 255;

	// Calculate min, max, and delta
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	// Calculate lightness
	const l = (max + min) / 2;

	// Calculate saturation
	let s = 0;
	if (delta !== 0) {
		s = delta / (1 - Math.abs(2 * l - 1));
	}

	// Calculate hue
	let h = 0;
	if (delta !== 0) {
		if (max === r) {
			h = ((g - b) / delta) % 6;
		} else if (max === g) {
			h = (b - r) / delta + 2;
		} else if (max === b) {
			h = (r - g) / delta + 4;
		}
		h = Math.round(h * 60);
		if (h < 0) {
			h += 360;
		}
	}

	// Convert saturation and lightness to percentages
	const sPercent = Math.round(s * 100);
	const lPercent = Math.round(l * 100);

	return { h: Math.round(h), s: sPercent, l: lPercent };
};

export const convertHexToRgb = (hex: string, alpha: number = 1) => {
	console.log('convert', hex);
	if (hex.length !== 4 && hex.length !== 7 && hex[0] !== '#') {
		console.log('invalid');
		return null;
	}

	// Remove the hash if it exists
	hex = hex.replace('#', '');

	// Handle short form (e.g., "ABC")
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}

	// Parse the hex value to integers
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
};
