// Multi-layer glow line: no SVG filter (filters on zero-height lines don't render)
export function GlowLine({
	x1,
	x2,
	y,
	dim = false
}: {
	x1: number;
	x2: number;
	y: number;
	dim?: boolean;
}) {
	if (dim) {
		return (
			<>
				<line
					x1={x1}
					y1={y}
					x2={x2}
					y2={y}
					stroke="#f87171"
					strokeWidth={9}
					opacity={0.08}
					strokeLinecap="round"
				/>
				<line
					x1={x1}
					y1={y}
					x2={x2}
					y2={y}
					stroke="#f87171"
					strokeWidth={2.5}
					opacity={0.35}
					strokeLinecap="round"
					strokeDasharray="8 6"
				/>
			</>
		);
	}
	return (
		<>
			<line
				x1={x1}
				y1={y}
				x2={x2}
				y2={y}
				stroke="#ef4444"
				strokeWidth={18}
				opacity={0.1}
				strokeLinecap="round"
			/>
			<line
				x1={x1}
				y1={y}
				x2={x2}
				y2={y}
				stroke="#ef4444"
				strokeWidth={9}
				opacity={0.22}
				strokeLinecap="round"
			/>
			<line
				x1={x1}
				y1={y}
				x2={x2}
				y2={y}
				stroke="#ef4444"
				strokeWidth={4}
				opacity={1}
				strokeLinecap="round"
			/>
		</>
	);
}

interface DefectPointProps {
	cx: number;
	cy: number;
	found: boolean;
	onClick: () => void;
}

// Light leaking from damaged fiber: spreads perpendicular to the fiber axis (vertically)
export function DefectPoint({ cx, cy, found, onClick }: DefectPointProps) {
	return (
		<g
			onClick={found ? undefined : onClick}
			style={{ cursor: found ? 'default' : 'pointer' }}
		>
			{!found && (
				<rect
					x={cx - 20}
					y={cy - 22}
					width={40}
					height={44}
					fill="transparent"
				/>
			)}
			<circle cx={cx} cy={cy} r={20} fill="#ef4444" opacity={0.08} />
			<circle cx={cx} cy={cy} r={12} fill="#ef4444" opacity={0.18} />
			<circle cx={cx} cy={cy} r={6} fill="#ef4444" opacity={0.9} />
			<circle cx={cx} cy={cy} r={2.5} fill="white" opacity={0.8} />
		</g>
	);
}
