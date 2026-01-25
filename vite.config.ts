import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';

// https://vite.dev/config/
export default defineConfig({
	base: './',
	plugins: [
		react(),
		tailwindcss(),
		electron([
			{
				entry: 'electron/main.ts'
			},
			{
				entry: 'electron/preload.ts',
				onstart(options) {
					options.reload();
				}
			}
		])
	],
	server: {
		host: '0.0.0.0',
		port: 1420
	}
});
