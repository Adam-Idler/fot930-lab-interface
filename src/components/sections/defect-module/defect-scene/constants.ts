/** Logical SVG width; scene scales to full container width via viewBox */
export const SVG_VIEW_WIDTH = 900;
export const SVG_HEIGHT_CABLE = 300;
export const SVG_HEIGHT_FIP = 450;

export const CW = 48;
export const CH = 16;
export const VFL_SNAP_X = 68;
export const CONN_INIT_Y = 142;
export const CONN_CENTER_Y = CONN_INIT_Y + CH / 2;
export const SNAP_DIST = 72;
export const FIBER_COLOR = '#94a3b8';

export const CABLE_CONN_INIT = { x: 130, y: CONN_INIT_Y };
export const CABLE_R_CONN = { x: 730, y: CONN_INIT_Y };

// Splitter: outputs LEFT, input RIGHT
export const SPL_FORK = { x: 462, y: CONN_CENTER_Y };
export const SPL_INPUT_CONN = { x: 700, y: CONN_INIT_Y };
export const SPL_OUT_NATURAL = [
	{ x: 132, y: 100 }, // Выход 1 (top)
	{ x: 132, y: 214 } // Выход 2 (bottom)
] as const;

// Position of defect connector when FIP microscope is active (more room for probe approach)
export const SPL_FIP_EXAM_POS = { x: 250, y: 214 } as const;

export const BEAM_Y = CONN_CENTER_Y;
export const CABLE_BEAM_START_X = VFL_SNAP_X + CW; // 65
export const CABLE_BEAM_END_X = CABLE_R_CONN.x + CW - 3;
export const CABLE_DEFECT_X =
	CABLE_BEAM_START_X + (CABLE_BEAM_END_X - CABLE_BEAM_START_X) * 0.38; // ~242

export const SPL_BEAM_START_X = VFL_SNAP_X + CW; // 65
export const SPL_BEAM_FORK_X = SPL_FORK.x; // 308
export const SPL_BEAM_END_X = SPL_INPUT_CONN.x + CW - 10; // 506
export const SPL_DEFECT_OUTPUT_IDX = 1 as const; // Выход 2 has defect

export const VFL_CHARACTER_OPTIONS = [
	'Частичная утечка сигнала (изгиб)',
	'Сильное рассеяние в соединении',
	'Полный обрыв линии',
	'Повреждений не обнаружено'
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
