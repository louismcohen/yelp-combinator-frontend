import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const isDev = mode === 'development';

	return {
		plugins: [react()],
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
