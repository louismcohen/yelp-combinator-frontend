import * as IconSvgs from '../icons';
import { convertToKebabCase, getHexColorByName } from '.';
import { iconMapping } from '../constants/IconMapping';
import { ColorName } from '../constants/ColorPalette';

type IconKey = keyof typeof IconSvgs;

const defaultTotalSize = 23;
const defaultSize = 16;
const defaultMargin = defaultTotalSize - defaultSize;
const DEFAULT_COLOR: ColorName = 'yelpRed';

const iconPngs: Record<string, string> = {};
const iconFiles = import.meta.glob('../icons/png/*.png', { eager: true });
for (const path in iconFiles) {
	const filename = path.split('/').pop()?.replace('.png', '');
	if (filename) {
		iconPngs[filename] = (iconFiles[path] as { default: string }).default;
	}
}

// console.log({iconPngs});

interface IconProps {
	style: {
		margin: string;
		display: string;
	};
	fill: string;
	height: string;
	width: string;
}

const defaultProps: IconProps = {
	style: {
		margin: `${defaultMargin}px`,
		display: 'block',
	},
	fill: '#ffffff',
	// filter: `${{CssFilterConverter.hexToFilter('#fffffff').color}}`,
	height: `${defaultSize}px`,
	width: `${defaultSize}px`,
};

const DEFAULT_ICON: IconKey = 'Restaurant';

const generateIconPngUrl = (categoryAlias: string) => {
	const category = iconMapping.find(
		(category) => category.alias === categoryAlias,
	);
	const iconName = category
		? convertToKebabCase(category.icon)
		: convertToKebabCase(DEFAULT_ICON);
	const icon = iconPngs[iconName];

	return icon;
};

const generateIconPngFromCategoryAlias = (
	categoryAlias: string,
	props: IconProps = defaultProps,
) => {
	const icon = generateIconPngUrl(categoryAlias);

	return <img src={icon} alt={icon} {...props} />;
};

const generateIconFromCategoryAlias = (
	categoryAlias: string,
	props: IconProps = defaultProps,
) => {
	const category = iconMapping.find(
		(category) => category.alias === categoryAlias,
	);
	const categoryIcon = category?.icon as IconKey;

	const Icon = category
		? IconSvgs[categoryIcon || DEFAULT_ICON]
		: IconSvgs[DEFAULT_ICON];
	const IconWithProps = Icon(props);
	return IconWithProps;
};

interface IconGeneratedProps {
	categoryAlias: string;
	iconProps?: Partial<IconProps>;
}

export const IconGenerated = ({
	categoryAlias,
	iconProps = defaultProps,
}: IconGeneratedProps) => {
	const category = iconMapping.find(
		(category) => category.alias === categoryAlias,
	);
	const categoryIcon = category?.icon || (DEFAULT_ICON as IconKey);

	const IconComponent = (IconSvgs as any)[categoryIcon];

	const props = { ...defaultProps, ...iconProps };

	return <IconComponent {...props} />;
};

const generateHexColorFromCategoryAlias = (categoryAlias: string): string => {
	const category = iconMapping.find(
		(category) => category.alias === categoryAlias,
	);
	const colorHex = getHexColorByName(
		category ? category.color || DEFAULT_COLOR : DEFAULT_COLOR,
	);
	return colorHex as string;
};

export {
	generateIconPngUrl,
	generateIconFromCategoryAlias,
	generateIconPngFromCategoryAlias,
	generateHexColorFromCategoryAlias,
};

// svgr ./src/icons/svg --out-dir ./src/icons --typescript --memo --jsx-runtime automatic --icon true
