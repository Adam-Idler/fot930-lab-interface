import postcssOklabFunction from '@csstools/postcss-oklab-function';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

// Убирает type="module" и абсолютные пути из финального HTML.
// Нужно для открытия через file:// — Chrome блокирует type="module" с null-origin.
function fileProtocolFix(): Plugin {
	return {
		name: 'file-protocol-fix',
		transformIndexHtml: {
			order: 'post',
			handler(html) {
				return html
					.replace(/<script\b[^>]*\bsrc=/g, '<script defer src=')
					.replace(/<link[^>]+href="\/vite\.svg"[^>]*>/g, '');
			}
		}
	};
}

export default defineConfig({
	base: './',
	plugins: [react(), tailwindcss(), fileProtocolFix()],
	css: {
		// Конвертирует oklch() → rgb() для совместимости с Chrome < 111 (Windows 7)
		postcss: {
			plugins: [postcssOklabFunction({ preserve: false })]
		}
	},
	build: {
		outDir: 'dist-web',
		modulePreload: false,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		},
		rollupOptions: {
			output: {
				format: 'iife',
				inlineDynamicImports: true
			}
		}
	}
});
