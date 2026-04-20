import type React from 'react';
import { useRef, useState } from 'react';
import { toSvgPoint } from './constants';

const SNAP = { x: 38, y: 233 };
const CABLE_TOP = { x: 38, y: 324 };
const TIP_INIT = { x: 38, y: 282 };
const SNAP_DIST = 39;

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
			<circle cx={SNAP.x} cy={SNAP.y} r={8} fill="#1e293b" />
			<circle
				cx={SNAP.x}
				cy={SNAP.y}
				r={14}
				fill="none"
				stroke="#475569"
				strokeWidth={2.5}
			/>
			{/* Cable from microscope lens top to tip */}
			<line
				x1={CABLE_TOP.x}
				y1={CABLE_TOP.y}
				x2={tipPos.x}
				y2={tipPos.y}
				stroke={'#94a3b8'}
				strokeWidth={5}
				strokeLinecap="round"
			/>
			{/* Lens */}
			<circle
				cx={38}
				cy={342}
				r={18}
				fill="#1e293b"
				stroke="#475569"
				strokeWidth={3}
			/>
			<circle cx={38} cy={342} r={11} fill="#0f172a" />
			<circle cx={33} cy={336} r={3} fill="white" fillOpacity={0.4} />
			{/* Body */}
			<rect x={3} y={351} width={69} height={75} rx={6} fill="#475569" />
			<text
				x={38}
				y={380}
				textAnchor="middle"
				fontSize={14}
				fill="white"
				fontWeight="600"
			>
				FIP
			</text>
			<text x={38} y={398} textAnchor="middle" fontSize={11} fill="#94a3b8">
				Видео-
			</text>
			<text x={38} y={413} textAnchor="middle" fontSize={11} fill="#94a3b8">
				микроскоп
			</text>
			{/* Draggable tip */}
			<circle
				cx={tipPos.x}
				cy={tipPos.y}
				r={12}
				fill={connected ? '#22c55e' : '#3b82f6'}
				stroke="white"
				strokeWidth={3}
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
				r={5}
				fill="white"
				fillOpacity={0.7}
				style={{ pointerEvents: 'none' }}
			/>
		</>
	);
}
