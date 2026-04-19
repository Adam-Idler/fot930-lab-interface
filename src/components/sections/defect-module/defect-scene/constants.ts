export const CW = 20;
export const CH = 40;
export const VFL_SNAP_X = 45;
export const CONN_INIT_Y = 80;
export const CONN_CENTER_Y = CONN_INIT_Y + CH / 2; // 100
export const SNAP_DIST = 48;
export const CONNECTOR_COLOR = '#475569';
export const FIBER_COLOR = '#94a3b8';

export const CABLE_CONN_INIT = { x: 158, y: CONN_INIT_Y };
export const CABLE_R_CONN = { x: 510, y: CONN_INIT_Y };

// Splitter: outputs LEFT, input RIGHT
export const SPL_FORK = { x: 308, y: CONN_CENTER_Y };
export const SPL_INPUT_CONN = { x: 488, y: CONN_INIT_Y };
export const SPL_OUT_NATURAL = [
	{ x: 88, y: 52 }, // Выход 1 (top)
	{ x: 88, y: 128 } // Выход 2 (bottom)
] as const;

export const BEAM_Y = CONN_CENTER_Y;
export const CABLE_BEAM_START_X = VFL_SNAP_X + CW; // 65
export const CABLE_BEAM_END_X = CABLE_R_CONN.x + CW; // 530
export const CABLE_DEFECT_X =
	CABLE_BEAM_START_X + (CABLE_BEAM_END_X - CABLE_BEAM_START_X) * 0.38; // ~242

export const SPL_BEAM_START_X = VFL_SNAP_X + CW; // 65
export const SPL_BEAM_FORK_X = SPL_FORK.x; // 308
export const SPL_BEAM_END_X = SPL_INPUT_CONN.x + CW - 2; // 506
export const SPL_DEFECT_OUTPUT_IDX = 1 as const; // Выход 2 has defect

export const VFL_CHARACTER_OPTIONS = [
	'Частичная утечка сигнала (изгиб)',
	'Сильное рассеяние в соединении',
	'Полный обрыв линии',
	'Сигнал без искажений'
] as const;

export function toSvgPoint(
	e: { clientX: number; clientY: number },
	svg: SVGSVGElement
) {
	const pt = svg.createSVGPoint();
	pt.x = e.clientX;
	pt.y = e.clientY;
	const ctm = svg.getScreenCTM();
	if (!ctm) return { x: 0, y: 0 };
	return pt.matrixTransform(ctm.inverse());
}
