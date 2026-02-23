/**
 * Resolves a public asset path using Vite's BASE_URL.
 * Required for Electron builds where HTML is loaded via file:// protocol.
 *
 * @example publicUrl('/images/icons/icon.svg') → './images/icons/icon.svg'
 */
export function publicUrl(path: string): string {
	return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
