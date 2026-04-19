import type React from 'react';
import { useRef, useState } from 'react';
import { toSvgPoint } from './constants';

const SNAP = { x: 25, y: 155 };
const CABLE_TOP = { x: 25, y: 216 };
const TIP_INIT = { x: 25, y: 188 };
const SNAP_DIST = 26;

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
	const [tipPos, setTipPos] = useState(connected ? SNAP : TIP_INIT);
	const [isDragging, setIsDragging] = useState(false);
	const dragRef = useRef<{
		px: number;
		py: number;
		cx: number;
		cy: number;
	} | null>(null);

	const handleDown = (e: React.PointerEvent<SVGCircleElement>) => {
		if (connected || !svgRef.current) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		const { x, y } = toSvgPoint(e, svgRef.current);
		dragRef.current = { px: x, py: y, cx: tipPos.x, cy: tipPos.y };
		setIsDragging(true);
	};

	const handleMove = (e: React.PointerEvent<SVGCircleElement>) => {
		if (!dragRef.current || !svgRef.current) return;
		const { x, y } = toSvgPoint(e, svgRef.current);
		setTipPos({
			x: dragRef.current.cx + (x - dragRef.current.px),
			y: dragRef.current.cy + (y - dragRef.current.py)
		});
	};

	const handleUp = () => {
		if (!dragRef.current) return;
		dragRef.current = null;
		setIsDragging(false);
		const dist = Math.hypot(tipPos.x - SNAP.x, tipPos.y - SNAP.y);
		if (dist < SNAP_DIST) {
			setTipPos(SNAP);
			onConnect();
		}
	};

	return (
		<>
			{/* Port at bottom of VFL device */}
			<circle cx={SNAP.x} cy={SNAP.y} r={5} fill="#1e293b" />
			<circle
				cx={SNAP.x}
				cy={SNAP.y}
				r={9}
				fill="none"
				stroke="#475569"
				strokeWidth={1.5}
			/>
			{!connected && (
				<circle
					cx={SNAP.x}
					cy={SNAP.y}
					r={16}
					fill="none"
					stroke="#3b82f6"
					strokeWidth={1.5}
					strokeDasharray="4 3"
					className="fip-snap-ring"
				/>
			)}
			{connected && (
				<>
					<circle cx={42} cy={148} r={8} fill="#22c55e" />
					<text
						x={42}
						y={152}
						textAnchor="middle"
						fontSize={10}
						fill="white"
						fontWeight="700"
					>
						✓
					</text>
				</>
			)}
			{/* Cable from microscope lens top to tip */}
			<line
				x1={CABLE_TOP.x}
				y1={CABLE_TOP.y}
				x2={tipPos.x}
				y2={tipPos.y}
				stroke={connected ? '#22c55e' : '#94a3b8'}
				strokeWidth={3}
				strokeLinecap="round"
			/>
			{/* Lens */}
			<circle
				cx={25}
				cy={228}
				r={12}
				fill="#1e293b"
				stroke="#475569"
				strokeWidth={2}
			/>
			<circle cx={25} cy={228} r={7} fill="#0f172a" />
			<circle cx={22} cy={224} r={2} fill="white" fillOpacity={0.4} />
			{/* Body */}
			<rect x={2} y={234} width={46} height={50} rx={4} fill="#475569" />
			<line
				x1={14}
				y1={238}
				x2={14}
				y2={276}
				stroke="#64748b"
				strokeWidth={1}
			/>
			<line
				x1={22}
				y1={238}
				x2={22}
				y2={276}
				stroke="#64748b"
				strokeWidth={1}
			/>
			<text
				x={25}
				y={253}
				textAnchor="middle"
				fontSize={9}
				fill="white"
				fontWeight="600"
			>
				FIP
			</text>
			<text x={25} y={265} textAnchor="middle" fontSize={7} fill="#94a3b8">
				Видео-
			</text>
			<text x={25} y={275} textAnchor="middle" fontSize={7} fill="#94a3b8">
				микроскоп
			</text>
			{/* Draggable tip */}
			<circle
				cx={tipPos.x}
				cy={tipPos.y}
				r={8}
				fill={connected ? '#22c55e' : '#3b82f6'}
				stroke="white"
				strokeWidth={2}
				className={!connected ? 'fip-tip-pulse' : undefined}
				style={{
					cursor: connected ? 'default' : isDragging ? 'grabbing' : 'grab'
				}}
				onPointerDown={handleDown}
				onPointerMove={handleMove}
				onPointerUp={handleUp}
			/>
			<circle
				cx={tipPos.x}
				cy={tipPos.y}
				r={3}
				fill="white"
				fillOpacity={0.7}
				style={{ pointerEvents: 'none' }}
			/>
		</>
	);
}
