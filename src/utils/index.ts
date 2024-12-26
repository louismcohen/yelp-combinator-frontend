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

export const randomMarkerDelay = (Math.random() * 0.3).toFixed(2) + 's';
