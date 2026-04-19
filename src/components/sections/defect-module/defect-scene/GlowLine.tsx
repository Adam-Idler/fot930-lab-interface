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
					strokeWidth={6}
					opacity={0.08}
					strokeLinecap="round"
				/>
				<line
					x1={x1}
					y1={y}
					x2={x2}
					y2={y}
					stroke="#f87171"
					strokeWidth={1.5}
					opacity={0.35}
					strokeLinecap="round"
					strokeDasharray="5 4"
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
				strokeWidth={12}
				opacity={0.1}
				strokeLinecap="round"
			/>
			<line
				x1={x1}
				y1={y}
				x2={x2}
				y2={y}
				stroke="#ef4444"
				strokeWidth={6}
				opacity={0.22}
				strokeLinecap="round"
			/>
			<line
				x1={x1}
				y1={y}
				x2={x2}
				y2={y}
				stroke="#ef4444"
				strokeWidth={2.5}
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

// Light leaking from damaged fiber: spreads perpendicular to the fiber axis (vertically),
// irregular shape — no perfect circles
export function DefectPoint({ cx, cy, found, onClick }: DefectPointProps) {
	return (
		<g
			onClick={found ? undefined : onClick}
			style={{ cursor: found ? 'default' : 'pointer' }}
		>
			{/* Hit area: rectangle covering the vertical scatter zone */}
			{!found && (
				<rect
					x={cx - 14}
					y={cy - 22}
					width={28}
					height={44}
					fill="transparent"
				/>
			)}
			{/* Outermost diffuse halo — slightly off-axis, mimics irregular scatter */}
			<ellipse
				cx={cx - 1}
				cy={cy - 1}
				rx={9}
				ry={20}
				fill="#ef4444"
				opacity={0.05}
			/>
			<ellipse
				cx={cx + 2}
				cy={cy + 2}
				rx={8}
				ry={17}
				fill="#ff4500"
				opacity={0.04}
			/>
			{/* Mid scatter — dominant vertical spread */}
			<ellipse cx={cx} cy={cy} rx={5} ry={13} fill="#ef4444" opacity={0.1} />
			<ellipse
				cx={cx - 1}
				cy={cy + 1}
				rx={4}
				ry={10}
				fill="#ef4444"
				opacity={0.13}
			/>
			{/* Bright inner zone — elongated along damage crack */}
			<ellipse cx={cx} cy={cy} rx={2.5} ry={5} fill="#fca5a5" opacity={0.7} />
			<ellipse cx={cx} cy={cy} rx={1.2} ry={1.8} fill="white" opacity={0.55} />
		</g>
	);
}
