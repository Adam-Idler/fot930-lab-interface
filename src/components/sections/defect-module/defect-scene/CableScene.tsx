import type React from 'react';
import { useRef, useState } from 'react';
import {
	BEAM_Y,
	CABLE_BEAM_END_X,
	CABLE_BEAM_START_X,
	CABLE_CONN_INIT,
	CABLE_DEFECT_X,
	CABLE_R_CONN,
	CH,
	CONN_CENTER_Y,
	CONN_INIT_Y,
	CONNECTOR_COLOR,
	CW,
	FIBER_COLOR,
	SNAP_DIST,
	toSvgPoint,
	VFL_SNAP_X
} from './constants';
import { DefectPoint, GlowLine } from './GlowLine';

interface CableSceneProps {
	svgRef: React.RefObject<SVGSVGElement | null>;
	isConnected: boolean;
	showBeam: boolean;
	beamBlink: boolean;
	defectFound: boolean;
	onConnect: () => void;
	onDefectClick: () => void;
}

export function CableScene({
	svgRef,
	isConnected,
	showBeam,
	beamBlink,
	defectFound,
	onConnect,
	onDefectClick
}: CableSceneProps) {
	const [cablePos, setCablePos] = useState(CABLE_CONN_INIT);
	const [cableIsDragging, setCableIsDragging] = useState(false);
	const cableDragRef = useRef<{
		px: number;
		py: number;
		cx: number;
		cy: number;
	} | null>(null);
	const cableCurrentRef = useRef(CABLE_CONN_INIT);

	const displayX = isConnected ? VFL_SNAP_X : cablePos.x;
	const displayY = isConnected ? CONN_INIT_Y : cablePos.y;
	const fiberX = displayX + CW;
	const arrowTipX = VFL_SNAP_X + CW + 2;

	const handleDown = (e: React.PointerEvent<SVGRectElement>) => {
		if (isConnected || !svgRef.current) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		const { x, y } = toSvgPoint(e, svgRef.current);
		cableDragRef.current = { px: x, py: y, cx: cablePos.x, cy: cablePos.y };
		setCableIsDragging(true);
	};

	const handleMove = (e: React.PointerEvent<SVGRectElement>) => {
		if (!cableDragRef.current || !svgRef.current) return;
		const { x, y } = toSvgPoint(e, svgRef.current);
		const p = {
			x: cableDragRef.current.cx + (x - cableDragRef.current.px),
			y: cableDragRef.current.cy + (y - cableDragRef.current.py)
		};
		cableCurrentRef.current = p;
		setCablePos(p);
	};

	const handleUp = () => {
		if (!cableDragRef.current) return;
		cableDragRef.current = null;
		setCableIsDragging(false);
		const pos = cableCurrentRef.current;
		const dist = Math.hypot(
			pos.x + CW / 2 - (VFL_SNAP_X + CW / 2),
			pos.y + CH / 2 - CONN_CENTER_Y
		);
		if (dist < SNAP_DIST) {
			const snapped = { x: VFL_SNAP_X, y: CONN_INIT_Y };
			cableCurrentRef.current = snapped;
			setCablePos(snapped);
			onConnect();
		} else {
			cableCurrentRef.current = CABLE_CONN_INIT;
			setCablePos(CABLE_CONN_INIT);
		}
	};

	return (
		<>
			{!isConnected && (
				<>
					<line
						x1={displayX}
						y1={CONN_CENTER_Y}
						x2={arrowTipX + 6}
						y2={CONN_CENTER_Y}
						stroke="#3b82f6"
						strokeWidth={1.5}
						strokeDasharray="5 4"
						opacity={0.35}
					/>
					<polygon
						points={`${arrowTipX + 8},${CONN_CENTER_Y - 5} ${arrowTipX},${CONN_CENTER_Y} ${arrowTipX + 8},${CONN_CENTER_Y + 5}`}
						fill="#3b82f6"
						opacity={0.5}
					/>
				</>
			)}
			<line
				x1={fiberX}
				y1={CONN_CENTER_Y}
				x2={CABLE_R_CONN.x}
				y2={CONN_CENTER_Y}
				stroke={FIBER_COLOR}
				strokeWidth={5}
				strokeLinecap="round"
			/>
			<text
				x={(fiberX + CABLE_R_CONN.x) / 2}
				y={88}
				textAnchor="middle"
				fontSize={11}
				fill={FIBER_COLOR}
			>
				Оптический шнур
			</text>
			{showBeam && (
				<g className={beamBlink ? 'beam-blink' : undefined}>
					<GlowLine x1={CABLE_BEAM_START_X} x2={CABLE_DEFECT_X} y={BEAM_Y} />
					<GlowLine x1={CABLE_DEFECT_X} x2={CABLE_BEAM_END_X} y={BEAM_Y} dim />
				</g>
			)}
			<rect
				x={displayX}
				y={displayY}
				width={CW}
				height={CH}
				rx={3}
				fill={CONNECTOR_COLOR}
				stroke={!isConnected ? '#3b82f6' : 'none'}
				strokeWidth={!isConnected ? 2 : 0}
				className={!isConnected ? 'drag-pulse' : undefined}
				style={{
					cursor: isConnected
						? 'default'
						: cableIsDragging
							? 'grabbing'
							: 'grab'
				}}
				onPointerDown={handleDown}
				onPointerMove={handleMove}
				onPointerUp={handleUp}
			/>
			<text
				x={displayX + CW / 2}
				y={displayY + CH + 14}
				textAnchor="middle"
				fontSize={11}
				fill="#64748b"
			>
				SC/UPC
			</text>
			<rect
				x={CABLE_R_CONN.x}
				y={CABLE_R_CONN.y}
				width={CW}
				height={CH}
				rx={3}
				fill={CONNECTOR_COLOR}
			/>
			<text
				x={CABLE_R_CONN.x + CW / 2}
				y={CABLE_R_CONN.y + CH + 14}
				textAnchor="middle"
				fontSize={11}
				fill="#64748b"
			>
				SC/UPC
			</text>
			{showBeam && (
				<g className={beamBlink ? 'beam-blink' : undefined}>
					<DefectPoint
						cx={CABLE_DEFECT_X}
						cy={BEAM_Y}
						found={defectFound}
						onClick={onDefectClick}
					/>
				</g>
			)}
		</>
	);
}
