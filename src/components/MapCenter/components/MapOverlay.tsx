import { AnimatePresence } from 'motion/react';
import React from 'react';
import type { Business } from '../../../types';
import { BusinessInfoWindow } from '../../BusinessInfoWindow';
import { LoadingOverlay } from '../../LoadingOverlay';

interface MapOverlayProps {
	isFetching: boolean;
	message?: string;
	selectedBusiness: Business | undefined;
}

export const MapOverlay = React.memo(
	({ isFetching, message, selectedBusiness }: MapOverlayProps) => {
		return (
			<>
				<AnimatePresence>{isFetching && <LoadingOverlay />}</AnimatePresence>
				<AnimatePresence>
					{selectedBusiness && (
						<BusinessInfoWindow
							key={selectedBusiness.alias}
							business={selectedBusiness}
						/>
					)}
				</AnimatePresence>
			</>
		);
	},
);

MapOverlay.displayName = 'MapOverlay';

