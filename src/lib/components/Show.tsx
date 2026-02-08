import type { ReactNode } from 'react';

interface ShowProps {
	when: boolean;
	children: ReactNode;
	fallback?: ReactNode;
}

export function Show({ when, fallback, children }: ShowProps) {
	if (when) {
		return children;
	}

	return fallback;
}
