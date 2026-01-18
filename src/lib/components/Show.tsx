import type { JSX } from 'react';

interface ShowProps {
	when: boolean;
	children: JSX.Element;
	fallback?: JSX.Element;
}

export function Show({ when, fallback, children }: ShowProps) {
	if (when) {
		return children;
	}

	return fallback;
}
