import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const isDev = mode === 'development';

	return {
		plugins: [
			tailwindcss(),
			react(),
			VitePWA({
				registerType: 'autoUpdate',
				strategies: 'generateSW',
				includeAssets: [
					'favicon.ico',
					'favicon.svg',
					'robots.txt',
					'apple-touch-icon.png',
					'yelp-combinator-64.png',
					'yelp-combinator-192.png',
					'yelp-combinator-512.png',
					'yelp-combinator-512-maskable.png',
				],
				// when using strategies 'injectManifest' you need to provide the srcDir
				// srcDir: 'src',
				// when using strategies 'injectManifest' use claims-sw.ts or prompt-sw.ts
				// filename: 'prompt-sw.ts',
				injectRegister: 'auto',
				manifest: {
					name: 'Yelp Combinator',
					short_name: 'Yelp Combinator',
					theme_color: '#111827',
					// background_color: '#111827',
					icons: [
						{
							src: 'yelp-combinator-64.png',
							sizes: '64x64',
							type: 'image/png',
						},
						{
							src: 'apple-touch-icon.png',
							sizes: '180x180',
							type: 'image/png',
							purpose: 'maskable',
						},
						{
							src: 'yelp-combinator-192.png',
							sizes: '192x192',
							type: 'image/png',
						},
						{
							src: 'yelp-combinator-512.png',
							sizes: '512x512',
							type: 'image/png',
						},
						{
							src: 'yelp-combinator-512-maskable.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'maskable',
						},
					],
					display: 'standalone',
				},
				pwaAssets: {
					disabled: false,
					config: true,
					htmlPreset: '2023',
					overrideManifestIcons: false,
				},
				workbox: {
					globPatterns: ['**/*.{js,css,html,svg,png,svg,ico}'],
					runtimeCaching: [
						{
							urlPattern:
								/^https:\/\/api\.yelp-combinator\.louiscohen\.me\/businesses\/all/,
							handler: 'CacheFirst',
							options: {
								cacheName: 'businesses-cache',
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 60 * 60 * 3, // 3 hours
								},
							},
						},
						{
							urlPattern:
								/^https:\/\/api\.yelp-combinator\.louiscohen\.me\/collections\/check-and-sync-updates/,
							handler: 'NetworkFirst',
							options: {
								cacheName: 'updates-cache',
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 60 * 60, // 1 hour
								},
							},
						},
						{
							urlPattern: /^https:\/\/api\.yelp-combinator\.louiscohen\.me\/.*/, // Other API endpoints
							handler: 'NetworkFirst',
							options: {
								cacheName: 'api-cache',
								expiration: {
									maxEntries: 50,
									maxAgeSeconds: 60 * 60 * 24, // 1 day
								},
							},
						},
					],
					cleanupOutdatedCaches: true,
					clientsClaim: true,
				},
				injectManifest: {
					globPatterns: ['**/*.{js,css,html,svg,png,svg,ico}'],
				},
				devOptions: {
					enabled: isDev,
					navigateFallback: 'index.html',
					suppressWarnings: true,
					/* when using generateSW the PWA plugin will switch to classic */
					type: 'module',
				},
			}),
		],
		server: isDev
			? {
					https: {
						key: fs.readFileSync(
							path.resolve(__dirname, './certificates/localhost-key.pem'),
						),
						cert: fs.readFileSync(
							path.resolve(__dirname, './certificates/localhost.pem'),
						),
					},
					host: 'localhost',
					port: 3000,
			  }
			: undefined,
	};
});
