import type React from 'react';
import { useRef, useState } from 'react';
import { toSvgPoint } from './constants';

// VFL device cord port
const CORD_SNAP = { x: 38, y: 225 };
// Probe tip at LEFT face of SPL_OUT_NATURAL[1] connector (now x=250, center y=222)
const PROBE_TIP = { x: 250, y: 222 };
// Rotated +30° so body extends lower-LEFT: probe approaches from lower-left, aimed upper-right at left face
const PROBE_ANGLE = 30;
// Absolute probe handle bottom (cord exit), from local (0, 198) with rotate(+30°):
// abs_x = 250 + 0*cos30 - 198*sin30 = 250 - 99 = 151
// abs_y = 222 + 0*sin30 + 198*cos30 = 222 + 171.5 ≈ 394
const PROBE_CORD_EXIT = { x: 151, y: 394 };
const CORD_INIT = { x: 80, y: 390 };
const SNAP_DIST = 45;

interface FipMicroscopeProps {
	svgRef: React.RefObject<SVGSVGElement | null>;
	connected: boolean;
	onConnect: () => void;
}

export function FipMicroscope({
	svgRef,
	connected,
	onConnect
}: FipMicroscopeProps) {
	const [cordPos, setCordPos] = useState(connected ? CORD_SNAP : CORD_INIT);
	const [isDragging, setIsDragging] = useState(false);
	const dragRef = useRef<{
		px: number;
		py: number;
		cx: number;
		cy: number;
	} | null>(null);
	const cordCurrentRef = useRef(connected ? CORD_SNAP : CORD_INIT);

	const handleDown = (e: React.PointerEvent<SVGElement>) => {
		if (connected || !svgRef.current) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		const { x, y } = toSvgPoint(e, svgRef.current);
		dragRef.current = { px: x, py: y, cx: cordPos.x, cy: cordPos.y };
		setIsDragging(true);
	};

	const handleMove = (e: React.PointerEvent<SVGElement>) => {
		if (!dragRef.current || !svgRef.current) return;
		const { x, y } = toSvgPoint(e, svgRef.current);
		const p = {
			x: dragRef.current.cx + (x - dragRef.current.px),
			y: dragRef.current.cy + (y - dragRef.current.py)
		};
		cordCurrentRef.current = p;
		setCordPos(p);
	};

	const handleUp = () => {
		if (!dragRef.current) return;
		dragRef.current = null;
		setIsDragging(false);
		const pos = cordCurrentRef.current;
		const dist = Math.hypot(pos.x - CORD_SNAP.x, pos.y - CORD_SNAP.y);
		if (dist < SNAP_DIST) {
			cordCurrentRef.current = CORD_SNAP;
			setCordPos(CORD_SNAP);
			onConnect();
		} else {
			cordCurrentRef.current = CORD_INIT;
			setCordPos(CORD_INIT);
		}
	};

	const cordPath = connected
		? `M ${PROBE_CORD_EXIT.x} ${PROBE_CORD_EXIT.y} Q 80 450 ${CORD_SNAP.x} ${CORD_SNAP.y + 12}`
		: `M ${PROBE_CORD_EXIT.x} ${PROBE_CORD_EXIT.y} Q ${(PROBE_CORD_EXIT.x + cordPos.x) / 2} ${Math.max(PROBE_CORD_EXIT.y, cordPos.y) + 24} ${cordPos.x} ${cordPos.y + 12}`;

	return (
		<>
			{/* FIP port socket — recessed into bottom of VFL device */}
			<rect x={31} y={214} width={14} height={14} rx={2} fill="#374151" />
			<rect x={33.5} y={216} width={9} height={9} rx={1} fill="#111827" />

			{/* Cord from probe body to draggable end */}
			<path
				d={cordPath}
				stroke="#64748b"
				strokeWidth={4}
				fill="none"
				strokeLinecap="round"
			/>

			{/* Probe body — drawn in local coords, tip at origin, rotated into scene */}
			<g
				transform={`translate(${PROBE_TIP.x}, ${PROBE_TIP.y}) rotate(${PROBE_ANGLE})`}
			>
				{/* Thin insertion tip */}
				<rect x={-4} y={0} width={8} height={18} rx={2} fill="#94a3b8" />

				{/* Lens/sensor housing */}
				<rect x={-11} y={18} width={22} height={24} rx={5} fill="#1e293b" />
				<circle cx={0} cy={30} r={9} fill="#0f172a" />
				<circle cx={-3} cy={25} r={3} fill="white" fillOpacity={0.35} />

				{/* Body barrel */}
				<rect x={-8} y={42} width={16} height={88} rx={5} fill="#475569" />
				{/* Decorative ring */}
				<rect x={-8} y={70} width={16} height={3} rx={1} fill="#334155" />

				{/* Grip/handle */}
				<rect x={-12} y={130} width={24} height={58} rx={6} fill="#374151" />

				{/* Cord exit nub */}
				<rect x={-7} y={188} width={14} height={10} rx={3} fill="#1e293b" />
			</g>

			{/* Draggable connector plug */}
			<rect
				x={cordPos.x - 7}
				y={cordPos.y - 12}
				width={14}
				height={24}
				rx={3}
				fill={connected ? '#1e3a5f' : '#2d3748'}
				stroke={!connected ? '#60a5fa' : 'none'}
				strokeWidth={!connected ? 1.5 : 0}
				className={!connected ? 'fip-snap-ring' : undefined}
				style={{
					cursor: connected ? 'default' : isDragging ? 'grabbing' : 'grab'
				}}
				onPointerDown={handleDown}
				onPointerMove={handleMove}
				onPointerUp={handleUp}
			/>
			{/* Grip ring */}
			<rect
				x={cordPos.x - 7}
				y={cordPos.y - 2}
				width={14}
				height={3}
				rx={1}
				fill={connected ? '#334155' : '#4b5563'}
				style={{ pointerEvents: 'none' }}
			/>
			{/* Ferrule at insertion tip */}
			<circle
				cx={cordPos.x}
				cy={cordPos.y - 7}
				r={3.5}
				fill={connected ? '#172554' : '#1e293b'}
				style={{ pointerEvents: 'none' }}
			/>
		</>
	);
}
