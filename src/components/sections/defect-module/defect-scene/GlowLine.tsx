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
					x={cx - 21}
					y={cy - 33}
					width={42}
					height={66}
					fill="transparent"
				/>
			)}
			{/* Outermost diffuse halo — slightly off-axis, mimics irregular scatter */}
			<ellipse
				cx={cx - 2}
				cy={cy - 2}
				rx={14}
				ry={30}
				fill="#ef4444"
				opacity={0.05}
			/>
			<ellipse
				cx={cx + 3}
				cy={cy + 3}
				rx={12}
				ry={26}
				fill="#ff4500"
				opacity={0.04}
			/>
			{/* Mid scatter — dominant vertical spread */}
			<ellipse cx={cx} cy={cy} rx={8} ry={20} fill="#ef4444" opacity={0.1} />
			<ellipse
				cx={cx - 2}
				cy={cy + 2}
				rx={6}
				ry={15}
				fill="#ef4444"
				opacity={0.13}
			/>
			{/* Bright inner zone — elongated along damage crack */}
			<ellipse cx={cx} cy={cy} rx={4} ry={8} fill="#fca5a5" opacity={0.7} />
			<ellipse cx={cx} cy={cy} rx={2} ry={3} fill="white" opacity={0.55} />
		</g>
	);
}
