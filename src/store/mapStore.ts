import { LngLatLike } from 'mapbox-gl';
import { create } from 'zustand';

export interface Viewport {
	southwest: [number, number];
	northeast: [number, number];
}

interface MapStore {
	viewport: Viewport;
	updateViewport: (viewport: Viewport) => void;
}

export const useMapStore = create<MapStore>()((set) => ({
	viewport: {
		southwest: [0, 0],
		northeast: [0, 0],
	},
	updateViewport: (viewport: Viewport) => set({ viewport }),
}));
