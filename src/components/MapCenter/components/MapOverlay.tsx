import { AnimatePresence } from 'motion/react';
import React from 'react';
import type { Business, ElementBounds } from '../../../types';
import { BusinessInfoWindow } from '../../BusinessInfoWindow';
import { LoadingOverlay } from '../../LoadingOverlay';

interface MapOverlayProps {
	isFetching: boolean;
	message?: string;
	selectedBusiness: Business | undefined;
	onInfoWindowBoundsMeasured?: (bounds: ElementBounds) => void;
}

export const MapOverlay = React.memo(
	({
		isFetching,
		message,
		selectedBusiness,
		onInfoWindowBoundsMeasured,
	}: MapOverlayProps) => {
		return (
			<>
				<AnimatePresence>{isFetching && <LoadingOverlay />}</AnimatePresence>
				<AnimatePresence>
					{selectedBusiness && (
						<BusinessInfoWindow
							key={selectedBusiness.alias}
							business={selectedBusiness}
							onBoundsMeasured={onInfoWindowBoundsMeasured}
						/>
					)}
				</AnimatePresence>
			</>
		);
	},
);

MapOverlay.displayName = 'MapOverlay';
