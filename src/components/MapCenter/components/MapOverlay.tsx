import { AnimatePresence } from 'motion/react';
import React from 'react';
import type { Business, ElementBounds } from '../../../types';
import { BusinessInfoWindow } from '../../BusinessInfoWindow';

interface MapOverlayProps {
	selectedBusiness: Business | undefined;
	onInfoWindowBoundsMeasured?: (bounds: ElementBounds) => void;
}

export const MapOverlay = React.memo(
	({ selectedBusiness, onInfoWindowBoundsMeasured }: MapOverlayProps) => {
		return (
			<AnimatePresence>
				{selectedBusiness && (
					<BusinessInfoWindow
						key={selectedBusiness.alias}
						business={selectedBusiness}
						onBoundsMeasured={onInfoWindowBoundsMeasured}
					/>
				)}
			</AnimatePresence>
		);
	},
);

MapOverlay.displayName = 'MapOverlay';
