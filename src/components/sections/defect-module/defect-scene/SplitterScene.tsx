import type React from 'react';
import { useRef, useState } from 'react';
import {
	BEAM_Y,
	CH,
	CONN_CENTER_Y,
	CONN_INIT_Y,
	CONNECTOR_COLOR,
	CW,
	FIBER_COLOR,
	SNAP_DIST,
	SPL_BEAM_END_X,
	SPL_BEAM_FORK_X,
	SPL_BEAM_START_X,
	SPL_FORK,
	SPL_INPUT_CONN,
	SPL_OUT_NATURAL,
	toSvgPoint,
	VFL_SNAP_X
} from './constants';
import { FipMicroscope } from './FipMicroscope';
import { DefectPoint, GlowLine } from './GlowLine';

interface SplitterSceneProps {
	svgRef: React.RefObject<SVGSVGElement | null>;
	splEffIdx: 0 | 1 | null;
	showBeam: boolean;
	beamBlink: boolean;
	defectFound: boolean;
	splActiveHasDefect: boolean;
	onSnap: (idx: 0 | 1) => void;
	onDefectClick: () => void;
	fipActive: boolean;
	fipConnected: boolean;
	onFipConnect: () => void;
}

export function SplitterScene({
	svgRef,
	splEffIdx,
	showBeam,
	beamBlink,
	defectFound,
	splActiveHasDefect,
	onSnap,
	onDefectClick,
	fipActive,
	fipConnected,
	onFipConnect
}: SplitterSceneProps) {
	const [splDragIdx, setSplDragIdx] = useState<0 | 1 | null>(null);
	const [splDragPos, setSplDragPos] = useState({ x: 0, y: 0 });
	const splDragRef = useRef<{
		px: number;
		py: number;
		cx: number;
		cy: number;
		i: 0 | 1;
	} | null>(null);
	const splCurrentRef = useRef({ x: 0, y: 0 });

	const getSplPos = (i: 0 | 1): { x: number; y: number } => {
		if (splDragIdx === i) return splDragPos;
		if (splEffIdx === i) return { x: VFL_SNAP_X, y: CONN_INIT_Y };
		return { x: SPL_OUT_NATURAL[i].x, y: SPL_OUT_NATURAL[i].y };
	};

	const makeSplDown = (i: 0 | 1) => (e: React.PointerEvent<SVGRectElement>) => {
		if (splEffIdx === i || !svgRef.current) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		const { x, y } = toSvgPoint(e, svgRef.current);
		const pos = getSplPos(i);
		splDragRef.current = { px: x, py: y, cx: pos.x, cy: pos.y, i };
		splCurrentRef.current = pos;
		setSplDragIdx(i);
		setSplDragPos(pos);
	};

	const makeSplMove = (i: 0 | 1) => (e: React.PointerEvent<SVGRectElement>) => {
		if (!splDragRef.current || splDragRef.current.i !== i || !svgRef.current)
			return;
		const { x, y } = toSvgPoint(e, svgRef.current);
		const p = {
			x: splDragRef.current.cx + (x - splDragRef.current.px),
			y: splDragRef.current.cy + (y - splDragRef.current.py)
		};
		splCurrentRef.current = p;
		setSplDragPos(p);
	};

	const makeSplUp = (i: 0 | 1) => () => {
		if (!splDragRef.current || splDragRef.current.i !== i) return;
		splDragRef.current = null;
		setSplDragIdx(null);
		const pos = splCurrentRef.current;
		const dist = Math.hypot(
			pos.x + CW / 2 - (VFL_SNAP_X + CW / 2),
			pos.y + CH / 2 - CONN_CENTER_Y
		);
		if (dist < SNAP_DIST) {
			onSnap(i);
		}
	};

	const spl0 = getSplPos(0);
	const spl1 = getSplPos(1);
	const spl0CanDrag = splEffIdx !== 0;
	const spl1CanDrag = splEffIdx !== 1;

	return (
		<>
			<line
				x1={SPL_FORK.x}
				y1={CONN_CENTER_Y}
				x2={SPL_INPUT_CONN.x}
				y2={CONN_CENTER_Y}
				stroke={FIBER_COLOR}
				strokeWidth={5}
				strokeLinecap="round"
			/>
			<line
				x1={spl0.x + CW}
				y1={spl0.y + CH / 2}
				x2={SPL_FORK.x}
				y2={CONN_CENTER_Y}
				stroke={FIBER_COLOR}
				strokeWidth={5}
				strokeLinecap="round"
			/>
			<line
				x1={spl1.x + CW}
				y1={spl1.y + CH / 2}
				x2={SPL_FORK.x}
				y2={CONN_CENTER_Y}
				stroke={FIBER_COLOR}
				strokeWidth={5}
				strokeLinecap="round"
			/>
			{showBeam && (
				<g className={beamBlink ? 'beam-blink' : undefined}>
					{splActiveHasDefect ? (
						<>
							<GlowLine
								x1={SPL_BEAM_START_X}
								x2={SPL_BEAM_FORK_X}
								y={BEAM_Y}
								dim
							/>
							<GlowLine
								x1={SPL_BEAM_FORK_X}
								x2={SPL_BEAM_END_X}
								y={BEAM_Y}
								dim
							/>
						</>
					) : (
						<GlowLine x1={SPL_BEAM_START_X} x2={SPL_BEAM_END_X} y={BEAM_Y} />
					)}
				</g>
			)}
			<rect
				x={SPL_INPUT_CONN.x}
				y={SPL_INPUT_CONN.y}
				width={CW}
				height={CH}
				rx={3}
				fill={CONNECTOR_COLOR}
			/>
			<text
				x={SPL_INPUT_CONN.x + CW / 2}
				y={SPL_INPUT_CONN.y + CH + 14}
				textAnchor="middle"
				fontSize={11}
				fill="#64748b"
			>
				Вход
			</text>
			<rect
				x={spl0.x}
				y={spl0.y}
				width={CW}
				height={CH}
				rx={3}
				fill={CONNECTOR_COLOR}
				stroke={spl0CanDrag ? '#3b82f6' : 'none'}
				strokeWidth={spl0CanDrag ? 2 : 0}
				className={spl0CanDrag ? 'drag-pulse' : undefined}
				style={{
					cursor: spl0CanDrag
						? splDragIdx === 0
							? 'grabbing'
							: 'grab'
						: 'default'
				}}
				onPointerDown={makeSplDown(0)}
				onPointerMove={makeSplMove(0)}
				onPointerUp={makeSplUp(0)}
			/>
			<text
				x={spl0.x + CW / 2}
				y={spl0.y - 7}
				textAnchor="middle"
				fontSize={10}
				fill="#64748b"
			>
				Выход 1
			</text>
			<rect
				x={spl1.x}
				y={spl1.y}
				width={CW}
				height={CH}
				rx={3}
				fill={CONNECTOR_COLOR}
				stroke={spl1CanDrag ? '#3b82f6' : 'none'}
				strokeWidth={spl1CanDrag ? 2 : 0}
				className={spl1CanDrag ? 'drag-pulse' : undefined}
				style={{
					cursor: spl1CanDrag
						? splDragIdx === 1
							? 'grabbing'
							: 'grab'
						: 'default'
				}}
				onPointerDown={makeSplDown(1)}
				onPointerMove={makeSplMove(1)}
				onPointerUp={makeSplUp(1)}
			/>
			<text
				x={spl1.x + CW / 2}
				y={spl1.y + CH + 14}
				textAnchor="middle"
				fontSize={10}
				fill="#64748b"
			>
				Выход 2
			</text>
			{showBeam && splActiveHasDefect && (
				<g className={beamBlink ? 'beam-blink' : undefined}>
					<DefectPoint
						cx={spl1.x + CW / 2}
						cy={BEAM_Y}
						found={defectFound}
						onClick={onDefectClick}
					/>
				</g>
			)}
			{fipActive && (
				<FipMicroscope
					svgRef={svgRef}
					connected={fipConnected}
					onConnect={onFipConnect}
				/>
			)}
		</>
	);
}
