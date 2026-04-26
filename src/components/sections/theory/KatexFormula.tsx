import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useEffect, useRef } from 'react';

interface KatexFormulaProps {
	latex: string;
	display?: boolean;
	className?: string;
}

export function KatexFormula({
	latex,
	display = false,
	className
}: KatexFormulaProps) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!ref.current) return;
		try {
			katex.render(latex, ref.current, {
				throwOnError: false,
				displayMode: display
			});
		} catch {
			if (ref.current) ref.current.textContent = latex;
		}
	}, [latex, display]);

	return <span ref={ref} className={className} />;
}
